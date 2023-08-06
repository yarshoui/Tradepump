import { action, decorate, observable } from 'mobx';
import { CurrencyPair } from '@tradepump/types';
import { DEFAULT_PAIR } from 'src/logic/pairsConfig';
import { appStoreAPI } from 'src/logic/appStoreAPI';
import { appStoreKraken } from 'src/logic/appStoreKraken';
import { appStoreBitfinex } from 'src/logic/appStoreBitfinex';
import { appStoreBinance } from 'src/logic/appStoreBinance';
import { appStoreBitstamp } from 'src/logic/appStoreBitstamp';

export class AppStore {
  currencyPair: CurrencyPair = DEFAULT_PAIR;
  orderQuantity: number = 1;
  orderQuantityHighlight: number = 1;

  tables = {
    api: appStoreAPI,
    // kraken: appStoreKraken,
    // bitfinex: appStoreBitfinex,
    // binance: appStoreBinance,
    // bitstamp: appStoreBitstamp,
  };

  setCurrencyPair = (input: CurrencyPair) => {
    this.currencyPair = input;
    this.tables.api.setCurrentAPIPair(input);
    // this.tables.kraken.setCurrentKrakenPair(input);
    // this.tables.bitfinex.setCurrentBitfinexPair(input);
    // this.tables.binance.setCurrentBinancePair(input);
    // this.tables.bitstamp.setCurrentBitstampPair(input);
  };

  setOrderQuantity = (input: string) => {
    const quantity = parseInt(input);

    if (isNaN(quantity)) {
      console.log("Quantity is not int:", input);
      return;
    }
    this.orderQuantity = quantity;
    this.tables.api.setOrderQuantity(input);
    // this.tables.kraken.setOrderQuantity(input);
    // this.tables.bitfinex.setOrderQuantity(input);
    // this.tables.binance.setOrderQuantity(input);
    // this.tables.bitstamp.setOrderQuantity(input);
  };

  setOrderQuantityHighlight = (input: string) => {
    const quantity = parseInt(input);

    if (isNaN(quantity)) {
      console.log("Quantity is not int:", input);
      return;
    }
    this.orderQuantityHighlight = quantity;
    this.tables.api.setOrderQuantityHighlight(input);
    // this.tables.kraken.setOrderQuantityHighlight(input);
    // this.tables.bitfinex.setOrderQuantityHighlight(input);
    // this.tables.binance.setOrderQuantityHighlight(input);
    // this.tables.bitstamp.setOrderQuantityHighlight(input);
  };

}

decorate(AppStore, {
  currencyPair: observable,
  orderQuantity: observable,
  setCurrencyPair: action,
  setOrderQuantity: action,
});

export const appStore = new AppStore();
