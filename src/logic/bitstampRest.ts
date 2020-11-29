// import { json } from 'body-parser';
import { PAIRS, SelectorOptions } from 'src/logic/pairsConfig';

//import {Http, Response, URLSearchParams} from '@angular/http';

interface BitstampOrdersData {
  asks: string | undefined;
  bids: string | undefined;

  activePayload: string | undefined;
  Response?: any | undefined;
  dataHandler?: (msg: any) => void;
}

const bitstampOrdersData: BitstampOrdersData = {
  activePayload: undefined,
  asks: undefined,
  bids: undefined,
  Response: undefined,
};

// let intervalId: NodeJS.Timeout;

/*const sendData = () => {
  console.log('sendBitstampData');
  intervalId = setInterval(() => {
    console.log('sendBitstampData setInterval', bitstampData);
    if (!bitstampData.activePayload) {
      return;
    }

    const socketPromise = getBitstampSocket();
    socketPromise.then((socket) => {
      if (!bitstampData.activePayload) {
        return;
      }

      console.log('here', bitstampData);

      try {
        socket.send(bitstampData.activePayload);
      } catch (error) {
        console.error('Bitstamp socket error :' + error);
      }
    });
  }, 3000);

  if (!bitstampData.activePayload) {
    return;
  }

  bitstampData.socket?.send(bitstampData.activePayload);
}*/

/*export function restoreBitstampSocket() {
  return new Promise<WebSocket>((resolve) => {
    bitstampData.socket = new WebSocket('wss://dex.bitstamp.org/api/ws');

    bitstampData.socket.onclose = () => {
      restoreBitstampSocket();
      console.log('WebSocket is closed now.');
    }

    bitstampData.socket.onopen = () => {
      console.log('[open] Connection established to Bitstamp 1');
      intervalId && clearInterval(intervalId);
      sendData();
      resolve(bitstampData.socket);
    }

    bitstampData.socket.onerror = (error: any) => {
      console.log(`[error] ${error.message}`);
    }

    bitstampData.socket.onmessage = function (msg) {
      bitstampData.dataHandler && bitstampData.dataHandler(msg);
    }
  });
}*/

/*export const getBitstampSocket = (): Promise<WebSocket> => {
  if (!bitstampData.socket) {
    return restoreBitstampSocket();
  }

  return new Promise(resolve => {
    resolve(bitstampData.socket);
  });
}*/

/*const getSubscribeBitstampPayload = (inputPair: string) => {


  const payload = { method: "subscribe", topic: "allMiniTickers", symbols: [""] };//$all

  return JSON.stringify(payload);
};*/

let currencyPair = 'btcusd';
export let bitstampOrdersDataArr: any;
let pollingInterval: NodeJS.Timeout;

export const getBitstampOrdersData = () => {

  async function loadJson(urlBitstamp: RequestInfo) {
    let responseBitstamp = await fetch(urlBitstamp);
    let bitstampData = await responseBitstamp.json();
    return bitstampData;
  }

  function doRequest() {
    const urlBitstamp = `https://www.bitstamp.net/api/v2/order_book/${currencyPair}/`;
    loadJson(urlBitstamp).then((data) => {
      bitstampOrdersDataArr = data;

      if (bitstampOrdersData.dataHandler) {
        bitstampOrdersData.dataHandler(data);
      }
      console.log('bitstampOrdersData', bitstampOrdersDataArr);
    });
  }

  function startPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    pollingInterval = setInterval(doRequest, 3000);
  }

  doRequest();
  startPolling();
};

// const getSubscribePayload = (inputPair: string) => {
//   const payload = {
//     pair: [ PAIRS [ inputPair ].bitstamp, ],
//   };

//   return JSON.stringify(payload);
// };

// getBitstampOrdersData();
// console.log('Bitstamp onLoad works');

export const setBitstampDataHandler = (dataHandler: (msg: any) => void) => {
  bitstampOrdersData.dataHandler = dataHandler;
};

//  export const setPayloadForBitstampCurrencyPair = (inputPair: string) => {
//    const payload = getSubscribePayload(inputPair);
//    bitstampData.activePayload = payload;
//  };

export const subscribeToBitstampCurrencyPair = (inputPair: SelectorOptions) => {
  currencyPair = PAIRS[inputPair].bitstamp;
  getBitstampOrdersData();
  // const socketPromise = getBitstampSocket();
  // const payload = getSubscribePayload(inputPair);
  // bitstampOrdersData.activePayload = payload;
  /*  socketPromise.then((socket) => {
      socket.send(payload);
     });*/
};

// export {bitstampOrdersData};
