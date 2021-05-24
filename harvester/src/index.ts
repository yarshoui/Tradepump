import { getLogger } from 'log4js';
import { setupLog4js } from './config/logging';
import { QueueManager } from './lib/QueueManager';
import { KrakenSocket } from './lib/KrakenSocket';
import { isTradingPair } from './utils/guards';

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
  const sendToTradingQueue = (buffer: Buffer) => QueueManager.sendToQueue('trading_queue', buffer);

  // Initialize sockets
  return [
    new KrakenSocket({onMessage: sendToTradingQueue}),
  ];
}

async function work([krak]: [KrakenSocket]) {
  if (DEFAULT_PAIRS.every(isTradingPair)) {
    krak.subscribeForTrade(DEFAULT_PAIRS);
    krak.subscribeToBook(DEFAULT_PAIRS);
  }
}

init()
  .then(work)
  .catch(err => logger.fatal(err));
