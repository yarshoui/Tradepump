import WebSocket from 'ws';
import { getLogger } from 'log4js';
import { BaseSocket } from '../common/BaseSocket';
import { CurrencyPair } from '@tradepump/types';
import { parseKrakenPayload } from './utils';
import { isBookTrade, isKrakenPayload } from '../../utils/guards';
import { DataEvent } from '../common/DataActions';

type KrakenStatus = 'online' | 'maintenance' | 'cancel_only' | 'limit_only' | 'post_only';

export class KrakenSocket extends BaseSocket {
  status: KrakenStatus = 'maintenance';
  logger = getLogger('KrakenSocket');

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
    if (!isKrakenPayload(payload)) {
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

  subscribeToBook(pair: CurrencyPair[], depth: number) {
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
