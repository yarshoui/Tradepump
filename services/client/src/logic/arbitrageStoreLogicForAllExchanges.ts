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
  // call function coparing bybit to mex
  // call function coparing bybit to bitget
  compareBybitToMex();
  const data = compareBybitToMex();
  appStoreArbitrage.data=data;
}



function findMatchingBase(
  smallerArray: ProcessedSymbolMexcSpot[] | ProcessedSymbolBybitFutures[],
  largerArray: ProcessedSymbolMexcSpot[] | ProcessedSymbolBybitFutures[]
): ProcessedSymbolMexcSpot[] | ProcessedSymbolBybitFutures[] {
  const result: ProcessedSymbolMexcSpot[] | ProcessedSymbolBybitFutures[] = [];
  smallerArray.forEach((item1) => {
    const match = largerArray.find((item2) => item1.base === item2.base);
    if (match) {
      // console.log(`@@@ Match found for base: ${item1.base}`, { match });
      //Тут дальше будет логика сравнения цен 
      result.push(match as unknown as any);
    }
  });
  return result;
}

// function compareSpotAndFutures(
//   spotArray: Spot[],
//   futuresArray: Futures[]
// ): void {
//   // Determine shorter and larger arrays
//   const [smallerArray, largerArray] =
//     spotArray.length < futuresArray.length
//       ? [spotArray, futuresArray]
//       : [futuresArray, spotArray];

//   // Find matching symbols and compare prices
//   smallerArray.forEach((spotItem) => {
//     if (spotItem.category === "spot") {
//       const futuresItem = largerArray.find(
//         (item) =>
//           item.category === "futures" && item.base === spotItem.base
//       );

//       if (futuresItem) {
//         // Calculate the price difference percentage
//         const priceDifference =
//           ((spotItem.askPrice - futuresItem.bidPrice) /
//             futuresItem.bidPrice) *
//           100;

//         if (priceDifference > 5) {
//           console.log(
//             `GOTCHA! ${spotItem.base} | Spot askPrice: ${spotItem.askPrice}, Futures bidPrice: ${futuresItem.bidPrice}, Difference: ${priceDifference.toFixed(
//               2
//             )}%`
//           );
//         }
//       }
//     }
//   });
// }


// function findSpreadBetweenSpotArrays(
//   shorterArray: SpotData[],
//   largerArray: SpotData[]
// ): void {
//   shorterArray.forEach((shorterItem) => {
//     const match = largerArray.find(
//       (largerItem) => largerItem.base === shorterItem.base
//     );

//     if (match) {
//       const buyPrice = shorterItem.askPrice; // Buy price from shorter array
//       const sellPrice = match.bidPrice; // Sell price from larger array

//       // Calculate percentage difference
//       const difference = ((sellPrice - buyPrice) / buyPrice) * 100;

//       if (difference > 5) {
//         console.log(
//           `GOTCHA Spot Spread: Base ${shorterItem.base}, Buy: ${buyPrice}, Sell: ${sellPrice}, Spread: ${difference.toFixed(2)}%`
//         );
//       }
//     }
//   });
// }
// const [shorterArray, largerArray] =  spotArray1.length < spotArray2.length ? [spotArray1, spotArray2] : [spotArray2, spotArray1];

// Call the function

type FindGoodMatch = {
  spot: ProcessedSymbolMexcSpot;
  futures: ProcessedSymbolBybitFutures;
};

const findGoodMatch = (spots: ProcessedSymbolMexcSpot[], futures: ProcessedSymbolBybitFutures[]): FindGoodMatch[] => {
  const result: FindGoodMatch[] = [];
  spots.forEach((spot) => {
    const futureRecord = futures.find((futureRecord) => spot.base === futureRecord.base);
    if (futureRecord) {
      
      if (parseFloat(futureRecord.askPrice) / parseFloat(spot.bidPrice) > 1.1) {
        result.push({ spot, futures: futureRecord });
      }
    }
  });
  return result;
};

const isSpotArray = (inputArray: ProcessedSymbolMexcSpot[] | ProcessedSymbolBybitFutures[]): inputArray is ProcessedSymbolMexcSpot[] => {
  return inputArray?.[0]?.category === 'spot';
};

function compareBybitToMex() {
  if (bybitFuturesData.length && mexcSymbolsSpotData.length) {

    
    
    const shorterArray = bybitFuturesData.length < mexcSymbolsSpotData.length ? bybitFuturesData : mexcSymbolsSpotData;
    const largerArray = bybitFuturesData.length >= mexcSymbolsSpotData.length ? bybitFuturesData : mexcSymbolsSpotData;


    console.log('~~~', { shorterArray, largerArray });
    //findSpreadBetweenSpotArrays(shorterArray, largerArray);
    //compareSpotAndFutures(spotArray, futuresArray);
  
    const filteredBaseArray = findMatchingBase(shorterArray, largerArray);

    if (isSpotArray(filteredBaseArray)) {
      const winArray = findGoodMatch(filteredBaseArray, shorterArray);
      console.log('~~~ ', { winArray });
      return winArray;
    }


    // TODO: add the case then filteredBaseArray is futures array
    
    
    console.log(
      '@@@ file arbitrageStoreLogicForAllExchanges.ts line 85',
      '@@@ Bibit Futures',
      bybitFuturesData,
      '@@@ Bibit Spot',
      bybitSpotData,
      '@@@ MEXC Spot',
      mexcSymbolsSpotData, 
      '@@@ MEXC Futures',           
      mexcSymbolsFuturesData,
      '@@@ Bitget Spot',
      bitgetSymbolsSpotData,
      '@@@ Bitget Futures',
      bitgetSymbolsFuturesData,
      { filteredBaseArray, shorterArray },
    );
  }
  return [];
}

//export default { bybitFuturesData };

