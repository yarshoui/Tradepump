import { json } from 'body-parser';
import { PAIRS } from '../components/OrderMonitorMenu';

//import {Http, Response, URLSearchParams} from '@angular/http';

interface BitfinexOrdersData {
  asks: string | undefined;
  bids: string | undefined;
  // socket: WebSocket | undefined;
  // activePayload: string | undefined;
  Response?: any | undefined;
  dataHandler?: (msg: any) => void;
}

const bitfinexOrdersData: BitfinexOrdersData = {
  // socket: undefined,
  // activePayload: undefined,
  asks: undefined,
  bids: undefined,
  Response: undefined,
};

let intervalId: NodeJS.Timeout;

/*const sendData = () => {
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
}*/

/*export function restoreBitfinexSocket() {
  return new Promise<WebSocket>((resolve) => {
    bitfinexData.socket = new WebSocket('wss://dex.binance.org/api/ws');

    bitfinexData.socket.onclose = () => {
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

    bitfinexData.socket.onmessage = function (msg) {
      bitfinexData.dataHandler && bitfinexData.dataHandler(msg);
    }
  });
}*/

/*export const getBitfinexSocket = (): Promise<WebSocket> => {
  if (!bitfinexData.socket) {
    return restoreBitfinexSocket();
  }

  return new Promise(resolve => {
    resolve(bitfinexData.socket);
  });
}*/


/*const getSubscribeBitfinexPayload = (inputPair: string) => {


  const payload = { method: "subscribe", topic: "allMiniTickers", symbols: [""] };//$all

  return JSON.stringify(payload);
};*/


export let bitfinexOrdersDataArr:any;

export const getBitfinexOrdersData = ()=>{

  const urlBitfinex = 'https://api.bitfinex.com/v1/book/btcusd?limit_bids=2000&limit_asks=2000';//Should be limit_bids=10k&limit_asks=10k, 'btcusd' should be taken from [PAIRS[inputPair].bitfinex]]
  const proxy = 'https://cors-anywhere.herokuapp.com/'; //need to avoid external proxy

  let pollingIntervalBitfinex;

  async function loadJson(urlBitfinex:RequestInfo) { 
    let responseBitfinex = await fetch(proxy + urlBitfinex); 
    let bitData = await responseBitfinex.json();
    console.log('bitData', bitData);
    return bitData;
  }

  function doRequestBitfinex() {
    loadJson(urlBitfinex).then(data => {
      bitfinexOrdersDataArr = data;
      
      if(bitfinexOrdersData.dataHandler)
      {
        bitfinexOrdersData.dataHandler(data);
      }
      console.log('bitfinexOrdersData', bitfinexOrdersDataArr); 
    });  
  }
  function startPollingBitfinex() {
    pollingIntervalBitfinex = setInterval(doRequestBitfinex, 60000);    
  }
  startPollingBitfinex(); 
}


  getBitfinexOrdersData();
  console.log('Binfinex onLoad works');


export const setBitfinexDataHandler = (dataHandler: (msg: any) => void) => {
  bitfinexOrdersData.dataHandler = dataHandler;
};


/*{
  event: 'subscribe',
  channel: 'book',
  symbol: 'tBTCUSD', //[PAIRS[inputPair].bitfinex], // [ inputPair ]
  len: '100'
};*/




// export const setPayloadForKrakenCurrencyPair = (inputPair: string) => {
//   const payload = getSubscribePayload(inputPair);
//   krakenData.activePayload = payload;
// };

export const subscribeToBitfinexCurrencyPair = (inputPair: string) => {
 // const socketPromise = getBitfinexSocket();
 // const payload = getSubscribeBitfinexPayload(inputPair);
//  bitfinexOrdersData.activePayload = payload;
/*  socketPromise.then((socket) => {
    socket.send(payload);
   });*/
};

// export {bitfinexOrdersData};