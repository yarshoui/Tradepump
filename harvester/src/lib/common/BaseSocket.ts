import { EventEmitter } from 'events';
import { Logger } from 'log4js';
import WebSocket from 'ws';
import { jsonToBuffer, wait } from '../../utils/commonUtils';

export abstract class BaseSocket extends EventEmitter {
  static sendTimeout: number = 500;

  _socket!: WebSocket;
  _sendMessageHandle?: NodeJS.Timeout;
  _sendStack: Buffer[];
  abstract logger: Logger;

  constructor() {
    super();
    this._sendStack = [];
    // Make sure class handler got attached
    setTimeout(() => {
      this._reconnect();
    });
  }

  abstract onMessage: (data: WebSocket.Data) => void;

  async _reconnect() {
    if (!this._socket || (this._socket.readyState !== WebSocket.CONNECTING && this._socket.readyState !== WebSocket.OPEN)) {
      this._socket = new WebSocket('wss://ws.kraken.com');
      this._socket.on('open', this._onSocketOpen)
      this._socket.on('close', this._onSocketClose)
      if (typeof this.onMessage === 'function') {
        this._socket.on('message', this.onMessage);
      }
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
    this._socket.off('message', this.onMessage);
    this._socket.off('error', this._onSocketError);
  }

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
      for (let i = 0; i < this._sendStack.length && this._sendStack.length > 0;) {
        const payload = this._sendStack[i];
        let err;
        try {
          err = await new Promise(resolve => this._socket.send(payload, resolve));
        } catch (error) {
          err = error;
        }

        if (err) {
          // Leave the message for next time on error
          i ++;
          this.logger.debug(err);
        } else {
          // Message sent in success - remove from stack
          this._sendStack.splice(i, 1);
        }
      }
      delete this._sendMessageHandle;
    }, BaseSocket.sendTimeout);
  };

  get isSocketAvailable() {
    return !!this._socket && this._socket.readyState === WebSocket.OPEN;
  }
}
