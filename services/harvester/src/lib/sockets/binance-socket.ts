import { Metrics } from '@tradepump/monitoring';
import { BookModel, BookSide, MarketType, OrderType, TradeModel, TradeSide } from '@tradepump/types';
import { randomUUID } from 'crypto';
import { getLogger } from 'log4js';
import WebSocket from 'ws';
import { parseJSONPayload } from '../../utils/commonUtils';
import { DataEvent } from '../common/DataActions';
import { BaseSocket } from './base-socket';
import { isBinancePair, isBinancePayload, isBinanceResponse, isBinanceStream, symbolToPair } from './binance-utils';

const BINANCE_SUBSCRIPTION_TIMEOUT = 10000;

export class BinanceSocket extends BaseSocket {
  host = "wss://stream.binance.com:443";
  logger = getLogger('BinanceSocket');
  // Binance does not tolerate buffers... for some reason...
  sendAsBuffer = false;
  status = 0;
  serverId = "";
  lastHeartbeat = 0;
  serverTime = 0;
  _id = 1;

  channelPairMap: Record<string | number, string> = {};

  // TODO: understand how ping works in Binance, never received 3minute ping that they frighten with
  pingPayload = () => {
    return Buffer.from(JSON.stringify({ id: randomUUID(), method: "ping" }));
  };
  override pingTimeout = -1;

  override async processMessage(rawData: WebSocket.Data) {
    this.logger.trace("Received binance message", rawData);
    const { records } = parseJSONPayload(rawData);

    for (const payload of records) {
      if (typeof payload === "string") {
        this.logger.error(`Failed to parse one of records from payload: '${payload}'`);
        continue;
      }

      if (!isBinancePayload(payload)) {
        Metrics.emit("BinanceUnknownPayload", 1, "Count");
        this.logger.error(`Got unknown Binance payload: '${JSON.stringify(payload)}'`);
        return;
      }

      if (isBinanceResponse(payload)) {
        if (!this.channelPairMap[payload.id]) {
          this.logger.error(`Got response with unknown id(${payload.id}): '${JSON.stringify(payload)}'`);
          return;
        }
        // TODO: https://binance-docs.github.io/apidocs/spot/en/#error-codes
        if (!isNaN(payload.status) && payload.status !== 200) {
          this.emit("error", new Error(`Received error ${payload.status}, ${payload.id} [${(payload.error as any).code}]: ${(payload.error as any).msg}`));
        } else if ("result" in payload && payload.result === null) {
          this.emit("subscribed", payload);
        } else if ("result" in payload) {
          this.emit("error", new Error(`Failed to subscribe for id#${payload.id}. Data: '${JSON.stringify(payload)}`));
        } else {
          // TODO: figure out what is unknown
          this.logger.warn(`Unknown response payload: '${JSON.stringify(payload)}'`);
        }
        return;
      }
      if (!isBinanceStream(payload)) {
        this.logger.warn(`Unknown payload: '${JSON.stringify(payload)}'`);
        return;
      }
      const data = payload.data;
      if (data.e === "trade") {
        const trade: TradeModel = {
          market: MarketType.binance,
          pair: symbolToPair(data.s),
          price: parseFloat(data.p),
          side: data.m ? TradeSide.buy : TradeSide.sell,
          type: data.M ? OrderType.market : OrderType.limit,
          time: data.T,
          volume: parseInt(data.q),
        };
        return {
          type: DataEvent.TRADE_UPDATE,
          payload: [trade],
        };
      }
      if (data.e === "depthUpdate") {
        const books: BookModel[] = [];
        const pair = symbolToPair(data.s);
        const time = data.E;

        for (const [price, amount] of data.b) {
          books.push({
            market: MarketType.binance,
            pair,
            price: parseFloat(price),
            side: BookSide.bid,
            time,
            volume: parseInt(amount),
          });
        }
        for (const [price, amount] of data.a) {
          books.push({
            market: MarketType.binance,
            pair,
            price: parseFloat(price),
            side: BookSide.ask,
            time,
            volume: parseInt(amount),
          });
        }
        return {
          type: DataEvent.BOOK_UPDATE,
          payload: books,
        };
      }
      this.logger.warn(`Unknown stream payload ${payload.data.e}: '${JSON.stringify(payload)}'`);
    }
  };

  async _subscribe(channel: "depth" | "trade") {
    const pairs = this.pairs;
    const waitPair: Promise<void>[] = [];
    const params: string[] = [];
    for (const pair of pairs) {
      if (!isBinancePair(pair)) {
        this.logger.warn(`Pair '${pair}' is not supported in Binance, skipping`);
        continue;
      }
      const symbol = pair.replace("/", "").toLowerCase();
      const method = `${symbol}@${channel}`;

      params.push(method);
      this.logger.info(`Subscribing to '${channel}' channel for '${pair}' (${symbol})...`);
    }
    const id = this.id;
    const payload = {
      id,
      method: "SUBSCRIBE",
      params,
    };

    this.channelPairMap[id] = "@SUBSCRIBE";
    this.logger.info(`Sending ${id}`);
    this.sendData(payload);
    waitPair.push(
      new Promise((resolve, reject) => {
        const handle = setTimeout(() => {
          reject(new Error(`Timeout waiting to subscribe for ${channel}`));
          this.removeListener("subscribed", callback);
        }, BINANCE_SUBSCRIPTION_TIMEOUT);
        const callback = (data: Record<string, unknown> | Error) => {
          if (data instanceof Error) {
            clearTimeout(handle);
            this.removeListener("subscribed", callback);
            this.removeListener("error", callback);
            reject(data);
            return;
          }
          if (data.id === id) {
            this.logger.info(`Subscribed for ${params} (${id})`);
            clearTimeout(handle);
            delete this.channelPairMap[id];
            this.removeListener("subscribed", callback);
            this.removeListener("error", callback);
            resolve();
          }
        };
        this.addListener("subscribed", callback);
        this.addListener("error", callback);
      }),
    );
    await Promise.all(waitPair);
  }

  async subscribe(): Promise<void> {
    // update the host url to connect as per binance docs:
    // https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams
    const streams: string[] = []
    for (const pair of this.pairs) {
      if (!isBinancePair(pair)) {
        this.logger.warn(`Pair '${pair}' is not supported in Binance, skipping`);
        continue;
      }
      const symbol = pair.replace("/", "").toLowerCase();
      streams.push(`${symbol}@trade`);
      streams.push(`${symbol}@depth`);
    }
    const host = new URL(this.host);

    host.searchParams.delete("streams");
    host.pathname = "/stream";
    host.searchParams.set("streams", streams.join("/"));
    this.host = decodeURIComponent(host.href);

    this.logger.info(`Updating URL to: ${this.host}`);
    try {
      await Promise.all([
        this._subscribe("trade"),
        this._subscribe("depth"),
      ]);
    } catch (err) {
      this.logger.error(`Failed to subscribe:`, err);
    }
  }

  get id() {
    const id = this._id++;
    return id;
  }
}
