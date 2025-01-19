import { comparePrices, setBybitSpotData } from './arbitrageStoreLogicForAllExchanges';


export type SecondResponseListEntrySpot = {
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
  category:'spot';

};
export type ProcessedSymbolBybitSpot = {
  base: string;
  quote: string;
  bidPrice: string;
  askPrice: string;
  exchange: string;
  category: string;
  symbol: string;
  spread: string;
  
};

export type SecondResponseSpot = {
  category: string;
  list: SecondResponseListEntrySpot[];
}

export let bybitPairsDataArr: any;
let pollingInterval: NodeJS.Timeout;
let processedSymbolsData: ProcessedSymbolBybitSpot[];

export const getBybitPairsData = () => {
 
  async function loadJson(urlBybitPairs: RequestInfo) {
    let responseBybit = await fetch(urlBybitPairs);
    let binData = await responseBybit.json();
    return binData;
  }

  function doRequest() {
    const urlBybitPairs = `https://api.bybit.com/v5/market/tickers?category=spot`; //Should be limited by 10-20 requests per sec
    loadJson(urlBybitPairs).then((data) => {
      const category = data.result.category;
      const list=data.result.list;
      const filteredList = list.map(( value:SecondResponseListEntrySpot ) => {
        return {
          exchange: 'bybit', 
          symbol: value.symbol,
          askPrice: value.ask1Price,
          bidPrice: value.bid1Price,
          category: 'spot',
        };
      });
      //debugger;

      bybitPairsDataArr = data;
      processedSymbolsData = processSymbols(filteredList);
      
      setBybitSpotData(processedSymbolsData);
      comparePrices();

      console.debug('bybitPairsData', bybitPairsDataArr);

      function processSymbols(symbols: ProcessedSymbolBybitSpot[]): ProcessedSymbolBybitSpot[] {
              return symbols
                  .filter(data => data.symbol.includes("USDT")) // Filter symbols containing "USDT"
                  .map(data => {
                      const match = data.symbol.match(/^(.*?)(USDT.*)$/); // Extract parts before and after "USDT"
                      if (match) {
                        let bidPrice = parseFloat(data.bidPrice);
                        let askPrice = parseFloat(data.askPrice);
                          return {
                              ...data,
                              base: match[1],
                              quote: match[2],
                              bidPrice: bidPrice.toString(),
                              askPrice: askPrice.toString(),    
                              exchange: 'bybit',
                              category: 'spot',
                              
                                                  
                          };
                      }
                      return null;
                  })
                  .filter(item => item !== null) as ProcessedSymbolBybitSpot[]; // Remove null entries
            }
            const processedSymbols = processSymbols(bybitPairsDataArr);
            console.log("Final data for Bybit Spot:", processedSymbols);      


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

// export const setBybitPairsDataHandler = (dataHandler: (msg: any) => void) => {
//   bybitPairsData.dataHandler = dataHandler;
// };

export const subscribeToBybitPairsList = () => {
  
  getBybitPairsData();
  };


