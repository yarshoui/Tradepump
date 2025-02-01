import type { MexcSpotData, ProcessedSymbolMexcSpot } from './mexcSymbolsSpot';
import type { MexcFuturesData, ProcessedSymbolMexcFutures } from './mexcSymbolsFutures';
import type { KucoinFuturesData, ProcessedSymbolKucoinFutures } from './kucoinSymbolsFutures';
import type { BitgetSpotData, ProcessedSymbolBitgetSpot } from './bitgetSymbolsSpot';
import type { BitgetFuturesData, ProcessedSymbolBitgetFutures } from './bitgetSymbolsFutures';
import { appStoreArbitrage } from './arbitrageStore';
import type {
  FuturesSecondResponseListEntry,
  ProcessedSymbolBybitFutures,
} from './bybitSymbolsFutures';
import type { FuturesSecondResponse } from './bybitSymbolsFutures';
import type { SecondResponseListEntrySpot, ProcessedSymbolBybitSpot } from './bybitSymbolsSpot';
import type { SecondResponseSpot } from './bybitSymbolsSpot';

export let bybitSpotData: ProcessedSymbolBybitSpot[] = [];
export let bybitFuturesData: ProcessedSymbolBybitFutures[] = [];
export let mexcSymbolsSpotData: ProcessedSymbolMexcSpot[] = [];
export let mexcSymbolsFuturesData: ProcessedSymbolMexcFutures[] = [];
export let bitgetSymbolsSpotData: ProcessedSymbolBitgetSpot[] = [];
export let bitgetSymbolsFuturesData: ProcessedSymbolBitgetFutures[] = [];
export let kucoinSymbolsFuturesData: ProcessedSymbolKucoinFutures[] = [];

export function setBybitSpotData(data: ProcessedSymbolBybitSpot[]) {bybitSpotData = data;}
export function setBybitFuturesData(data: ProcessedSymbolBybitFutures[]) {bybitFuturesData = data;}
export function setMexcSymbolsSpotData(data: ProcessedSymbolMexcSpot[]) {mexcSymbolsSpotData = data;}
export function setMexcSymbolsFuturesData(data: ProcessedSymbolMexcFutures[]) {mexcSymbolsFuturesData = data;}
export function setBitgetSymbolsSpotData(data: ProcessedSymbolBitgetSpot[]) {bitgetSymbolsSpotData = data;}
export function setBitgetSymbolsFuturesData(data: ProcessedSymbolBitgetFutures[]) {bitgetSymbolsFuturesData = data;}
//export function setKucoinSymbolsSpotData(data: ProcessedSymbolMexcSpot[]) {kucoinSymbolsSpotData = data;}
export function setKucoinSymbolsFuturesData(data: ProcessedSymbolKucoinFutures[]) {kucoinSymbolsFuturesData = data;}

// let compareOutput: [] = []; //compare results go here
export function comparePrices() {
  const bybitFuturesVsMexcSpotData = BybitFuturesVsMexcSpot();
  const mexcFuturesVsBybitSpotData = compareMexcToBybit();
  const bitgetFuturesVsbybitSpotData = bitgetFutureVsbybitSpotData();
  const spotCompareResult = bybitSpotVSMexSpot();

  appStoreArbitrage.data = [
    ...mexcFuturesVsBybitSpotData,
    ...bybitFuturesVsMexcSpotData,
    ...bitgetFuturesVsbybitSpotData,
    ...spotCompareResult,
  ];
}
function BybitFuturesVsMexcSpot() {
  const data = compareBybitToMex();
  return data;
}

type ProcessedBaseBybitToBitgetItem = ProcessedSymbolBybitSpot | ProcessedSymbolBitgetFutures;
type ProcessedBaseBybitToMexcItem = ProcessedSymbolMexcSpot | ProcessedSymbolBybitFutures;
type ProcessedBaseBybitToMexcData = (ProcessedSymbolMexcSpot | ProcessedSymbolBybitFutures)[];
type ProcessedBaseBybitSpotToMexcSpotItem = ProcessedSymbolMexcSpot | ProcessedSymbolBybitSpot;

function findMatchingBaseBybitToMexc(
  smallerArray: ProcessedBaseBybitToMexcData,
  largerArray: ProcessedBaseBybitToMexcData,
): ProcessedBaseBybitToMexcData {
  const result: ProcessedSymbolMexcSpot[] | ProcessedSymbolBybitFutures[] = [];

  smallerArray.forEach((item1: ProcessedBaseBybitToMexcItem) => {
    const match = largerArray.find(
      (item2: ProcessedBaseBybitToMexcItem) => item1.base === item2.base,
    );
    if (match) {
      result.push((match as unknown) as any);
    }
  });
  return result;
}
//Bybit Spot, Mexc Futures
type ProcessedBaseMexcToBybitData = (ProcessedSymbolBybitSpot | ProcessedSymbolMexcFutures)[];

