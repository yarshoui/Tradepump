import { getLogger } from 'log4js';
import { encode } from '@msgpack/msgpack';
import { isCurrencyPair } from '@tradepump/types';
import { setupLog4js } from './config/logging';
import { QueueManager } from './lib/QueueManager';
import { KrakenSocket } from './lib/KrakenSocket';
import { actions } from './lib/common/DataActions';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost';
const DEFAULT_PAIRS = (process.env.TRADING_PAIRS || 'BTC/EUR,BTC/USD,BTC/USDT')
  .split(',')
  .map(s => s.trim().toUpperCase());

setupLog4js(process.env.LOG_LEVEL || 'info');
const logger = getLogger('Producer');

/**
 * Initialize everything needed
 */
async function init(): Promise<[KrakenSocket]> {
  logger.info(`Initializing QueueManager...`);
  await QueueManager.init(RABBITMQ_URL);
  const sendToTradingQueue = (action: actions) => {
    const uintArr = encode(action.payload);
    QueueManager.sendToQueue('trading_queue', Buffer.from(uintArr.buffer, uintArr.byteOffset, uintArr.byteLength));
  };

  // Initialize sockets
  return [
    new KrakenSocket(sendToTradingQueue),
  ];
}

async function work([krak]: [KrakenSocket]) {
  if (DEFAULT_PAIRS.every(isCurrencyPair)) {
    krak.subscribeForTrade(DEFAULT_PAIRS);
    krak.subscribeToBook(DEFAULT_PAIRS, 1000);
  }
}

init()
  .then(work)
  .catch(err => logger.fatal(err));
