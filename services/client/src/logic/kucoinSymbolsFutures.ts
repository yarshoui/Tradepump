import { comparePrices, setKucoinSymbolsFuturesData } from './arbitrageStoreLogicForAllExchanges';

export type KucoinFuturesData = {
  symbol: string;
  bid1: string;
  ask1: string;
  category: string;
};

export type ProcessedSymbolKucoinFutures = {
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
    exchange: 'Kucoin';
    symbol: KucoinFuturesData['symbol'];
    askPrice:KucoinFuturesData['ask1'];
    bidPrice: KucoinFuturesData['bid1'];
    category: 'Futures';
    base: ProcessedSymbolKucoinFutures['base'];
    quote: ProcessedSymbolKucoinFutures['quote'];
};


export let kucoinFuturesPairsDataArr: any;
let pollingInterval: NodeJS.Timeout;

export const getKucoinFuturesPairsData = () => {
 
  async function loadJson(urlKucoinFuturesPairs: RequestInfo) {
    let responseKucoin = await fetch(urlKucoinFuturesPairs, {mode:'cors'});
    let binData = await responseKucoin.json();
    return binData;
  }

  function doRequest() {
    const urlKucoinFuturesPairs = `http://localhost:3006/kucoinapifutures`; 
    
    //const urlKucoinFuturesPairs = `https://api-futures.kucoin.com/api/v1/allTickers`;
    
    // console.log('~~~ request');
    loadJson(urlKucoinFuturesPairs).then((data) => {
      //console.log('~~~ result kucoin', { data });
      //debugger;
      //const category = data.result.category;
      //const list=data.result.list;
      const dataToProcess = data?.data ?? [];
      
      const filteredList: ProcessedMerxFuture[] = dataToProcess.map(( value:KucoinFuturesData ) => {
        return {
          exchange: 'Kucoin', 
          symbol: value.symbol,
          askPrice: value.ask1,
          bidPrice: value.bid1,
          category: 'Futures',
        };
      });
     
      kucoinFuturesPairsDataArr = dataToProcess;
      const processedSymbolsData: ProcessedSymbolKucoinFutures[] = processSymbols(filteredList);
      // console.log('~~~', { processedSymbolsData, data, dataToProcess, filteredList });
      setKucoinSymbolsFuturesData(processedSymbolsData);
      comparePrices();
      //console.log('@@@kucoinFuturesPairsData', kucoinFuturesPairsDataArr);

      function processSymbols(symbols: ProcessedMerxFuture[]): ProcessedSymbolKucoinFutures[] {
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
            .filter((item) => item !== null) as ProcessedSymbolKucoinFutures[]; // Remove null entries
      }
      // const processedSymbols = processSymbols(kucoinFuturesPairsDataArr);
      // console.log("Final data for Kucoin Futures:", processedSymbols);
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

export const subscribeToKucoinFuturesPairsList = () => {
  
  getKucoinFuturesPairsData();
  };


