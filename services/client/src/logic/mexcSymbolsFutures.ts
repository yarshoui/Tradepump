export type MexcFuturesData = {
  symbol: string;
  bid1: string;
  ask1: string;
  category: string;
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


