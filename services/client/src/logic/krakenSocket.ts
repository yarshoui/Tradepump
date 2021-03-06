import { CurrencyPair } from '@tradepump/types';
import { PAIRS } from 'src/logic/pairsConfig';

interface KrakenData {
  socket: WebSocket | undefined;
  activePayload: string [] | undefined;
  dataHandler?: (msg: any) => void;
}

const krakenData: KrakenData = {
  socket: undefined,
  activePayload: undefined,
};

let intervalId: NodeJS.Timeout;

const sendData = () => {
  console.debug('sendData');
  intervalId = setInterval(() => {
    console.debug('Kraken sendData setInterval', krakenData);
    if (!krakenData.activePayload) {
      return;
    }

    const socketPromise = getKrakenSocket();
    socketPromise.then((socket) => {
      if (!krakenData.activePayload) {
        return;
      }

      console.debug('here', krakenData);
      try {
        // socket.send(krakenData.activePayload);
        
          krakenData.activePayload && krakenData.activePayload.forEach((payload) => {
            socket?.send(payload);
            console.log('payload'+payload);
          });
        
      } catch (error) {
        console.error('Kraken socket error :' + error);
      }
    });
  }, 4000);

  if (!krakenData.activePayload) {
    return;
  }

  // krakenData.socket?.send(krakenData.activePayload);
  krakenData.activePayload && krakenData.activePayload.forEach((payload) => {
    krakenData.socket?.send(payload);
  });
};

export function restoreSocket() {
  return new Promise<WebSocket>((resolve) => {
    krakenData.socket = new WebSocket('wss://ws.kraken.com');

    krakenData.socket.onclose = () => {
      restoreSocket();
      console.debug('[close] Kraken WebSocket is closed now.');
    };

    krakenData.socket.onopen = () => {
      console.debug('[open] Connection established to Kraken WebSocket');
      intervalId && clearInterval(intervalId);
      sendData();
      resolve(krakenData.socket as WebSocket);
      // resolve(krakenData.socket);
    };

    krakenData.socket.onerror = (error: any) => {
      console.debug(`[error] ${error.message}`);
    };

    krakenData.socket.onmessage = function (msg) {
      krakenData.dataHandler && krakenData.dataHandler(msg);
    };
  });
}

export const getKrakenSocket = (): Promise<WebSocket> => {
  if (!krakenData.socket) {
    return restoreSocket();
  }

  return new Promise((resolve) => {
    // resolve(krakenData.socket);
    resolve(krakenData.socket as WebSocket);
  });
};
//payload for "name": "book"
const getSubscribePayload = (inputPair: CurrencyPair) => {
  const payload = {
    event: 'subscribe',
    pair: [PAIRS[inputPair].kraken],
    subscription: {
      depth: 1000,
      name: 'book',
    },
  };

  return JSON.stringify(payload);
};
//end

//payload for "name": "trade"
const getSubscribePayloadTrade = (inputPair: CurrencyPair) => {
  const payloadTrade = {
    event: 'subscribe',
    pair: [PAIRS[inputPair].kraken],
    subscription: {      
      name: 'trade',
    },
  };

  return JSON.stringify(payloadTrade);
};
//end

export const setKrakenDataHandler = (dataHandler: (msg: any) => void) => {
  krakenData.dataHandler = dataHandler;
};



export const subscribeToKrakenCurrencyPair = (inputPair: CurrencyPair) => {
  const socketPromise = getKrakenSocket();
  // const payload = getSubscribePayload(inputPair);
  const payload1 = getSubscribePayload(inputPair);
  const payload2 = getSubscribePayloadTrade(inputPair);

  krakenData.activePayload = [ payload1, payload2 ];
  

  socketPromise.then((socket) => {
    // socket.send(payload);
    return krakenData.activePayload 
    && krakenData.activePayload
    ?.
    forEach((payload) => {
      socket.send(payload);
    });
  });
};
