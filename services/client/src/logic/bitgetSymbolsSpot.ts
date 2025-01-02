export type BitgetSpotData = {
  
  symbol: string;
  
  bidPr: string;
  
  askPr: string;
  
  category: string;
};

export type ProcessedSymbolBitgetSpot = {
  base: string;
  quote: string;
  bidPrice: string;
  askPrice: string;
  
};

export let bitgetPairsDataArr: any;
let pollingInterval: NodeJS.Timeout;

export const getBitgetPairsData = () => {
 
  async function loadJson(urlBitgetPairs: RequestInfo) {
    let responseBitget = await fetch(urlBitgetPairs, {mode:'cors'});
    let binData = await responseBitget.json();
    return binData;
  }

  function doRequest() {
    const urlBitgetPairs = `http://localhost:3003/bitgetapi`; //Should be limited by 10-20 requests per sec
    loadJson(urlBitgetPairs).then((data) => {
      const category = data.result.category;
      const list=data.result.list;
      const filteredList = list.map(( value:BitgetSpotData ) => {
        return {
          exchange: 'bitget', 
          symbol: value.symbol,
          askPrice: value.askPr,
          bidPrice: value.bidPr,
          category: 'spot',
        };
      });
      //debugger;
      bitgetPairsDataArr = data;
      console.debug('bitgetPairsData', bitgetPairsDataArr);            
    });

    function processSymbols(symbols: BitgetSpotData[]): ProcessedSymbolBitgetSpot[] {
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
          .filter(item => item !== null) as ProcessedSymbolBitgetSpot[]; // Remove null entries
    }
    const processedSymbols = processSymbols(bitgetPairsDataArr);
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

export const subscribeToBitgetSpotPairsList = () => {  
  getBitgetPairsData();
  };

  
// Example usage
// const apiResponse: SymbolData[] = [
//     { symbol: "METAL_USDT", bidPrice: "0.9", askPrice: "0.95", bidQty: "2046.5" },
//     { symbol: "RARIUSDT", bidPrice: "0.9", askPrice: "0.95", bidQty: "2046.5" },
//     { symbol: "BTCETH", bidPrice: "1.0", askPrice: "1.1", bidQty: "1500" },
// ];


// Output:
// [
//   { base: "METAL", quote: "USDT", bidPrice: "0.9", askPrice: "0.95" },
//   { base: "RARI", quote: "USDT", bidPrice: "0.9", askPrice: "0.95" }
// ]

