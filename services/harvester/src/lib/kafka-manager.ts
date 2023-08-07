import { EventEmitter } from 'events';
import { Admin, Kafka, Producer, logLevel } from 'kafkajs';
import { getLogger } from 'log4js';
import { wait } from '../utils/commonUtils';
import assert from 'assert';
import { Mutex } from './common/mutex';
import { QueueName } from '@tradepump/types';

const logger = getLogger('KafkaManager');
export type ConnecitonState = 'disconnected' | 'connecting' | 'connected';

export interface KafkaManagerProps {
  brokers: string[];
  clientId?: string;
  producerTimeout?: number;
}

export class KafkaManager extends EventEmitter {
  static _instance?: KafkaManager;

  _kafka: Kafka;
  _channel?: Producer;
  _timer?: NodeJS.Timeout;
  _timeout: number;
  _topics: Set<string> = new Set();
  _mutex: Mutex = new Mutex();
  state: ConnecitonState;

  constructor({ brokers, producerTimeout }: KafkaManagerProps) {
    super();
    this.state = 'disconnected';
    this._timeout = producerTimeout ?? 1000;
    this._kafka = new Kafka({
      clientId: "tradepump-harvester",
      brokers,
      authenticationTimeout: 1000,
      connectionTimeout: 1000,
      ssl: false,
      logLevel: getKafkaLogLevel(),
      retry: {
        initialRetryTime: 1000,
        maxRetryTime: 15000,
        multiplier: 3,
        retries: 1000,
      },
    });
  }

  static async init(url: string, timeout = 1000) {
    if (!this._instance) {
      assert(url, "At least one broker host must be specified");
      this._instance = new KafkaManager({
        brokers: url.split(","),
        producerTimeout: timeout,
      });
    }

    return this._instance;
  }

  private _refresh() {
    if (this._timer) {
      clearTimeout(this._timer);
      delete this._timer;
    }
    if (this._channel) {
      this._timer = setTimeout(async () => {
        await this._channel?.disconnect();
        delete this._channel;
        this.state = "disconnected";
        logger.info("Producer disconnected as stale");
      }, this._timeout);
    }
  }

  private async _connect() {
    if (this._channel) {
      this._refresh();
      return this._channel;
    }
    if (this.state === 'disconnected') {
      logger.info(`Connecting to kafka server...`);
      this.state = 'connecting';
      try {
        const conn = this._kafka?.producer();
        if (!conn) {
          throw new Error(`Could not create a Kafka producer`);
        }
        await conn.connect();
        this._channel = conn;
        this.state = 'connected';
        this._refresh();
        logger.info(`Producer created`);
        return this._channel;
      } catch (err) {
        const msg = err instanceof Error ? err.message : err;
        logger.error(`Error connecting to broker. ${msg}. Reconnecting...`);
        logger.debug(err);
        delete this._channel;
        await wait(3000);
        this.state = 'disconnected';
        await this._connect();
      }
    }
    // wait while connecting
    logger.info(`Waiting for producer...`);
    const time = Date.now();
    while (!this._channel) await wait(100);
    logger.info(`Producer available in ${Date.now() - time}ms`);

    return this._channel;
  }

  private async admin(): Promise<Admin> {
    try {
      const admin = this._kafka.admin();
      await admin.connect();
      logger.info(`Admin connected`);
      return admin;
    } catch (err) {
      const msg = err instanceof Error ? err.message : err;
      logger.error(`Error connecting to admin. ${msg}. Reconnecting...`);
      logger.debug(err);
      await wait(3000);
      return this.admin();
    }
  }

  static async ensureTopic(name: QueueName): Promise<void> {
    if (!this._instance) {
      throw new Error('First init the queue manager');
    }
    const kafka = this._instance;

    await kafka._mutex.lock();
    if (kafka._topics.has(name)) {
      return;
    }
    logger.info(`Topic '${name}' not found in cache, getting list in kafka`);
    const admin = await kafka.admin();

    // Cache all topics on a first run
    if (kafka._topics.size === 0) {
      const topics = await admin.listTopics();
      for (const topic of topics) {
        kafka._topics.add(topic);
      }
    }
    if (kafka._topics.has(name)) {
      kafka._mutex.unlock();
      return;
    }
    logger.info(`Topic '${name}' not found, creating...`);
    const ok = await admin.createTopics({
      topics: [{
        topic: name,
      }]
    });
    await admin.disconnect();

    if (!ok) {
      kafka._mutex.unlock();
      throw new Error(`Failed to create topic: '${name}'`);
    }
    kafka._topics.add(name);
    kafka._mutex.unlock();
  }

  static async sendToQueue(queue: QueueName, data: Buffer) {
    if (!this._instance) {
      throw new Error('First init the queue manager');
    }
    const kafka = this._instance;
    logger.debug(`Connecting to kafka as producer`);
    const channel = await kafka._connect();

    logger.trace(`Sending message to ${queue} (${data.byteLength} bytes)...`);
    const metadata = await channel.send({
      topic: queue,
      messages: [
        {
          value: data,
        }
      ],
    });
    logger.debug(`Sent, got metadata:`, metadata);

    return metadata.length > 0;
  }
}

function getKafkaLogLevel() {
  const level = process.env.LOG_LEVEL ?? "INFO";

  if (level in logLevel) {
    return logLevel[level as keyof typeof logLevel];
  }
  return logLevel.INFO;
}