function findMatchingBaseMexcToBybit(
  smallerArray: ProcessedBaseMexcToBybitData,
  largerArray: ProcessedSymbolBybitSpot[] | ProcessedSymbolMexcFutures[],
): ProcessedSymbolBybitSpot[] | ProcessedSymbolMexcFutures[] {
  const result: ProcessedSymbolBybitSpot[] | ProcessedSymbolMexcFutures[] = [];
  smallerArray.forEach((item1) => {
    const match = largerArray.find((item2) => item1.base === item2.base);
    if (match) {
      result.push((match as unknown) as any);
    }
  });
  return result;
}

//Bybit Spot, Bitget Futures
type ProcessedBaseBitgetToBybitData = (ProcessedSymbolBybitSpot | ProcessedSymbolBitgetFutures)[];

function findMatchingBaseBitgetToBybit(
  smallerArray: ProcessedBaseBitgetToBybitData,
  largerArray: ProcessedSymbolBybitSpot[] | ProcessedSymbolBitgetFutures[],
): ProcessedSymbolBybitSpot[] | ProcessedSymbolBitgetFutures[] {
  const result: ProcessedSymbolBybitSpot[] | ProcessedSymbolBitgetFutures[] = [];
  smallerArray.forEach((item1) => {
    const match = largerArray.find((item2) => item1.base === item2.base);
    if (match) {
      result.push((match as unknown) as any);
    }
  });
  return result;
}

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
type FindGoodMatchBitgetBybit = {
  spot: ProcessedSymbolBybitSpot;
  futures: ProcessedSymbolBitgetFutures;
  spread: string;
};

const findGoodMatchBybitMexc = (
  spots: ProcessedSymbolMexcSpot[],
  futures: ProcessedSymbolBybitFutures[],
) => {
  const result: FindGoodMatchBybitMexc[] = [];
  spots.forEach((spot) => {
    const futureRecord = futures.find((futureRecord) => spot.base === futureRecord.base);
    if (futureRecord) {
      if (parseFloat(futureRecord.askPrice) / parseFloat(spot.bidPrice) > 1.1) {
        const spread: number =
          ((parseFloat(futureRecord.askPrice) - parseFloat(spot.bidPrice)) /
            parseFloat(spot.bidPrice)) *
          100;
        const fixed = spread.toFixed(0);
        result.push({ spot, futures: futureRecord, spread: fixed });
      }
    }
  });
  return result;
};

const findGoodMatchMexcBybit = (
  spots: ProcessedSymbolBybitSpot[],
  futures: ProcessedSymbolMexcFutures[],
) => {
  const result: FindGoodMatchMexcBybit[] = [];
  spots.forEach((spot) => {
    const futureRecord = futures.find((futureRecord) => spot.base === futureRecord.base);
    if (futureRecord) {
      if (parseFloat(futureRecord.askPrice) / parseFloat(spot.bidPrice) > 1.1) {
        const spread: number =
          ((parseFloat(futureRecord.askPrice) - parseFloat(spot.bidPrice)) /
            parseFloat(spot.bidPrice)) *
          100;
        const fixed = spread.toFixed(0);
        result.push({ spot, futures: futureRecord, spread: fixed });
      }
    }
  });
  return result;
};

//Bitget Futures, Bybit Spot
const findGoodMatchBitgetBybit = (
  spots: ProcessedSymbolBybitSpot[],
  futures: ProcessedSymbolBitgetFutures[],
) => {
  const result: FindGoodMatchBitgetBybit[] = [];
  spots.forEach((spot) => {
    const futureRecord = futures.find((futureRecord) => spot.base === futureRecord.base);
    if (futureRecord) {
      if (parseFloat(futureRecord.askPrice) / parseFloat(spot.bidPrice) > 1.1) {
        const spread: number =
          ((parseFloat(futureRecord.askPrice) - parseFloat(spot.bidPrice)) /
            parseFloat(spot.bidPrice)) *
          100;
        const fixed = spread.toFixed(0);

        result.push({ spot, futures: futureRecord, spread: fixed });
      }
    }
  });
  return result;
};

const isSpotArrayBybitMexc = (
  inputArray: ProcessedSymbolMexcSpot[] | ProcessedSymbolBybitFutures[],
): inputArray is ProcessedSymbolMexcSpot[] => {
  return inputArray?.[0]?.category === 'spot';
};

const isSpotArrayMexcBybit = (
  inputArray: ProcessedSymbolBybitSpot[] | ProcessedSymbolMexcFutures[],
): inputArray is ProcessedSymbolBybitSpot[] => {
  return inputArray?.[0]?.category === 'spot';
};
//Bitget Futures, Bybit Spot
const isSpotArrayBitgetBybit = (
  inputArray: ProcessedSymbolBybitSpot[] | ProcessedSymbolBitgetFutures[],
): inputArray is ProcessedSymbolBybitSpot[] => {
  return inputArray?.[0]?.category === 'spot';
};

