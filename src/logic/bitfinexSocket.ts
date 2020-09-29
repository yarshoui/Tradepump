import { PAIRS } from './../components/OrderMonitorMenu';

interface BitfinexData {
  socket: WebSocket | undefined;
  activePayload: string | undefined;
  dataHandler?: (msg: any) => void;
}

const bitfinexData: BitfinexData = {
  socket: undefined,
  activePayload: undefined,
};

let intervalId: NodeJS.Timeout;

const sendData = () => {
  console.log('sendBitfinexData');
  intervalId = setInterval(() => {
    console.log('sendBitfinexData setInterval', bitfinexData);
    if (!bitfinexData.activePayload) {
      return;
    }

    const socketPromise = getBitfinexSocket();
    socketPromise.then((socket) => {
      if (!bitfinexData.activePayload) {
        return;
      }

      console.log('here', bitfinexData);
      socket.send(bitfinexData.activePayload);
    });
  }, 3000);

  if (!bitfinexData.activePayload) {
    return;
  }

  bitfinexData.socket?.send(bitfinexData.activePayload);
}

export function restoreBitfinexSocket() {
  return new Promise<WebSocket>((resolve) => {
    bitfinexData.socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

    bitfinexData.socket.onclose = ()=>{
      restoreBitfinexSocket();
      console.log('WebSocket is closed now.');
    }

    bitfinexData.socket.onopen = () => {
      console.log('[open] Connection established to Bitfinex 1');
      intervalId && clearInterval(intervalId);
      sendData();
      resolve(bitfinexData.socket);
    }

    bitfinexData.socket.onerror = (error: any) => {
      console.log(`[error] ${error.message}`);
    }

    bitfinexData.socket.onmessage = function(msg) {
      bitfinexData.dataHandler && bitfinexData.dataHandler(msg);
    }
  });
}

export const getBitfinexSocket = (): Promise<WebSocket> => {
  if (!bitfinexData.socket) {
    return restoreBitfinexSocket();
  }

  return new Promise(resolve => {
    resolve(bitfinexData.socket);
  });
}

const getSubscribeBitfinexPayload = (inputPair: string) => {
  const payload = {
    event: 'subscribe',
    symbol: [ PAIRS [ inputPair ].bitfinex ], // [ inputPair ]
    channel: 'book',
    precision: 'P4',
  };

  return JSON.stringify(payload);
};

export const setBitfinexDataHandler = (dataHandler: (msg: any) => void) => {
  bitfinexData.dataHandler = dataHandler;
};

// export const setPayloadForKrakenCurrencyPair = (inputPair: string) => {
//   const payload = getSubscribePayload(inputPair);
//   krakenData.activePayload = payload;
// };

export const subscribeToBitfinexCurrencyPair = (inputPair: string) => {
  const socketPromise = getBitfinexSocket();
  const payload = getSubscribeBitfinexPayload(inputPair);
  bitfinexData.activePayload = payload;
  socketPromise.then((socket) => {
    socket.send(payload);
  });
};
