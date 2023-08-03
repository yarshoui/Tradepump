import { CurrencyPair } from '@tradepump/types';
import { PAIRS } from 'src/logic/pairsConfig';

//import {Http, Response, URLSearchParams} from '@angular/http';

interface BitstampOrdersData {
  asks: string | undefined;
  bids: string | undefined;

  activePayload: string | undefined;
  Response?: any | undefined;
  dataHandler?: (msg: any) => void;
}
// interface BitstampLastTradeData {
//   last: string | undefined;
  
//   activePayload: string | undefined;
//   Response?: any | undefined;
//   dataHandler?: (msg: any) => void;
// }

const bitstampOrdersData: BitstampOrdersData = {
  activePayload: undefined,
  asks: undefined,
  bids: undefined,
  Response: undefined,
};
// const bitstampLastTradeData: BitstampLastTradeData = {
//   activePayload: undefined,
//   last: undefined,
  
//   Response: undefined,
// };


let currencyPair = 'btcusd';
export let bitstampOrdersDataArr: any;
//export let bitstampLastTradeDataArr: any;
let pollingInterval: NodeJS.Timeout;

export const getBitstampOrdersData = () => {

  async function loadJson(urlBitstamp: RequestInfo) {
    // const proxy = 'https://infinite-tundra-40619.herokuapp.com/'; //my proxy
    let responseBitstamp = await fetch(urlBitstamp);
    let bitstampData = responseBitstamp.json();
    return bitstampData;
  }

  // async function loadJson(urlBitstampLastTradePrc: RequestInfo) {
  //   let responseBitstampPrc = await fetch(urlBitstampLastTradePrc);
  //   let bitstampPrcData = await responseBitstampPrc.json();
  //   return bitstampPrcData;
  //}



  function doRequest() {
    const urlBitstamp = `https://www.bitstamp.net/api/v2/order_book/${currencyPair}/`;
    //const urlBitstampLastTradePrc = `https://www.bitstamp.net/api/v2/ticker/${currencyPair}/`;
    loadJson(urlBitstamp).then((data) => {
      bitstampOrdersDataArr = data;

      if (bitstampOrdersData.dataHandler) {
        bitstampOrdersData.dataHandler(data);
      }
      //console.log('bitstampOrdersData', bitstampOrdersDataArr);
    });
    //Getting the last trade Price 
    // loadJson(urlBitstampLastTradePrc).then((data) => {
    //   bitstampLastTradeDataArr = data;

    //   if (bitstampLastTradeData.dataHandler) {
    //     bitstampLastTradeData.dataHandler(data);
    //   }
    //   console.log('bitstampLastTradeDataArr', bitstampLastTradeDataArr);
    // });
  }

  function startPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    pollingInterval = setInterval(doRequest, 2000);
  }

  doRequest();
  // startPolling();
};

export const setBitstampDataHandler = (dataHandler: (msg: any) => void) => {
  bitstampOrdersData.dataHandler = dataHandler;
};
// export const setBitstampLastTradePriceDataHandler = (dataHandler: (msg: any) => void) => {
//   bitstampLastTradeData.dataHandler = dataHandler;
// };

export const subscribeToBitstampCurrencyPair = (inputPair: CurrencyPair) => {
  currencyPair = PAIRS[inputPair].bitstamp;
  //bitstampOrdersDataArr=[];
  getBitstampOrdersData();
  };


