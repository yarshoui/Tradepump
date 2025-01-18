import { debounce } from 'lodash';
import { action, computed, decorate, observable, reaction, toJS } from 'mobx';
import { CurrencyPair } from '@tradepump/types';
import {
  subscribeToBinanceCurrencyPair,
  setBinanceDataHandler,
  // getBinanceSocket,
} from 'src/logic/binanceRest';
// import { subscribeToBybitPairsList } from 'src/logic/bybitSymbolsSpot';
import { subscribeToBybitPairsList } from 'src/logic/bybitSymbolsSpot';
import { subscribeToBybitFuturesPairsList } from 'src/logic/bybitSymbolsFutures';
import { subscribeToMexcSpotPairsList } from 'src/logic/mexcSymbolsSpot';
import { subscribeToMexcFuturesPairsList } from 'src/logic/mexcSymbolsFutures';
import { DEFAULT_PAIR } from 'src/logic/pairsConfig';
//import { getBinanceOrdersData } from 'src/logic/binanceRest';
import { binanceOrdersDataArr } from 'src/logic/binanceRest';
//console.log ('bit1', binanceOrdersDataArr);
interface binanceOrdersDataArr {
  // lastUpdateId: any;
  asks: any[];
  bids: any[];
}

export class ArbitrageStore {
  data : any[]=[];
  

  get rowData() {
    return toJS(this.data);
  }
}

decorate(ArbitrageStore, {
  data: observable,
  rowData: computed,
});

export const appStoreArbitrage = new ArbitrageStore();

// setBinanceDataHandler(appStoreBinance.setBinanceData);

