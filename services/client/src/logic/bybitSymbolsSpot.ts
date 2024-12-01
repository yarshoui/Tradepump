import { CurrencyPair } from '@tradepump/types';
import { PAIRS } from 'src/logic/pairsConfig';

interface BybitPairsData {
  // asks: string | undefined;
  // bids: string | undefined;
   Response?: any | undefined;
  dataHandler?: (msg: any) => void;
}

const bybitPairsData: BybitPairsData = {
  // asks: undefined,
  // bids: undefined,
  Response: undefined,
  
};




export let bybitPairsDataArr: any;
let pollingInterval: NodeJS.Timeout;

export const getBybitPairsData = () => {
 

  async function loadJson(urlBybitPairs: RequestInfo) {
    let responseBybit = await fetch(urlBybitPairs);
    let binData = await responseBybit.json();
    return binData;
  }

  function doRequest() {
    const urlBybitPairs = `https://api.bybit.com/v5/market/tickers?category=spot`; //Should be limited by 10-20 requests per sec
    loadJson(urlBybitPairs).then((data) => {
      bybitPairsDataArr = data;

      if (bybitPairsData.dataHandler) {
        bybitPairsData.dataHandler(data);
      }
      console.debug('bybitPairsData', bybitPairsDataArr);
    });
  }
  function startPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    pollingInterval = setInterval(doRequest, 10000);
  }

  doRequest();
  startPolling();
};


export const setBybitPairsDataHandler = (dataHandler: (msg: any) => void) => {
  bybitPairsData.dataHandler = dataHandler;
};



export const subscribeToBybitPairsList = () => {
  
  getBybitPairsData();
  };


