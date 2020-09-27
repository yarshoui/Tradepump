interface KrakenData {
  socket: WebSocket | undefined;
  activePeyload: string | undefined;
  dataHandler?: (msg: any) => void;
}

const krakenData: KrakenData = {
  socket: undefined,
  activePeyload: undefined,
};

let intervalId: NodeJS.Timeout;

const sendData = () => {
  console.log('sendData');
  intervalId = setInterval(() => {
    console.log('sendData setInterval', krakenData);
    if (!krakenData.activePeyload) {
      return;
    }

    const socketPromise = getKrakenSocket();
    socketPromise.then((socket) => {
      if (!krakenData.activePeyload) {
        return;
      }

      console.log('here', krakenData);
      socket.send(krakenData.activePeyload);
    });
  }, 3000);

  if (!krakenData.activePeyload) {
    return;
  }

  krakenData.socket?.send(krakenData.activePeyload);
}

export function restoreSocket() {
  return new Promise<WebSocket>((resolve) => {
    krakenData.socket = new WebSocket('wss://ws.kraken.com');

    krakenData.socket.onclose = ()=>{
      restoreSocket();
      console.log('WebSocket is closed now.');
    }

    krakenData.socket.onopen = () => {
      console.log('[open] Connection established 1');
      intervalId && clearInterval(intervalId);
      sendData();
      resolve(krakenData.socket);
    }

    krakenData.socket.onerror = (error: any) => {
      console.log(`[error] ${error.message}`);
    }

    krakenData.socket.onmessage = function(msg) {
      krakenData.dataHandler && krakenData.dataHandler(msg);
    }
  });
}

export const getKrakenSocket = (): Promise<WebSocket> => {
  if (!krakenData.socket) {
    return restoreSocket();
  }

  return new Promise(resolve => {
    resolve(krakenData.socket);
  });
}

const getSubscribePayload = (inputPair: string) => {
  const payload = {
    event: 'subscribe',
    pair: [ inputPair, ],
    subscription: {
      depth: 1000,
      name: 'book',
    }
  };

  return JSON.stringify(payload);
};

export const setKrakenDataHandler = (dataHandler: (msg: any) => void) => {
  krakenData.dataHandler = dataHandler;
};

// export const setPayloadForKrakenCurrencyPair = (inputPair: string) => {
//   const payload = getSubscribePayload(inputPair);
//   krakenData.activePeyload = payload;
// };

export const subscribeToKrakenCurrencyPair = (inputPair: string) => {
  const socketPromise = getKrakenSocket();
  const payload = getSubscribePayload(inputPair);
  krakenData.activePeyload = payload;
  socketPromise.then((socket) => {
    socket.send(payload);
  });
};
