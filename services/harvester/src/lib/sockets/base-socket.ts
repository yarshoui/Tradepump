import { EventEmitter } from 'events';
import { Logger } from 'log4js';
import WebSocket from 'ws';
import { Metrics } from '@tradepump/monitoring';
import { jsonToBuffer, wait } from '../../utils/commonUtils';
import { actions } from '../common/DataActions';
import { CurrencyPair } from '@tradepump/types';

const backoffConfig = {
  initialTimeout: 1000,
  timeout: 1000,
  maxTimeout: 60000,
  factor: 2,
};

type ActionCallback = (action: actions) => void;
export abstract class BaseSocket extends EventEmitter {
  static sendTimeout: number = 500;

  _socket!: WebSocket;
  _sendMessageHandle?: NodeJS.Timeout;
  _sendStack: Buffer[];
  _nextMsgIdx: number;
  _messageCallback: ActionCallback;
  _ping?: NodeJS.Timeout;
  protected pairs: CurrencyPair[];
  abstract logger: Logger;
  abstract host: string;
  sendAsBuffer = true;
  pingPayload: () => Buffer = () => Buffer.from(JSON.stringify({ event: "ping", reqid: Date.now() }));
  pingTimeout = 60000;

  constructor(callback: ActionCallback, currencyPairs: CurrencyPair[]) {
    super();
    this._sendStack = [];
    this._nextMsgIdx = 0;
    this._messageCallback = callback;
    this.pairs = currencyPairs;
    // Make sure class handler got attached
    setTimeout(() => {
      this.subscribe();
      this._reconnect();
    });
  }

  protected abstract processMessage(data: WebSocket.Data): Promise<actions | void>;
  protected abstract subscribe(): Promise<void>;

  private async _reconnect() {
    if (!this._socket || (this._socket.readyState !== WebSocket.CONNECTING && this._socket.readyState !== WebSocket.OPEN)) {
      // Resend subscriptions when reconnect
      this._nextMsgIdx = 0;
      this._socket = new WebSocket(this.host);
      this._socket.binaryType = "nodebuffer";
      this._socket.on('open', this._onSocketOpen)
      this._socket.on('close', this._onSocketClose)
      this._socket.on('message', this._onSocketMessage);
      this._socket.on('error', this._onSocketError);
    } else if (this._socket.readyState === WebSocket.OPEN) {
      return Promise.resolve(this._socket);
    }

    return new Promise((resolve, reject) => {
      this._socket.once('open', resolve);
      this._socket.once('error', reject);
    });
  }

  private _dispose() {
    this._ping && clearInterval(this._ping);
    delete this._ping;
    this._sendMessageHandle && clearTimeout(this._sendMessageHandle);
    delete this._sendMessageHandle;
    this._socket.off('open', this._onSocketOpen)
    this._socket.off('close', this._onSocketClose)
    this._socket.off('message', this._onSocketMessage);
    this._socket.off('error', this._onSocketError);
  }

  private _setupPing() {
    if (this.pingTimeout < 0) {
      this.logger.warn(`Ping is disabled for ${this.constructor.name}`);
      return;
    }
    this._ping = setInterval(() => {
      if (this.isOpen) {
        this._socket.send(this.pingPayload());
      }
    }, this.pingTimeout);
  }

  private _onSocketMessage = async (data: WebSocket.Data) => {
    Metrics.emit(`${this.constructor.name}IncomingMessage`, 1, "Count");
    Metrics.emit(`${this.constructor.name}MessageBytes`, (Array.isArray(data) ? Buffer.concat(data) : Buffer.from(data as any)).byteLength, "Bytes");
    if (typeof this.processMessage !== 'function') {
      this.logger.error(`No processMessage function provided, nothing to process`);
      return;
    }
    try {
      const action = await this.processMessage(data);
  
      if (!action) {
        return;
      }
      Metrics.emit(`${this.constructor.name}OutgoingMessage`, 1, "Count");
      this._messageCallback(action);
    } catch (err) {
      this.logger.error(`Failed to parse message: '${data.toString()}'`, err);
      Metrics.emit(`${this.constructor.name}MessageParseError`, 1, "Count");
    }
  };

  private _onSocketError = (err: Error) => {
    Metrics.emit(`${this.constructor.name}Error`, 1, "Count");
    this.logger.error("Error on websocket", err);
  };

  private _onSocketOpen = async () => {
    this.logger.info(`Connection established to ${this.constructor.name} WebSocket`);
    backoffConfig.timeout = backoffConfig.initialTimeout;
    this.emit('open', this._socket);
    this.sendData();
    this._setupPing();
  };

  private _onSocketClose = async (code: number, reason: string) => {
    const timeout = backoffConfig.timeout;
    this.logger.info(`WebSocket was closed ${code}(${reason}), restoring in ${timeout}ms...`);
    this._dispose();
    // Resubscribe. Put payload only once when closed after open
    if (timeout === backoffConfig.initialTimeout) {
      this.subscribe();
    }
    this.emit('close', code, reason);
    backoffConfig.timeout = Math.min(backoffConfig.maxTimeout, backoffConfig.timeout * backoffConfig.factor);
    await wait(timeout);
    this._reconnect();
  };


  sendData = async (data?: Buffer | Record<string, unknown>) => {
    if (data) {
      Buffer.isBuffer(data)
        ? this._sendStack.push(data)
        : this._sendStack.push(jsonToBuffer(data));
    }

    await this._reconnect();
    if (this._sendMessageHandle || !this._sendStack.length) {
      return;
    }

    this._sendMessageHandle = setTimeout(async () => {
      if (!this.isOpen) {
        this.logger.debug('Connection not available to send. Retrying...');
        this._sendMessageHandle = setTimeout(() => this.sendData(), BaseSocket.sendTimeout);
        return;
      }
      for (; this._nextMsgIdx < this._sendStack.length && this._sendStack.length > 0;) {
        const payload = this._sendStack[this._nextMsgIdx];
        let err;
        try {
          err = await new Promise(resolve => this._socket.send(
            this.sendAsBuffer ? payload : payload.toString("utf8"),
            resolve,
          ));
        } catch (error) {
          err = error;
        }

        if (err) {
          this.logger.error(err);
          this._nextMsgIdx++;
        } else {
          this._sendStack.splice(this._nextMsgIdx, 1);
        }
      }
      delete this._sendMessageHandle;
    }, BaseSocket.sendTimeout);
  };

  get isOpen() {
    return this._socket?.readyState === WebSocket.OPEN;
  }
}
