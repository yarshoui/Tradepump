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
      //console.log('bitstampOrdersData', bitstampOrdersDataArr);
    });
  }

  function startPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    pollingInterval = setInterval(doRequest, 2000);
  }

  doRequest();
  startPolling();
};

export const setBitstampDataHandler = (dataHandler: (msg: any) => void) => {
  bitstampOrdersData.dataHandler = dataHandler;
};

export const subscribeToBitstampCurrencyPair = (inputPair: SelectorOptions) => {
  currencyPair = PAIRS[inputPair].bitstamp;
  getBitstampOrdersData();
  };


