import { getLogger } from 'log4js';
import { setupLog4js } from './src/config/logging';
import { BitfinexSocket, KrakenSocket, BinanceSocket } from "./src/lib/sockets";
import { Mutex } from './src/lib/common/mutex';

setupLog4js("DEBUG");

const logger = getLogger('Producer');
const defaultPairs = (process.env.TRADING_PAIRS ?? 'BTC/EUR,BTC/USD,BTC/USDT')
  .split(',')
  .map(s => s.trim().toUpperCase());

async function main() {
    // new BinanceSocket((ac) => {
    //     logger.info("Got action", ac.type, ac.payload.map(a => a.pair).join(","));
    // }, defaultPairs as any);
    new KrakenSocket((ac) => {
        // logger.info("Got action", ac.type, ac.payload.map(a => a.pair).join(","));
    }, defaultPairs as any);
}

async function mutextest() {
    const mutex = new Mutex();
    async function job(i: number) {
        logger.info(`Init job#${i}`);
        await mutex.lock();
        logger.info(`Starting job#${i}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        mutex.unlock();
        logger.info(`Finished job#${i}`);
    }

    await Promise.all(Array(3).fill(0).map((_, i) => job(i)));
}

// mutextest();
main();
