import { Metrics } from '@tradepump/monitoring';
import { BookModel, BookSide, MarketType, OrderType, TradeModel, TradeSide } from '@tradepump/types';
import { getLogger } from 'log4js';
import WebSocket from 'ws';
import { DataEvent } from '../common/DataActions';
import { BaseSocket } from './base-socket';
import { bitfinexTraidingPairMap, isBitfinexPayload, isBitfinexSnapshot } from './bitfinex-utils';

const BITFINEX_SUBSCRIPTION_TIMEOUT = 10000;

export class BitfinexSocket extends BaseSocket {
  host = "wss://api-pub.bitfinex.com/ws/2";
  logger = getLogger('BitfinexSocket');
  status = 0;
  serverId = "";
  lastHeartbeat = 0;
  serverTime = 0;

  // Bitfinex does not return pair info on which you subscribe, instead it returns channel id
  channelPairMap: Record<number, string> = {};

  override async processMessage(rawData: WebSocket.Data) {
    let payload: unknown;
    let stringData: string;

    this.logger.trace("Received bitfinex message", rawData);

    if (Array.isArray(rawData)) {
      stringData = Buffer.concat(rawData).toString();
    } else if (Buffer.isBuffer(rawData)) {
      stringData = rawData.toString();
    } else if (rawData instanceof ArrayBuffer) {
      stringData = Buffer.from(rawData).toString();
    } else {
      stringData = rawData;
    }

    try {
      payload = JSON.parse(stringData);
    } catch (err) {
      this.logger.error(err);
      return;
    }

    // filter out rest
    if (!isBitfinexPayload(payload)) {
      Metrics.emit("BitfinexUnknownPayload", 1, "Count");
      this.logger.error(`Got non Bitfinex payload: '${stringData}'`);
      return;
    }

    if ("event" in payload) {
      if (payload.event === "pong") {
        this.lastHeartbeat = Date.now();
        this.serverTime = payload.ts as number;
        return;
      }

      if (payload.event === "info") {
        this.serverId = payload.serverId as string;
        this.status = (payload?.platform as { status?: number })?.status ?? 0;
        return;
      }

      if (payload.event === "subscribed") {
        this.emit("subscribed", payload);
        return;
      }

      if (payload.event === "error") {
        this.emit("error", new Error(`Error on subscribe: ${payload.msg}. ${stringData}`));
        return;
      }
    }
    // Ignore rest events
    if ("event" in payload) {
      this.logger.warn(`Received unsupported event: '${payload.event}' (${stringData})`);
      return;
    }
    const channelId = payload[0];

    if (payload[1] === "hb") {
      this.emit("heartbeat", channelId);
      return;
    }

    const pair = this.channelPairMap[channelId];

    if (!pair) {
      Metrics.emit("BitfinexNoPair", 1, "Count");
      this.logger.error(`Pair with no channel detected '${pair}': ${stringData}`);
      // Silence future occurences until fixed
      this.channelPairMap[channelId] = "-";
      return;
    }
    // Skip silenced pair/channelId
    if (pair === "-") {
      return;
    }
    if (isBitfinexSnapshot(payload)) {
      // TODO: Decide what to do with trade/book snapshots on subscribe
      // Skip snapshots for now
      return;
    }
    const update = payload[1];

    // Trade update
    if (typeof update === "string") {
      try {
        const [_id, time, amount, price] = payload[2];
        const tradeModel: TradeModel = {
          market: MarketType.bitfinex,
          pair,
          price,
          // TODO: if amount == 0?
          side: amount >= 0 ? TradeSide.buy : TradeSide.sell,
          // TODO: Figure out what te/tu means? Assuming te === TradeExecute - market?
          // This does not matter for now, going as assumed
          type: update === "te" ? OrderType.market : OrderType.limit,
          time,
          volume: Math.abs(amount),
        };
        return {
          type: DataEvent.TRADE_UPDATE,
          payload: [tradeModel],
        };
      } catch (err) {
        console.log("");
        console.log(payload);
        console.log("");
        console.log(stringData);
        console.log("");
        throw err;
      }
    }
    const [price, count, amount] = update;
    const bookModel: BookModel = {
      market: MarketType.bitfinex,
      pair,
      price,
      volume: Math.abs(count * amount),
      time: Date.now(),
      side: amount >= 0 ? BookSide.bid : BookSide.ask,
    };

    return {
      type: DataEvent.BOOK_UPDATE,
      payload: [bookModel],
    };
  };

  async _subscribe(channel: "trades" | "book") {
    const waitPair: Promise<void>[] = [];
    for (const pair of this.pairs) {
      const bfpair = bitfinexTraidingPairMap[pair];
      if (!bfpair) {
        this.logger.warn(`No trading pair match in Bitfinex for ${pair}`);
        continue;
      }
      const symbol = `t${bfpair}`;
      const payload = {
        event: 'subscribe',
        symbol,
        channel,
      };

      this.logger.info(`Subscribing to '${channel}' channel for '${pair}' (${symbol})...`);
      this.sendData(payload);
      waitPair.push(
        new Promise((resolve, reject) => {
          const handle = setTimeout(() => {
            reject(new Error(`Timeout waiting to subscribe for ${channel} ${pair}`));
            this.removeListener("subscribed", callback);
          }, BITFINEX_SUBSCRIPTION_TIMEOUT);
          const callback = (data: Record<string, unknown> | Error) => {
            if (data instanceof Error) {
              clearTimeout(handle);
              this.removeListener("subscribed", callback);
              this.removeListener("error", callback);
              reject(data);
              return;
            }
            if (data.symbol === symbol && data.channel === channel) {
              this.logger.info(`Subscribed for ${data.channel}: ${data.pair} (${data.symbol})`);
              clearTimeout(handle);
              this.channelPairMap[data.chanId as number] = pair;
              this.removeListener("subscribed", callback);
              this.removeListener("error", callback);
              resolve();
            }
          };
          this.addListener("subscribed", callback);
          this.addListener("error", callback);
        }),
      );
    }
    await Promise.all(waitPair);
  }

  async subscribe(): Promise<void> {
    try {
      await Promise.all([
        this._subscribe("trades"),
        this._subscribe("book"),
      ]);
    } catch (err) {
      this.logger.error(`Failed to subscribe:`, err);
    }
  }
}
