import { EventEmitter } from 'events';
import { Logger } from 'log4js';
import WebSocket from 'ws';
import { jsonToBuffer, wait } from '../../utils/commonUtils';
import { actions } from './DataActions';

type ActionCallback = (action: actions) => void;
export abstract class BaseSocket extends EventEmitter {
  static sendTimeout: number = 500;

  _socket!: WebSocket;
  _sendMessageHandle?: NodeJS.Timeout;
  _sendStack: Buffer[];
  _nextMsgIdx: number;
  _messageCallback: ActionCallback;
  abstract logger: Logger;

  constructor(callback: ActionCallback) {
    super();
    this._sendStack = [];
    this._nextMsgIdx = 0;
    this._messageCallback = callback;
    // Make sure class handler got attached
    setTimeout(() => {
      this._reconnect();
    });
  }

  abstract onMessage: (data: WebSocket.Data) => PromiseLike<actions | undefined>;

  async _reconnect() {
    if (!this._socket || (this._socket.readyState !== WebSocket.CONNECTING && this._socket.readyState !== WebSocket.OPEN)) {
      // Resend subscriptions when reconnect
      this._nextMsgIdx = 0;
      this._socket = new WebSocket('wss://ws.kraken.com');
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

  _dispose() {
    this._socket.off('open', this._onSocketOpen)
    this._socket.off('close', this._onSocketClose)
    this._socket.off('message', this._onSocketMessage);
    this._socket.off('error', this._onSocketError);
  }

  _onSocketMessage = async (data: WebSocket.Data) => {
    if (typeof this.onMessage !== 'function') {
      return;
    }
    const action = await this.onMessage(data);

    if (!action) {
      return;
    }
    this._messageCallback(action);
  };

  _onSocketError = (err: Error) => {
    this.logger.error(err);
  };

  _onSocketOpen = async () => {
    this.logger.info('Connection established to Kraken WebSocket');
    this.emit('open', this._socket);
    this.sendData();
  };

  _onSocketClose = async (code: number, reason: string) => {
    this.logger.info(`Kraken socket was closed ${code}(${reason}), restoring...`);
    this._dispose();
    this._sendMessageHandle && clearTimeout(this._sendMessageHandle);
    this._sendMessageHandle = undefined;
    this.emit('close', code, reason);
    // Let it cool
    await wait(1000);
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
      if (!this.isSocketAvailable) {
        this.logger.debug('Connection not available to send. Retrying...');
        this._sendMessageHandle = setTimeout(() => this.sendData(), BaseSocket.sendTimeout);
        return;
      }
      for (; this._nextMsgIdx < this._sendStack.length && this._sendStack.length > 0;) {
        const payload = this._sendStack[this._nextMsgIdx];
        let err;
        try {
          err = await new Promise(resolve => this._socket.send(payload, resolve));
        } catch (error) {
          err = error;
        }

        if (err) {
          this.logger.debug(err);
        }
        this._nextMsgIdx ++;
      }
      delete this._sendMessageHandle;
    }, BaseSocket.sendTimeout);
  };

  get isSocketAvailable() {
    return !!this._socket && this._socket.readyState === WebSocket.OPEN;
  }
}
