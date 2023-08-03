import { Metrics } from '@tradepump/monitoring';
import { getLogger } from 'log4js';
import WebSocket from 'ws';
import { isBookTrade } from '../../utils/guards';
import { DataEvent } from '../common/DataActions';
import { BaseSocket } from './base-socket';
import { isKrakenPayload, parseKrakenPayload } from './kraken-utils';

type KrakenStatus = 'online' | 'maintenance' | 'cancel_only' | 'limit_only' | 'post_only';

const KRAKEN_SUBSCRIPTION_TIMEOUT = 10000;

export class KrakenSocket extends BaseSocket {
  host = 'wss://ws.kraken.com';
  status: KrakenStatus = 'maintenance';
  serverVersion = "";
  lastHeartbeat = 0;
  logger = getLogger('KrakenSocket');

  override async processMessage(rawData: WebSocket.Data) {
    let payload: unknown;
    let stringData: string;

    this.logger.trace("Received kraken message", rawData);

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
    // filter out unknown data
    if (!isKrakenPayload(payload)) {
      Metrics.emit("KrakenUnknownPayload", 1, "Count");
      this.logger.error(`Received unknown kraken payload: '${stringData}'`);
      return;
    }
    //'{"channelID":352,"channelName":"book-1000","event":"subscriptionStatus","pair":"XBT/EUR","status":"subscribed","subscription":{"depth":1000,"name":"book"}}'
    if ("event" in payload) {
      if (payload.event === "subscriptionStatus" && payload.status === "subscribed") {
        this.emit("subscribed", payload);
        return;
      } else if (payload.event === "subscriptionStatus" && payload.status === "error") {
        this.emit("error", new Error(`Error during subscription: ${payload.errorMessage}`));
        return;
      } else if (payload.event === "subscriptionStatus") {
        this.emit("error", new Error(`Yet unsupported subscription status: '${payload.status}'. ${stringData}`));
        return;
      }
      if (payload.event === "heartbeat" || payload.event === "pong") {
        this.lastHeartbeat = Date.now();
        this.emit("heartbeat");
        return;
      }
      if (payload.event === "systemStatus") {
        this.status = payload.status as KrakenStatus;
        this.serverVersion = payload.version as string;
        this.emit("statusUpdate", payload.status);
        return;
      }
      if (payload.event === "error" || payload.status === "error") {
        this.emit("error", new Error(`Error occured: ${stringData}`));
        return;
      }
    }
    if ("event" in payload) {
      this.logger.warn(`Received unsupported event: '${payload.event}'. '${stringData}'`);
      return;
    }
    const krakenPayload = parseKrakenPayload(payload);

    if (krakenPayload === null) {
      this.logger.warn('Payload is incorrect');
      this.logger.debug(payload);
      return;
    }

    // We know that krakenPayload is not empty out of isKrakenPayload
    if (isBookTrade(krakenPayload)) {
      return {
        type: DataEvent.BOOK_UPDATE,
        payload: krakenPayload,
      };
    }

    return {
      type: DataEvent.TRADE_UPDATE,
      payload: krakenPayload,
    };
  };

  async _subscribe(name: "trade" | "book", depth?: number) {
    const pair = this.pairs;
    const payload = {
      event: 'subscribe',
      pair,
      subscription: {
        name,
        depth,
      },
    };
    const channel = `${name}${name === "book" ? `-${depth}` : ""}`;
    this.logger.info(`Subscribing to '${channel}' channel for '${pair}'...`);
    this.sendData(payload);
    await Promise.all(pair.map(pair =>
      new Promise<void>((resolve, reject) => {
        const handle = setTimeout(() => {
          reject(new Error(`Timeout waiting to subscribe for ${channel} ${pair}`));
          this.removeListener("subscribed", callback);
        }, KRAKEN_SUBSCRIPTION_TIMEOUT);
        const callback = (data: Record<string, unknown> | Error) => {
          if (data instanceof Error) {
            clearTimeout(handle);
            this.removeListener("subscribed", callback);
            this.removeListener("error", callback);
            reject(data);
            return;
          }
          data.pair = (data.pair as string).replace(/XBT/, "BTC");
          if ((data.subscription as { name?: string }).name === name && pair === data.pair && (data.subscription as { depth?: number }).depth === depth) {
            this.logger.info(`Subscribed for ${data.channelName}: ${data.pair}`);
            clearTimeout(handle);
            this.removeListener("subscribed", callback);
            this.removeListener("error", callback);
            resolve();
          }
        };
        this.addListener("subscribed", callback);
        this.addListener("error", callback);
      })
    ));
  }

  async subscribe(): Promise<void> {
    try {
      await Promise.all([
        this._subscribe("trade"),
        this._subscribe("book", 1000),
      ]);
    } catch (err) {
      this.logger.error(`Failed to subscribe:`, err);
    }
  }
}
