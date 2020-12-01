// import { json } from 'body-parser';
import { PAIRS, DEFAULT_PAIR, SelectorOptions } from 'src/logic/pairsConfig';

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

let currencyPair = PAIRS[DEFAULT_PAIR].bitfinex;
export let bitfinexOrdersDataArr: any;
let pollingIntervalBitfinex: NodeJS.Timeout;

export const getBitfinexOrdersData = () => {
  //console.log('###', currencyPair);

  async function loadJson(urlBitfinex: RequestInfo) {
    // const proxy = 'https://cors-anywhere.herokuapp.com/'; //need to avoid external proxy
    //console.log('###', currencyPair, urlBitfinex);
    let responseBitfinex = await fetch(urlBitfinex, {
      // mode: 'no-cors',
      // referrerPolicy: 'no-referrer',
      // credentials: 'omit',
    });
    let bitData = await responseBitfinex.json();
    //console.log('bitData', bitData);
    return bitData;
  }

  function doRequestBitfinex() {
    // IMPORTANT: use node server on prod
    // for local development we will use proxy,
    // check setupProxy.js for details
    // const urlBitfinex = `https://api.bitfinex.com/v1/book/${currencyPair}?limit_bids=2000&limit_asks=2000`; //Should be limit_bids=10k&limit_asks=10k, 'btcusd' should be taken from [PAIRS[inputPair].bitfinex]]
    const urlBitfinex = `/v1/book/${currencyPair}?limit_bids=2000&limit_asks=2000`; //Should be limit_bids=10k&limit_asks=10k, 'btcusd' should be taken from [PAIRS[inputPair].bitfinex]]
    loadJson(urlBitfinex).then((data) => {
      bitfinexOrdersDataArr = data;

      if (bitfinexOrdersData.dataHandler) {
        bitfinexOrdersData.dataHandler(data);
      }
      //console.log('bitfinexOrdersData', bitfinexOrdersDataArr);
    });
  }

  function startPollingBitfinex() {
    if (pollingIntervalBitfinex) {
      clearInterval(pollingIntervalBitfinex);
    }

    pollingIntervalBitfinex = setInterval(doRequestBitfinex, 20000);
  }

  doRequestBitfinex();
  startPollingBitfinex();
};

export const setBitfinexDataHandler = (dataHandler: (msg: any) => void) => {
  bitfinexOrdersData.dataHandler = dataHandler;
};

// export const setPayloadForKrakenCurrencyPair = (inputPair: string) => {
//   const payload = getSubscribePayload(inputPair);
//   krakenData.activePayload = payload;
// };
export const subscribeToBitfinexCurrencyPair = (inputPair: SelectorOptions) => {
  //console.log(inputPair);
  currencyPair = PAIRS[inputPair].bitfinex;
  getBitfinexOrdersData();
};

// export {bitfinexOrdersData};
