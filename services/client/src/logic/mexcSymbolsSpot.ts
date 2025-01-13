import { comparePrices, setMexcSymbolsSpotData } from './arbitrageStoreLogicForAllExchanges';

export type MexcSpotData = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  prevClosePrice: string;
  lastPrice: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  category: string;
};

export type ProcessedSymbolMexcSpot = {
  base: string;
  quote: string;
  bidPrice: string;
  askPrice: string;
  category: string;
  exchange: string;
};

export let mexcPairsDataArr: any;
let pollingInterval: NodeJS.Timeout;

export const getMexcPairsData = () => {
  async function loadJson(urlMexcPairs: RequestInfo) {
    let responseMexc = await fetch(urlMexcPairs, { mode: 'cors' });
    let binData = await responseMexc.json();
    return binData;
  }

  function doRequest() {
    const urlMexcPairs = `http://localhost:3001/api`; //Should be limited by 10-20 requests per sec
    loadJson(urlMexcPairs).then((data) => {
      const filteredList = data.map((value: MexcSpotData) => {
        return {
          symbol: value.symbol,
          askPrice: value.askPrice,
          bidPrice: value.bidPrice,
        };
      });
      // debugger;
      mexcPairsDataArr = data;
      const processedSymbolsData: ProcessedSymbolMexcSpot[] = processSymbols(filteredList);

      setMexcSymbolsSpotData(processedSymbolsData);
      comparePrices();

      function processSymbols(symbols: MexcSpotData[]): ProcessedSymbolMexcSpot[] {
        return symbols
          .filter((data) => data.symbol.includes('USDT')) // Filter symbols containing "USDT"
          .map((data) => {
            const match = data.symbol.match(/^(.*?)(USDT.*)$/); // Extract parts before and after "USDT"
            if (match) {
              return {
                base: match[1],
                quote: match[2],
                bidPrice: data.bidPrice,
                askPrice: data.askPrice,
                exchange: 'mexc',
                category: 'spot',
              };
            }
            return null;
          })
          .filter((item) => item !== null) as ProcessedSymbolMexcSpot[]; // Remove null entries
      }
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

export const subscribeToMexcSpotPairsList = () => {
  getMexcPairsData();
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
