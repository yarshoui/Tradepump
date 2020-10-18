import { PAIRS } from '../components/OrderMonitorMenu';

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
  console.log('sendBinanceData');
  intervalId = setInterval(() => {
    console.log('sendBinanceData setInterval', bitfinexData);
    if (!bitfinexData.activePayload) {
      return;
    }

    const socketPromise = getBitfinexSocket();
    socketPromise.then((socket) => {
      if (!bitfinexData.activePayload) {
        return;
      }

      console.log('here', bitfinexData);

      try {
        socket.send(bitfinexData.activePayload);
      } catch (error) {
        console.error('Bitfinex socket error :' + error);
      }
    });
  }, 3000);

  if (!bitfinexData.activePayload) {
    return;
  }

  bitfinexData.socket?.send(bitfinexData.activePayload);
}

export function restoreBitfinexSocket() {
  return new Promise<WebSocket>((resolve) => {
    bitfinexData.socket = new WebSocket('wss://dex.binance.org/api/ws');

    bitfinexData.socket.onclose = () => {
      restoreBitfinexSocket();
      console.log('WebSocket is closed now.');
    }

    bitfinexData.socket.onopen = () => {
      console.log('[open] Connection established to Binance');
      intervalId && clearInterval(intervalId);
      sendData();
      resolve(bitfinexData.socket);
    }

    bitfinexData.socket.onerror = (error: any) => {
      console.log(`[error] ${error.message}`);
    }

    bitfinexData.socket.onmessage = function (msg) {
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
  method: "subscribe",
  topic: "marketDepth1000",
  symbols: ["btcusdt"], //[PAIRS[inputPair].bitfinex], // [ inputPair ]
  };

  return JSON.stringify(payload);
};

// async function api(url: string): Promise<string> {
//   const response = await fetch(url, {
//     mode: 'no-cors',
// });
//   if (!response.ok) {
//     return 'Failed to fetch';
//   }
//   console.log('Bitfinex: '+ response.json());
//   return response.json();
// }

/*{
  event: 'subscribe',
  channel: 'book',
  symbol: 'tBTCUSD', //[PAIRS[inputPair].bitfinex], // [ inputPair ]
  len: '100'
};*/


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
