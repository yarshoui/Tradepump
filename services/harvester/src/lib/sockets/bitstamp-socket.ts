import { getLogger } from 'log4js';
import WebSocket from 'ws';
import { parseJSONPayload } from '../../utils/commonUtils';
import { BaseSocket } from './base-socket';
import { BookModel, BookSide, CurrencyPair, MarketType, OrderType, TradeModel, TradeSide } from '@tradepump/types';
import { BitstampPayload, bitstampTradepairMap, isBitstampBookPayload, isBitstampPair, isBitstampPayload, reverseBitstampPairMap } from './bitstamp-utils';
import { Metrics } from '@tradepump/monitoring/build';
import { DataEvent } from '../common/DataActions';

const BITSTAMP_SUBSCRIPTION_TIMEOUT = 60000;

export class BitstampSocket extends BaseSocket {
  override host = "wss://ws.bitstamp.net";
  override logger = getLogger('BitstampSocket');
  override pingTimeout = -1; // Disable heartbeat for now

  override async processMessage(rawData: WebSocket.Data) {
    this.logger.trace("Received bittrex message", rawData);
    const { records } = parseJSONPayload(rawData);

    for (const data of records) {
      if (typeof data === "string") {
        this.logger.warn(`Did not parse well: '${data}'`);
        continue;
      }
      if (!isBitstampPayload(data)) {
        this.logger.warn(`Not a bitstamp payload: '${JSON.stringify(data)}'`);
        continue;
      }
      if (data.event === "bts:subscription_succeeded") {
        this.emit("subscribed", data);
        continue;
      }
      if (isBitstampBookPayload(data)) {
        const bitstampPair = data.channel.split("_").pop();
        const timestamp = parseInt(data.data.microtimestamp.substring(0, 13), 10);

        if (!isBitstampPair(bitstampPair)) {
          this.logger.error(`Received non-bitstamp pair in subscription: '${bitstampPair}', '${data.channel}'. This is not supposed to happen.`);
          Metrics.emit("BitstampBadReversePair", 1, "Count");
          continue;
        }

        const pair: CurrencyPair = reverseBitstampPairMap[bitstampPair];
        const asks: BookModel[] = data.data.asks.map<BookModel>(([priceStr, amountStr]) => {
          const price = parseFloat(priceStr);
          const volume = parseFloat(amountStr);

          return {
            market: MarketType.bitstamp,
            pair,
            side: BookSide.ask,
            price,
            volume,
            time: timestamp,
          };
        });
        const bids: BookModel[] = data.data.asks.map<BookModel>(([priceStr, amountStr]) => {
          const price = parseFloat(priceStr);
          const volume = parseFloat(amountStr);

          return {
            market: MarketType.bitstamp,
            pair,
            side: BookSide.bid,
            price,
            volume,
            time: timestamp,
          };
        });

        return {
          type: DataEvent.BOOK_UPDATE,
          payload: [
            ...asks,
            ...bids,
          ],
        };
      }
      const bitstampPair = data.channel.split("_").pop();

      if (!isBitstampPair(bitstampPair)) {
        this.logger.error(`Received non-bitstamp pair in subscription: '${bitstampPair}', '${data.channel}'. This is not supposed to happen.`);
        Metrics.emit("BitstampBadReversePair", 1, "Count");
        continue;
      }
      const pair: CurrencyPair = reverseBitstampPairMap[bitstampPair];
      const timestamp = parseInt(data.data.microtimestamp.substring(0, 13), 10);
      const tradeModel: TradeModel = {
        pair,
        market: MarketType.bitstamp,
        price: data.data.price,
        side: data.data.type === 0 ? TradeSide.buy : TradeSide.sell,
        time: timestamp,
        type: OrderType.market,
        volume: data.data.amount,
      };

      return {
        type: DataEvent.TRADE_UPDATE,
        payload: [tradeModel],
      };
    }
  };

  private async _subscribe(chtype: "live_trades" | "order_book", currency: CurrencyPair) {
    const bitstampPair = bitstampTradepairMap[currency];

    if (!bitstampPair) {
      this.logger.warn(`Bitstamp does not support this trading pair: '${currency}'`);
      return;
    }

    const channel = `${chtype}_${bitstampPair}`;
    const payload = {
      event: "bts:subscribe",
      data: { channel },
    };

    this.sendData(payload);
    await new Promise<void>((resolve, reject) => {
      const handle = setTimeout(() => {
        reject(new Error(`Timeout waiting to subscribe for ${channel}`));
        this.removeListener("subscribed", callback);
      }, BITSTAMP_SUBSCRIPTION_TIMEOUT);
      const callback = (data: BitstampPayload | Error) => {
        if (data instanceof Error) {
          clearTimeout(handle);
          this.removeListener("subscribed", callback);
          this.removeListener("error", callback);
          reject(data);
          return;
        }
        if (data.event === "bts:subscription_succeeded" && data.channel === channel) {
          this.logger.info(`Subscribed for ${data.channel}`);
          clearTimeout(handle);
          this.removeListener("subscribed", callback);
          this.removeListener("error", callback);
          resolve();
        }
      };
      this.addListener("subscribed", callback);
      this.addListener("error", callback);
    });
  }

  override async subscribe(): Promise<void> {
    try {
      await Promise.all(
        this.pairs.flatMap(pair => [
          this._subscribe("live_trades", pair),
          this._subscribe("order_book", pair),
        ]),
      );
    } catch (err) {
      this.logger.error(`Failed to subscribe:`, err);
    }
  }
}
