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
      const category = data.result.category;
      const list=data.result.list;
      const filteredList = list.map(( value:BitgetFuturesData ) => {
        return {
          exchange: 'bitget', 
          symbol: value.symbol,
          askPrice: value.askPr,
          bidPrice: value.bidPr,
          category: 'futures',
        };
      });
      debugger;

      bitgetFuturesPairsDataArr = data;

      console.debug('bitgetFuturesPairsData', bitgetFuturesPairsDataArr);
    });

    function processSymbols(symbols: BitgetFuturesData[]): ProcessedSymbolBitgetFutures[] {
            return symbols
                .filter(data => data.symbol.includes("USDT")) // Filter symbols containing "USDT"
                .map(data => {
                    const match = data.symbol.match(/^(.*?)(USDT.*)$/); // Extract parts before and after "USDT"
                    if (match) {
                        return {
                            base: match[1],
                            quote: match[2],
                            bidPrice: data.bidPr,
                            askPrice: data.askPr,                        
                        };
                    }
                    return null;
                })
                .filter(item => item !== null) as ProcessedSymbolBitgetFutures[]; // Remove null entries
          }
          const processedSymbols = processSymbols(bitgetFuturesPairsDataArr);
          console.log("Final data for Bitget Spot:", processedSymbols);
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


