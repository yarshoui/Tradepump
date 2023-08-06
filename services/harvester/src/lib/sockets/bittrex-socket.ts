import { getLogger } from 'log4js';
import WebSocket from 'ws';
import { parseJSONPayload } from '../../utils/commonUtils';
import { BaseSocket } from './base-socket';

export class BittrexSocket extends BaseSocket {
  override host = "wss://socket-v3.bittrex.com/signalr";
  override logger = getLogger('BittrexSocket');
  override pingTimeout = -1; // Disable heartbeat for now

  override async processMessage(rawData: WebSocket.Data) {
    this.logger.trace("Received bittrex message", rawData);
    const { records } = parseJSONPayload(rawData);

    this.logger.info(records);
  };

  override async subscribe(): Promise<void> {
    throw new Error("Not implemented yet");
  }
}
