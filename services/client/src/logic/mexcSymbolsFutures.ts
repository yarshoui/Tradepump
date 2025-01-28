import { comparePrices, setMexcSymbolsFuturesData } from './arbitrageStoreLogicForAllExchanges';

export type MexcFuturesData = {
  symbol: string;
  bid1: string;
  ask1: string;
  category: string;
};

export type ProcessedSymbolMexcFutures = {
  base: string;
  quote: string;
  bidPrice: string;
  askPrice: string;
  category: string;
  exchange: string;
  symbol: string;
  spread: string;
};

type ProcessedMerxFuture = {
    exchange: 'mexc';
    symbol: MexcFuturesData['symbol'];
    askPrice:MexcFuturesData['ask1'];
    bidPrice: MexcFuturesData['bid1'];
    category: 'futures';
    base: ProcessedSymbolMexcFutures['base'];
    quote: ProcessedSymbolMexcFutures['quote'];
};


export let mexcFuturesPairsDataArr: any;
let pollingInterval: NodeJS.Timeout;

export const getMexcFuturesPairsData = () => {
 
  async function loadJson(urlMexcFuturesPairs: RequestInfo) {
    let responseMexc = await fetch(urlMexcFuturesPairs, {mode:'cors'});
    let binData = await responseMexc.json();
    return binData;
  }

  function doRequest() {
    const urlMexcFuturesPairs = `http://localhost:3002/mexcapifutures`; //Should be limited by 10-20 requests per sec
    // console.log('~~~ request');
    loadJson(urlMexcFuturesPairs).then((data) => {
      console.log('~~~ result mexc', { data });
      //debugger;
      //const category = data.result.category;
      //const list=data.result.list;
      const dataToProcess = data?.data ?? [];
      
      const filteredList: ProcessedMerxFuture[] = dataToProcess.map(( value:MexcFuturesData ) => {
        return {
          exchange: 'mexc', 
          symbol: value.symbol,
          askPrice: value.ask1,
          bidPrice: value.bid1,
          category: 'futures',
        };
      });
     
      mexcFuturesPairsDataArr = dataToProcess;
      const processedSymbolsData: ProcessedSymbolMexcFutures[] = processSymbols(filteredList);
      // console.log('~~~', { processedSymbolsData, data, dataToProcess, filteredList });
      setMexcSymbolsFuturesData(processedSymbolsData);
      comparePrices();
      //console.log('@@@mexcFuturesPairsData', mexcFuturesPairsDataArr);

      function processSymbols(symbols: ProcessedMerxFuture[]): ProcessedSymbolMexcFutures[] {
        return symbols
            .filter(entry => entry.symbol.includes("USDT")) // Filter symbols containing "USDT"
            .map(dataEntry => {
                // Remove "_" from the symbol if present
                const sanitizedSymbol = dataEntry.symbol.replace(/_/g, "");
                const match = sanitizedSymbol.match(/^(.*?)(USDT.*)$/); // Extract parts before and after "USDT"
                // console.log('~~~ match', { match, sanitizedSymbol, dataEntry, })
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
            .filter((item) => item !== null) as ProcessedSymbolMexcFutures[]; // Remove null entries
      }
      // const processedSymbols = processSymbols(mexcFuturesPairsDataArr);
      // console.log("Final data for Mexc Futures:", processedSymbols);
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

export const subscribeToMexcFuturesPairsList = () => {
  
  getMexcFuturesPairsData();
  };