function compareBybitToMex() {
  if (bybitFuturesData.length && mexcSymbolsSpotData.length) {
    const shorterArray: ProcessedBaseBybitToMexcData =
      bybitFuturesData.length < mexcSymbolsSpotData.length ? bybitFuturesData : mexcSymbolsSpotData;
    const largerArray =
      bybitFuturesData.length >= mexcSymbolsSpotData.length
        ? bybitFuturesData
        : mexcSymbolsSpotData;
    //Blacklist of Symbols for those two Exchanges Bybit Futures vs Mexc Spot
    const filteredShorterArray = shorterArray.filter(
      (item: ProcessedBaseBybitToMexcItem) =>
        !['ALT', 'GAS', 'QI', 'ARC', 'MDT'].includes(item.base),
    );

    //console.log('~~~', { filteredShorterArray, largerArray });

    const filteredBaseArray = findMatchingBaseBybitToMexc(filteredShorterArray, largerArray);

    if (isSpotArrayBybitMexc(filteredBaseArray)) {
      const winArray = findGoodMatchBybitMexc(filteredBaseArray, filteredShorterArray);
      //console.log('~~~ ', { winArray });
      return winArray;
    }
  }
  return [];
}

function compareMexcToBybit() {
  if (bybitSpotData.length && mexcSymbolsFuturesData.length) {
    const shorterArray = bybitSpotData.length < mexcSymbolsFuturesData.length ? bybitSpotData : mexcSymbolsFuturesData;
    const largerArray = bybitSpotData.length >= mexcSymbolsFuturesData.length ? bybitSpotData : mexcSymbolsFuturesData;
    const filteredBaseArray = findMatchingBaseMexcToBybit(shorterArray, largerArray);
    //console.log('@@@ file arbitrageStoreLogicForAllExchanges.ts line 219', shorterArray);
    const filteredShorterArray = shorterArray.filter(
      (item: ProcessedBaseBybitToMexcItem) => !['FB', 'DASH', 'ZEC'].includes(item.base),
    );

    // spot category
    if (isSpotArrayMexcBybit(filteredBaseArray)) {
      const winArray = findGoodMatchMexcBybit(filteredBaseArray, filteredShorterArray);
      //console.log('~~~ ', { winArray });
      return winArray;
    }
    // futures category
    else {
      const winArray = findGoodMatchMexcBybit(filteredShorterArray, filteredBaseArray);
      //console.log('~~~ ', { winArray });
      return winArray;
    }
  }
  return [];
}

function bitgetFutureVsbybitSpotData() {
  if (bybitSpotData.length && bitgetSymbolsFuturesData.length) {
    const shorterArray =
      bybitSpotData.length < bitgetSymbolsFuturesData.length ? bybitSpotData : bitgetSymbolsFuturesData;
    const largerArray = bybitSpotData.length >= bitgetSymbolsFuturesData.length ? bybitSpotData : bitgetSymbolsFuturesData;
    const filteredBaseArray = findMatchingBaseBitgetToBybit(shorterArray, largerArray);
    //console.log('@@@ file arbitrageStoreLogicForAllExchanges.ts line 219', shorterArray);
    const filteredShorterArray = shorterArray.filter(
      (item: ProcessedBaseBybitToBitgetItem) => ![''].includes(item.base),
    );

    if (isSpotArrayBitgetBybit(filteredBaseArray)) {
      const winArray = findGoodMatchBitgetBybit(filteredBaseArray, filteredShorterArray);
      //console.log('~~~ ', { winArray });
      return winArray;
    }
    else {
      const winArray = findGoodMatchBitgetBybit(filteredShorterArray, filteredBaseArray);
      //console.log('~~~ ', { winArray });
      return winArray;
    }
  }
  return [];
}

function bybitSpotVSMexSpot() {

  const filteredBybitArray = bybitSpotData.filter(
    (item: ProcessedBaseBybitSpotToMexcSpotItem) => !['BEAM', 'PLT', 'TAP', 'FB', 'DASH', 'ALT', 'NEIRO', 'GAME', 'CAT', 'RAIN', 'NGL', 'FMC', '', 'TRC'].includes(item.base),
  );
  const bybitToMex = compareSpotData(filteredBybitArray, mexcSymbolsSpotData);
  const mexToBybit = compareSpotData(mexcSymbolsSpotData, filteredBybitArray);

  console.log('@@@ file arbitrageStoreLogicForAllExchanges.ts line 309', bybitToMex, mexToBybit);

  return [...bybitToMex, ...mexToBybit];
}

function compareSpotData(spots1: any[], spots2: any[]) {
  const result: any[] = [];
  spots1.forEach((spot1) => {
    const spotMatch: any = spots2.find((spot2) => spot1.base === spot2.base);
    // console.log('@@@ file arbitrageStoreLogicForAllExchanges.ts line 316', spot1, spots2);

    if (spotMatch) {
      // console.log('@@@ file arbitrageStoreLogicForAllExchanges.ts line 318', spotMatch, spot1);

      if (parseFloat(spotMatch.askPrice) / parseFloat(spot1.bidPrice) > 1.1) {
        const spread: number =
          ((parseFloat(spotMatch.askPrice) - parseFloat(spot1.bidPrice)) / parseFloat(spot1.bidPrice)) * 100;
        const fixed = spread.toFixed(0);
        result.push({ spot: spot1, futures: spotMatch, spread: fixed });
      }
    }
  });

  return result;
}
