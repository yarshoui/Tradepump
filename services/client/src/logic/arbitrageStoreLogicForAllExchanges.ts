import { subscribeToMexcSpotPairsList } from './mexcSymbolsSpot';
import { subscribeToMexcFuturesPairsList } from './mexcSymbolsFutures';
import { subscribeToBybitPairsList } from './bybitSymbolsSpot';
import { subscribeToBybitFuturesPairsList } from './bybitSymbolsFutures';
import type { MexcSpotData, ProcessedSymbolMexcSpot } from './mexcSymbolsSpot';
import type { MexcFuturesData, ProcessedSymbolMexcFutures } from './mexcSymbolsFutures';
import type { BitgetSpotData, ProcessedSymbolBitgetSpot } from './bitgetSymbolsSpot';
import type { BitgetFuturesData, ProcessedSymbolBitgetFutures } from './bitgetSymbolsFutures';
import {appStoreArbitrage} from './arbitrageStore';
import type {
  FuturesSecondResponseListEntry,
  ProcessedSymbolBybitFutures,
} from './bybitSymbolsFutures';
import type { FuturesSecondResponse } from './bybitSymbolsFutures';
import type { 
  SecondResponseListEntrySpot,
  ProcessedSymbolBybitSpot,
 } from './bybitSymbolsSpot';
import type { SecondResponseSpot } from './bybitSymbolsSpot';


export let bybitSpotData: ProcessedSymbolBybitSpot[] = [];
export let bybitFuturesData: ProcessedSymbolBybitFutures[] = [];
export let mexcSymbolsSpotData: ProcessedSymbolMexcSpot[] = [];
export let mexcSymbolsFuturesData: ProcessedSymbolMexcFutures[] = [];
export let bitgetSymbolsSpotData: ProcessedSymbolBitgetSpot[] = [];
export let bitgetSymbolsFuturesData: ProcessedSymbolBitgetFutures[] = [];

export function setBybitSpotData(data: ProcessedSymbolBybitSpot[]) {
  bybitSpotData = data;
}
export function setBybitFuturesData(data: ProcessedSymbolBybitFutures[]) {
  bybitFuturesData = data;
}
export function setMexcSymbolsSpotData(data: ProcessedSymbolMexcSpot[]) {
  mexcSymbolsSpotData = data;
}
export function setMexcSymbolsFuturesData(data: ProcessedSymbolMexcFutures[]) {
  mexcSymbolsFuturesData = data;
}
export function setBitgetSymbolsSpotData(data: ProcessedSymbolBitgetSpot[]) {
  bitgetSymbolsSpotData = data;
}
export function setBitgetSymbolsFuturesData(data: ProcessedSymbolBitgetFutures[]) {
  bitgetSymbolsFuturesData = data;
}

let compareOutput: [] = []; //compare results go here
export function comparePrices() {
  BybitFuturesVsMexcSpot();
  // call function coparing bybit to mex
  // call function coparing bybit to bitget
  
  // compareMexcToBybit();
  // const data2 = compareMexcToBybit();
  // appStoreArbitrage.data=data2;
}
function BybitFuturesVsMexcSpot () {
  compareBybitToMex();
  const data = compareBybitToMex();
  appStoreArbitrage.data=data;
};


function findMatchingBaseBybitToMexc(
  smallerArray: ProcessedSymbolMexcSpot[] | ProcessedSymbolBybitFutures[],
  largerArray: ProcessedSymbolMexcSpot[] | ProcessedSymbolBybitFutures[]
): ProcessedSymbolMexcSpot[] | ProcessedSymbolBybitFutures[] {
  const result: ProcessedSymbolMexcSpot[] | ProcessedSymbolBybitFutures[] = [];
  smallerArray.forEach((item1) => {
    const match = largerArray.find((item2) => item1.base === item2.base);
    if (match) {
      result.push(match as unknown as any);
    }
  });
  return result;
}

function findMatchingBaseMexcToBybit(
  smallerArray: ProcessedSymbolBybitSpot[] | ProcessedSymbolMexcFutures[],
  largerArray: ProcessedSymbolBybitSpot[] | ProcessedSymbolMexcFutures[]
): ProcessedSymbolBybitSpot[] | ProcessedSymbolMexcFutures[] {
  const result: ProcessedSymbolBybitSpot[] | ProcessedSymbolMexcFutures[] = [];
  smallerArray.forEach((item1) => {
    const match = largerArray.find((item2) => item1.base === item2.base);
    if (match) {
      result.push(match as unknown as any);
    }
  });
  return result;
}

// export type UnifiedEntity = {
//   base: string;
//   type: 'spot' | 'futures';
//   quote: string;
//   bidPrice: number;
//   askPrice: number;
//   symbol: string;
//   spread: number;
//   exchange: string;
// };

// function findMatchingBase2(
//   futures: UnifiedEntity[],
//   spots: UnifiedEntity[]
// ): UnifiedEntity[] {
//   const larger = futures.length > spots.length ? futures : spots;
//   const smaller = futures.length <= spots.length ? futures : spots;
//   const result: UnifiedEntity[] = [];
//   smaller.forEach((item1) => {
//     const match = larger.find((item2) => item1.base === item2.base);
//     if (match) {
//       result.push(match as unknown as any);
//     }
//   });
//   return result;
// }



