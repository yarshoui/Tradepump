import WebSocket from 'ws';
import { getLogger } from 'log4js';
import { CurrencyPair } from '../common/CurrencyPair';
import { KrakenOptions, KrakenStatus } from './types';
import { BaseSocket } from '../common/BaseSocket';

export class KrakenSocket extends BaseSocket {
  _options: KrakenOptions;
  status: KrakenStatus = 'maintenance';
  logger = getLogger('KrakenSocket');

  constructor(options?: Partial<KrakenOptions>) {
    super();
    this._options = Object.assign({
      sendTimeout: 4000,
    }, options);
  }

  onMessage = async (rawData: WebSocket.Data) => {
    let payload: Record<string, unknown>;
    let stringData: string;

    this.logger.debug(rawData);

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
    if (payload.status && payload.status !== this.status) {
      this.status = payload.status as KrakenStatus;
      this.emit('statusChange', this.status);

      return;
    }
    // filter out rest
    if (
      payload.channelID
      || payload.connectionID
      || !Array.isArray(payload)
    ) {
      return;
    }
    this.logger.debug('Got a message', payload);
    this._options.onMessage?.(Buffer.from(JSON.stringify(payload)));
  };

  subscribeForTrade(pair: CurrencyPair[]) {
    const payload = {
      event: 'subscribe',
      pair,
      subscription: {      
        name: 'trade',
      },
    };

    this.sendData(payload);
  }

  subscribeToBook(pair: CurrencyPair[], depth = 1000) {
    const payload = {
      event: 'subscribe',
      pair,
      subscription: {
        depth,
        name: 'book',
      },
    };

    this.sendData(payload);
  }
}
