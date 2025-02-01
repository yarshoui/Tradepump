// interface BybitPairsData {
//   Response?: any | undefined;
//   dataHandler?: (msg: any) => void;
// }

import {
  bybitFuturesData,
  comparePrices,
  setBybitFuturesData,
  //UnifiedEntity,
} from './arbitrageStoreLogicForAllExchanges';

// const bybitPairsData: BybitPairsData = {
//   Response: undefined,

// };

export type FuturesSecondResponseListEntry = {
  ask1Price: string;
  ask1Size: string;
  bid1Price: string;
  bid1Size: string;
  highPrice24h: string;
  lastPrice: string;
  lowPrice24h: string;
  prevPrice24h: string;
  price24hPcnt: string;
  symbol: string;
  turnover24h: string;
  volume24h: string;
  category:'Futures';
};

export type FuturesSecondResponse = {
  category: string;
  list: FuturesSecondResponseListEntry[];
};

export type ProcessedSymbolBybitFutures = {
  base: string;
  quote: string;
  bidPrice: string;
  askPrice: string;  
  multiplier?: string;
  category?: string;
  symbol: string;
  spread: string;
};


export let bybitFuturesPairsDataArr: any;
let pollingInterval: NodeJS.Timeout;
let processedSymbolsData: ProcessedSymbolBybitFutures[];

export const getBybitFuturesPairsData = () => {
  async function loadJson(urlBybitPairs: RequestInfo) {
    let responseBybit = await fetch(urlBybitPairs);
    let binData = await responseBybit.json();
    return binData;
  }

  function doRequest() {
    const urlBybitFuturesPairs = `https://api.bybit.com/v5/market/tickers?category=linear`; //Should be limited by 10-20 requests per sec
    loadJson(urlBybitFuturesPairs).then((data) => {
      const list = data.result.list;
      const filteredList = list.map((value: FuturesSecondResponseListEntry) => {
        return {
          exchange: 'Bybit',
          symbol: value.symbol,
          askPrice: value.ask1Price,
          bidPrice: value.bid1Price,
          category: 'Futures',
        };
      });
      // debugger;

      bybitFuturesPairsDataArr = data;
      processedSymbolsData = processSymbols(filteredList);

      setBybitFuturesData(processedSymbolsData);
      comparePrices();
    });

    function processSymbols(
      symbols: ProcessedSymbolBybitFutures[],
    ): ProcessedSymbolBybitFutures[] {
      return symbols
        .filter((data) => data.symbol.includes('USD')) // Filter symbols containing "USD"
        .map((data) => {
          const match = data.symbol.match(/^(\d+)?(.*?)(USD.*)$/);
          // const match = data.symbol.match(/^(?\d+)?(.*?)(USD.*)$/); // Extract optional digits, parts before and after "USD"
          if (match) {
            const [, multiplier, base, quote] = match;
            let bidPrice = parseFloat(data.bidPrice);
            let askPrice = parseFloat(data.askPrice);

            // If multiplier exists, multiply prices by it
            if (multiplier) {
             
              const multiplierValue = parseFloat(multiplier);
              //console.log ('§§',{match, data, bidPrice, askPrice, multiplierValue});
              bidPrice /= multiplierValue;
              askPrice /= multiplierValue;

              return {
                ...data,
                base,
                quote,
                bidPrice: bidPrice.toString(),
                askPrice: askPrice.toString(),                
                multiplier,
                
              };
            } else {
              return {
                ...data,
                base,
                quote,
                bidPrice: bidPrice.toString(),
                askPrice: askPrice.toString(),
                
                //bidQty: data.bidQty
              };
            }
          }
          return null;
        })
        .filter((item) => item !== null) as ProcessedSymbolBybitFutures[]; // Remove null entries
    }
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

// export const setBybitPairsDataHandler = (dataHandler: (msg: any) => void) => {
//   bybitPairsData.dataHandler = dataHandler;
// };

export const subscribeToBybitFuturesPairsList = () => {
  getBybitFuturesPairsData();
};