type FindGoodMatchBybitMexc = {
  spot: ProcessedSymbolMexcSpot;
  futures: ProcessedSymbolBybitFutures;
  spread: string;
};

type FindGoodMatchMexcBybit = {
  spot: ProcessedSymbolBybitSpot;
  futures: ProcessedSymbolMexcFutures;
  spread: string;
};

const findGoodMatchBybitMexc = (spots: ProcessedSymbolMexcSpot[], futures: ProcessedSymbolBybitFutures[]) => {
  const result: FindGoodMatchBybitMexc[] = [];
  spots.forEach((spot) => {
    const futureRecord = futures.find((futureRecord) => spot.base === futureRecord.base);
    if (futureRecord) {
      if ((parseFloat(futureRecord.askPrice) / parseFloat(spot.bidPrice)) > 1.1) {
        const spread: number = ((parseFloat(futureRecord.askPrice) - parseFloat(spot.bidPrice))/parseFloat(spot.bidPrice)) * 100;
        const fixed = spread.toFixed(0);
        result.push({ spot, futures: futureRecord, spread: fixed });
      }
    }
  });
  return result;
};

const findGoodMatchMexcBybit = (spots: ProcessedSymbolBybitSpot[], futures: ProcessedSymbolMexcFutures[]) => {
  const result: FindGoodMatchMexcBybit[] = [];
  spots.forEach((spot) => {
    const futureRecord = futures.find((futureRecord) => spot.base === futureRecord.base);
    if (futureRecord) {
      if ((parseFloat(futureRecord.askPrice) / parseFloat(spot.bidPrice)) > 0.9) {
        const spread: number = ((parseFloat(futureRecord.askPrice) - parseFloat(spot.bidPrice))/parseFloat(spot.bidPrice)) * 100;
        const fixed = spread.toFixed(0);
        result.push({ spot, futures: futureRecord, spread: fixed });
      }
    }
  });
  return result;
};

const isSpotArrayBybitMexc = (inputArray: ProcessedSymbolMexcSpot[] | ProcessedSymbolBybitFutures[]): inputArray is ProcessedSymbolMexcSpot[] => {
  return inputArray?.[0]?.category === 'spot';
};

const isSpotArrayMexcBybit = (inputArray: ProcessedSymbolBybitSpot[] | ProcessedSymbolMexcFutures[]): inputArray is ProcessedSymbolBybitSpot[] => {
  return inputArray?.[0]?.category === 'spot';
};

function compareBybitToMex() {
  if (bybitFuturesData.length && mexcSymbolsSpotData.length) {    
    
    const shorterArray = bybitFuturesData.length < mexcSymbolsSpotData.length ? bybitFuturesData : mexcSymbolsSpotData;
    const largerArray = bybitFuturesData.length >= mexcSymbolsSpotData.length ? bybitFuturesData : mexcSymbolsSpotData;

    console.log('~~~', { shorterArray, largerArray });    
  
    const filteredBaseArray = findMatchingBaseBybitToMexc(shorterArray, largerArray);

    if (isSpotArrayBybitMexc(filteredBaseArray)) {
      const winArray = findGoodMatchBybitMexc(filteredBaseArray, shorterArray);
      console.log('~~~ ', { winArray });
      return winArray;
    }


    // TODO: add the case then filteredBaseArray is futures array
    
    
    // console.log(
    //   '@@@ file arbitrageStoreLogicForAllExchanges.ts line 85',
    //   '@@@ Bibit Futures',
    //   bybitFuturesData,
    //   '@@@ Bibit Spot',
    //   bybitSpotData,
    //   '@@@ MEXC Spot',
    //   mexcSymbolsSpotData, 
    //   '@@@ MEXC Futures',           
    //   mexcSymbolsFuturesData,
    //   '@@@ Bitget Spot',
    //   bitgetSymbolsSpotData,
    //   '@@@ Bitget Futures',
    //   bitgetSymbolsFuturesData,
    //   { filteredBaseArray, shorterArray },
    // );
  }
  return [];
}

function compareMexcToBybit() {
  if (bybitSpotData.length && mexcSymbolsFuturesData.length) {    
    
    const shorterArray = bybitSpotData.length < mexcSymbolsFuturesData.length ? bybitSpotData : mexcSymbolsFuturesData;
    const largerArray = bybitSpotData.length >= mexcSymbolsFuturesData.length ? bybitSpotData : mexcSymbolsFuturesData;
    const filteredBaseArray = findMatchingBaseMexcToBybit(shorterArray, largerArray);

    if (isSpotArrayMexcBybit(filteredBaseArray)) {
      const winArray = findGoodMatchMexcBybit(filteredBaseArray, shorterArray);
      console.log('~~~ ', { winArray });
      return winArray;
    }  
  }
  return [];
}
//export default { bybitFuturesData };

