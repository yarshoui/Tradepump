import { comparePrices, setBitgetSymbolsFuturesData } from './arbitrageStoreLogicForAllExchanges';
export type BitgetFuturesData = {
  symbol: string;
  bidPr: string;
  askPr: string;
  category: string;
  
};

export type ProcessedSymbolBitgetFutures = {
  base: string;
  quote: string;
  bidPrice: string;
  askPrice: string;
  category: string;
  symbol: string;
  spread: string;
  exchange: string;
};

type ProcessedMerxFuture = {
    exchange: 'Bitget';
    symbol: BitgetFuturesData['symbol'];
    askPrice:BitgetFuturesData['bidPr'];
    bidPrice: BitgetFuturesData['askPr'];
    category: 'Futures';
    base: ProcessedSymbolBitgetFutures['base'];
    quote: ProcessedSymbolBitgetFutures['quote'];
};

export let bitgetFuturesPairsDataArr: any;
let pollingInterval: NodeJS.Timeout;

export const getBitgetFuturesPairsData = () => {
 
  async function loadJson(urlBitgetFuturesPairs: RequestInfo) {
    let responseBitget = await fetch(urlBitgetFuturesPairs, {mode:'cors'});
    let binData = await responseBitget.json();
    return binData;
  }

  function doRequest() {
    const urlBitgetFuturesPairs = `http://localhost:3004/bitgetapifutures`; //Should be limited by 10-20 requests per sec
    loadJson(urlBitgetFuturesPairs).then((data) => {
      // console.log('~~~ result', { data });
      // const category = data.result.category;
      // const list=data.result.list;
      const dataToProcess = data?.data ?? [];
      const filteredList = dataToProcess.map(( value:BitgetFuturesData ) => {
        return {
          exchange: 'Bitget', 
          symbol: value.symbol,
          askPrice: value.askPr,
          bidPrice: value.bidPr,
          category: 'Futures',
        };
      });
      // debugger;

      bitgetFuturesPairsDataArr = dataToProcess;

      const processedSymbolsData: ProcessedSymbolBitgetFutures[] = processSymbols(filteredList);
      // console.log('~~~', { processedSymbolsData, data, dataToProcess, filteredList });
      setBitgetSymbolsFuturesData(processedSymbolsData);
      comparePrices();
      
      
       function processSymbols(symbols: ProcessedMerxFuture[]): ProcessedSymbolBitgetFutures[] {
            return symbols
                .filter(entry => entry.symbol.includes("USDT")) // Filter symbols containing "USDT"
                .map(dataEntry => {
                    const match = dataEntry.symbol.match(/^(.*?)(USDT.*)$/); // Extract parts before and after "USDT"
                     console.log('~~~ match', { match, dataEntry, })
                    if (match) {
                        return {
                            base: match[1],
                            quote: match[2],
                            bidPrice: dataEntry.bidPrice,
                            askPrice: dataEntry.askPrice,  
                            category: dataEntry.category,
                            exchange: dataEntry.exchange,                      
                        };
                    }
                    return null;
                })
                .filter((item) => item !== null) as ProcessedSymbolBitgetFutures[]; // Remove null entries
          }
          //const processedSymbols = processSymbols(bitgetFuturesPairsDataArr);
          // console.log("Final data for Bitget Spot:", processedSymbols);
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

export const subscribeToBitgetFuturesPairsList = () => {
  
  getBitgetFuturesPairsData();
  };


