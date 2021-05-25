import { EventEmitter } from 'events';
import amqp from 'amqplib';
import { getLogger } from 'log4js';
import { wait } from '../utils/commonUtils';

const logger = getLogger('QueueManager');
export type Queues = 'trading_queue';
export type ConnecitonState = 'disconnected' | 'connecting' | 'connected';

export class QueueManager extends EventEmitter {
  static _instance?: QueueManager;

  _url?: string;
  _connection?: amqp.Connection;
  _channel?: amqp.Channel;
  state: ConnecitonState;

  constructor(url?: string) {
    super();
    this._url = url;
    this.state = 'disconnected';
  }

  static async init(url = process.env.RABBITMQ_URL) {
    if (!this._instance) {
      this._instance = new QueueManager(url);
    }
    if (url && this._instance._url !== url) {
      logger.warn(`New URL is provided. This scenario is not supported yet. Old URL: '${this._instance._url}', new URL: ${url}`);
    }

    return this._instance;
  }

  async _connect() {
    if (!this._url) {
      throw new Error('Need to initialize queue with url first');
    }
    if (this._connection) {
      return this._connection;
    }
    if (this.state === 'disconnected') {
      logger.info(`Connecting to rabbitmq server: ${this._url}...`);
      this.state = 'connecting';
      try {
        const conn = await amqp.connect(this._url);
        conn.on('error', err => {
          logger.error('Connection error', err);
        });
        conn.once('close', async () => {
          logger.info(`Connection was closed to ${this._url}. Reconnecting...`)
          this.state = 'disconnected';
          this._channel?.close();
          delete this._channel;
          delete this._connection;
          this._connect();
        });
        this._channel = await conn.createChannel();
        this._channel.on('error', err => {
          logger.error('Channel error', err);
        });
        this._connection = conn;
        this.state = 'connected';
        logger.info(`Connected to ${this._url}`);
      } catch (err) {
        logger.error(`Error connecting to ${this._url}. ${err.message}. Reconnecting...`);
        logger.debug(err);
        delete this._connection;
        await wait(3000);
        this.state = 'disconnected';
        await this._connect();
      }
    }
    // wait while connecting
    while (!this._connection) await wait(100);

    return this._connection;
  }

  static async sendToQueue(queue: Queues, data: Buffer) {
    if (!this._instance) {
      throw new Error('First init the queue manager');
    }
    const mq = this._instance;
    await mq._connect();

    const channel = mq._channel!;
  
    await channel.assertQueue(queue, {
      // We don't want to loose trades
      durable: true,
    });
    logger.trace(`Sending message (${data.byteLength} bytes)...`);

    return channel.sendToQueue(queue, data, { persistent: true, type: 'quorum'  });
  }
}
