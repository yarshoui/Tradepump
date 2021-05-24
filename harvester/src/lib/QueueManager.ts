import { EventEmitter } from 'events';
import amqp from 'amqplib';
import { getLogger } from 'log4js';

const logger = getLogger('QueueManager');
export type Queues = 'trading_queue';

export class QueueManager extends EventEmitter {
  static _instance?: QueueManager;

  _url?: string;
  _connection?: amqp.Connection;
  _channel?: amqp.Channel;

  constructor(url?: string) {
    super();
    this._url = url;
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
    if (!this._connection) {
      logger.info(`Connecting to rabbitmq server: ${this._url}...`);
      this._connection = await amqp.connect(this._url);
    }


    return this._connection;
  }

  async _getChannel() {
    const conn = await this._connect();

    if (!this._channel) {
      logger.info('Creating a channel...');
      this._channel = await conn.createChannel();
    }

    return this._channel;
  }

  static async sendToQueue(queue: Queues, data: Buffer) {
    if (!this._instance) {
      throw new Error('First init the queue manager');
    }
    const mq = this._instance;

    const channel = await mq._getChannel();
  
    await channel.assertQueue(queue, {
      // We don't want to loose trades
      durable: true,
    });
    logger.trace(`Sending message (${data.byteLength} bytes)...`);

    return channel.sendToQueue(queue, data, { persistent: true, type: 'quorum'  });
  }
}
