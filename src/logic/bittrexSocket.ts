import { PAIRS } from '../components/OrderMonitorMenu';

interface BittrexData {
  socket: WebSocket | undefined;
  activePayload: string | undefined;
  dataHandler?: (msg: any) => void;
}

const bittrexData: BittrexData = {
  socket: undefined,
  activePayload: undefined,
};

let intervalId: NodeJS.Timeout;

const sendData = () => {
  console.log('sendBittrexData');
  intervalId = setInterval(() => {
    console.log('sendBittrexData setInterval', bittrexData);
    if (!bittrexData.activePayload) {
      return;
    }

    const socketPromise = getBittrexSocket();
    socketPromise.then((socket) => {
      if (!bittrexData.activePayload) {
        return;
      }

      console.log('here', bittrexData);

      try {
        socket.send(bittrexData.activePayload);
      } catch (error) {
        console.error('Bittrex socket error :' + error);
      }
    });
  }, 3000);

  if (!bittrexData.activePayload) {
    return;
  }

  bittrexData.socket?.send(bittrexData.activePayload);
}

export function restoreBittrexSocket() {
  return new Promise<WebSocket>((resolve) => {
    bittrexData.socket = new WebSocket('wss://socket-v3.bittrex.com/signalr');

    bittrexData.socket.onclose = () => {
      restoreBittrexSocket();
      console.log('WebSocket is closed now.');
    }

    bittrexData.socket.onopen = () => {
      console.log('[open] Connection established to Bittrex');
      intervalId && clearInterval(intervalId);
      sendData();
      resolve(bittrexData.socket);
    }

    bittrexData.socket.onerror = (error: any) => {
      console.log(`[error] ${error.message}`);
    }

    bittrexData.socket.onmessage = function (msg) {
      bittrexData.dataHandler && bittrexData.dataHandler(msg);
    }
  });
}

export const getBittrexSocket = (): Promise<WebSocket> => {
  if (!bittrexData.socket) {
    return restoreBittrexSocket();
  }

  return new Promise(resolve => {
    resolve(bittrexData.socket);
  });
}

const getSubscribeBittrexPayload = (inputPair: string) => {


  const payload = {
    "M":"Subscribe",
    "A":[["orderbook_BTC-USD_500"]] //[PAIRS[inputPair].bittrex], // [ inputPair ]
  };

  return JSON.stringify(payload);
};


export const setBittrexDataHandler = (dataHandler: (msg: any) => void) => {
  bittrexData.dataHandler = dataHandler;
};

// export const setPayloadForKrakenCurrencyPair = (inputPair: string) => {
//   const payload = getSubscribePayload(inputPair);
//   krakenData.activePayload = payload;
// };

export const subscribeToBittrexCurrencyPair = (inputPair: string) => {
  const socketPromise = getBittrexSocket();
  const payload = getSubscribeBittrexPayload(inputPair);
  bittrexData.activePayload = payload;
  socketPromise.then((socket) => {
    socket.send(payload);
   });
};
