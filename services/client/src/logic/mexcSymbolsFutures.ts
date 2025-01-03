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
    loadJson(urlMexcFuturesPairs).then((data) => {
      const category = data.result.category;
      const list=data.result.list;
      const filteredList = list.map(( value:MexcFuturesData ) => {
        return {
          exchange: 'mexc', 
          symbol: value.symbol,
          askPrice: value.ask1,
          bidPrice: value.bid1,
          category: 'futures',
        };
      });
      debugger;

      mexcFuturesPairsDataArr = data;
      console.debug('mexcFuturesPairsData', mexcFuturesPairsDataArr);


      function processSymbols(symbols: MexcFuturesData[]): ProcessedSymbolMexcFutures[] {
        return symbols
            .filter(data => data.symbol.includes("USDT")) // Filter symbols containing "USDT"
            .map(data => {
                // Remove "_" from the symbol if present
                const sanitizedSymbol = data.symbol.replace(/_/g, "");
                const match = sanitizedSymbol.match(/^(.*?)(USDT.*)$/); // Extract parts before and after "USDT"
                if (match) {
                    return {
                        base: match[1],
                        quote: match[2],
                        bidPrice: data.bid1,
                        askPrice: data.ask1,
                        
                    };
                }
                return null;
            })
            .filter(item => item !== null) as ProcessedSymbolMexcFutures[]; // Remove null entries
      }
      const processedSymbols = processSymbols(mexcFuturesPairsDataArr);
      console.log("Final data for Mexc Futures:", processedSymbols);





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


