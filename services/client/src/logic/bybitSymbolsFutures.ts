
// interface BybitPairsData {
//   Response?: any | undefined;
//   dataHandler?: (msg: any) => void;
// }

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

};

export type FuturesSecondResponse = {
  category: string;
  list: FuturesSecondResponseListEntry[];
}

export let bybitFuturesPairsDataArr: any;
let pollingInterval: NodeJS.Timeout;

export const getBybitFuturesPairsData = () => {
 
  async function loadJson(urlBybitPairs: RequestInfo) {
    let responseBybit = await fetch(urlBybitPairs);
    let binData = await responseBybit.json();
    return binData;
  }

  function doRequest() {
    const urlBybitFuturesPairs = `https://api.bybit.com/v5/market/tickers?category=linear`; //Should be limited by 10-20 requests per sec
    loadJson(urlBybitFuturesPairs).then((data) => {
      const category = data.result.category;
      const list=data.result.list;
      const filteredList = list.map(( value:FuturesSecondResponseListEntry ) => {
        return {
          exchange: 'bybit', 
          symbol: value.symbol,
          askPrice: value.ask1Price,
          bidPrice: value.bid1Price,
          category,
        };
      });
     // debugger;

      bybitFuturesPairsDataArr = data;

      console.debug('bybitFuturesPairsData', bybitFuturesPairsDataArr);
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

export const subscribeToBybitFuturesPairsList = () => {
  
  getBybitFuturesPairsData();
  };


