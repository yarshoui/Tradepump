import { MetricsAgent } from '@tradepump/monitoring';
import { BookModel, QueueName, TradeModel, encodeBookMessage, encodeTradeMessage, isCurrencyPair } from '@tradepump/types';
import { getLogger } from 'log4js';
import { setupLog4js } from './config/logging';
import { DataEvent, actions } from './lib/common/DataActions';
import { KafkaManager } from './lib/kafka-manager';
import { RabbitMQManager } from './lib/rabbitmq-manager';
import { BinanceSocket, BitfinexSocket, BitstampSocket, KrakenSocket } from './lib/sockets';
import { BaseSocket } from './lib/sockets/base-socket';

const shouldUseRabbitMQ = process.env.MESSAGE_STREAM === "rabbitmq";
const queueUrl = process.env.MESSAGE_QUEUE_URL;
const defaultPairs = (process.env.TRADING_PAIRS ?? 'BTC/EUR,BTC/USD,BTC/USDT')
  .split(',')
  .map(s => s.trim().toUpperCase());

setupLog4js(process.env.LOG_LEVEL);
const logger = getLogger('Producer');

/**
 * Initialize everything needed
 */
async function init(): Promise<BaseSocket[]> {
  MetricsAgent.start({ port: 19091 });
  logger.info(`Initializing Queue Manager...`);
  if (!queueUrl) {
    throw new Error("MESSAGE_QUEUE_URL is not set");
  }
  if (!defaultPairs.every(isCurrencyPair)) {
    throw new Error(`Error in TRADING_PAIRS specified: '${defaultPairs}'`);
  }
  const manager = shouldUseRabbitMQ ? RabbitMQManager : KafkaManager;
  await manager.init(queueUrl);
  await manager.ensureTopic(QueueName.TradingQueue);
  const sendToTradingQueue = (action: actions) => {
    const uintArr = action.type === DataEvent.BOOK_UPDATE
      ? encodeBookMessage({ models: action.payload as BookModel[] })
      : encodeTradeMessage({ models: action.payload as TradeModel[] });
    const model = Buffer.from([action.type === DataEvent.BOOK_UPDATE ? 1 : 2]);

    logger.debug(`Received action: ${action.type}, ${JSON.stringify(action.payload).substring(0, 32)}...`);
    manager.sendToQueue(QueueName.TradingQueue, Buffer.concat([model, Buffer.from(uintArr.buffer, uintArr.byteOffset, uintArr.byteLength)]));
  };

  // Initialize sockets
  return [
    new KrakenSocket(sendToTradingQueue, defaultPairs),
    new BitfinexSocket(sendToTradingQueue, defaultPairs),
    new BinanceSocket(sendToTradingQueue, defaultPairs),
    new BitstampSocket(sendToTradingQueue, defaultPairs),
  ];
}

init()
  .catch(err => {
    logger.fatal(err);
    process.exit(1);
  });
