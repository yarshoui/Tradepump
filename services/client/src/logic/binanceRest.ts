import { PAIRS, SelectorOptions } from 'src/logic/pairsConfig';

//import {Http, Response, URLSearchParams} from '@angular/http';

interface BinanceOrdersData {
  asks: string | undefined;
  bids: string | undefined;
  //lastUpdateId: number | undefined;
  // socket: WebSocket | undefined;
  // activePayload: string | undefined;
  Response?: any | undefined;
  dataHandler?: (msg: any) => void;
}

const binanceOrdersData: BinanceOrdersData = {
  // socket: undefined,
  // activePayload: undefined,
  asks: undefined,
  bids: undefined,
  Response: undefined,
  //lastUpdateId: undefined,
};

// let intervalId: NodeJS.Timeout;

/*const sendData = () => {
  console.log('sendBinanceData');
  intervalId = setInterval(() => {
    console.log('sendBinanceData setInterval', binanceData);
    if (!binanceData.activePayload) {
      return;
    }

    const socketPromise = getBinanceSocket();
    socketPromise.then((socket) => {
      if (!binanceData.activePayload) {
        return;
      }

      console.log('here', binanceData);

      try {
        socket.send(binanceData.activePayload);
      } catch (error) {
        console.error('Binance socket error :' + error);
      }
    });
  }, 3000);

  if (!binanceData.activePayload) {
    return;
  }

  binanceData.socket?.send(binanceData.activePayload);
}*/

/*export function restoreBinanceSocket() {
  return new Promise<WebSocket>((resolve) => {
    binanceData.socket = new WebSocket('wss://dex.binance.org/api/ws');

    binanceData.socket.onclose = () => {
      restoreBinanceSocket();
      console.log('WebSocket is closed now.');
    }

    binanceData.socket.onopen = () => {
      console.log('[open] Connection established to Binance 1');
      intervalId && clearInterval(intervalId);
      sendData();
      resolve(binanceData.socket);
    }

    binanceData.socket.onerror = (error: any) => {
      console.log(`[error] ${error.message}`);
    }

    binanceData.socket.onmessage = function (msg) {
      binanceData.dataHandler && binanceData.dataHandler(msg);
    }
  });
}*/

/*export const getBinanceSocket = (): Promise<WebSocket> => {
  if (!binanceData.socket) {
    return restoreBinanceSocket();
  }

  return new Promise(resolve => {
    resolve(binanceData.socket);
  });
}*/

/*const getSubscribeBinancePayload = (inputPair: string) => {


  const payload = { method: "subscribe", topic: "allMiniTickers", symbols: [""] };//$all

  return JSON.stringify(payload);
};*/
let currencyPair = 'BTCUSDT';

export let binanceOrdersDataArr: any;
let pollingInterval: NodeJS.Timeout;

export const getBinanceOrdersData = () => {
  //const proxy = 'https://cors-anywhere.herokuapp.com/'; //need to avoid external proxy

  async function loadJson(urlBinance: RequestInfo) {
    let responseBinance = await fetch(urlBinance);
    let binData = await responseBinance.json();
    return binData;
  }

  function doRequest() {
    const urlBinance = `https://www.binance.com/api/v3/depth?symbol=${currencyPair}&limit=1000`; //Should be limit_bids=1000&limit_asks=1000, 'btcusd' should be taken from [PAIRS[inputPair].binance]]
    loadJson(urlBinance).then((data) => {
      binanceOrdersDataArr = data;

      if (binanceOrdersData.dataHandler) {
        binanceOrdersData.dataHandler(data);
      }
      console.debug('binanceOrdersData', binanceOrdersDataArr);
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

// getBinanceOrdersData();
// console.log('Binance onLoad works');

export const setBinanceDataHandler = (dataHandler: (msg: any) => void) => {
  binanceOrdersData.dataHandler = dataHandler;
};

/*{
  event: 'subscribe',
  channel: 'book',
  symbol: 'tBTCUSD', //[PAIRS[inputPair].binance], // [ inputPair ]
  len: '100'
};*/

// export const setPayloadForKrakenCurrencyPair = (inputPair: string) => {
//   const payload = getSubscribePayload(inputPair);
//   krakenData.activePayload = payload;
// };

export const subscribeToBinanceCurrencyPair = (inputPair: SelectorOptions) => {
  currencyPair = PAIRS[inputPair].binance;
  getBinanceOrdersData();
  // const socketPromise = getBinanceSocket();
  // const payload = getSubscribeBinancePayload(inputPair);
  //  binanceOrdersData.activePayload = payload;
  /*  socketPromise.then((socket) => {
      socket.send(payload);
     });*/
};

// export {binanceOrdersData};
