import { action, decorate, observable } from 'mobx';
import { DEFAULT_PAIR, SelectorOptions } from 'src/logic/pairsConfig';
import { appStoreKraken } from 'src/logic/appStoreKraken';
import { appStoreBitfinex } from 'src/logic/appStoreBitfinex';
import { appStoreBinance } from 'src/logic/appStoreBinance';
import { appStoreBitstamp } from 'src/logic/appStoreBitstamp';

interface KrakenData {
  as: any[];
  bs: any[];
}

export class AppStore {
  currencyPair: SelectorOptions = DEFAULT_PAIR;
  orderQuantity: number = 1;
  orderQuantityHighlight: number = 1;

  tables = {
    kraken: appStoreKraken,
    bitfinex: appStoreBitfinex,
    binance: appStoreBinance,
    bitstamp: appStoreBitstamp,
  };

  setCurrencyPair = (input: SelectorOptions) => {
    this.currencyPair = input;
    this.tables.kraken.setCurrentKrakenPair(input);
    this.tables.bitfinex.setCurrentBitfinexPair(input);
    this.tables.binance.setCurrentBinancePair(input);
    this.tables.bitstamp.setCurrentBitstampPair(input);
  };

  setOrderQuantity = (input: string) => {
    // this.orderQuantity = input;
    this.tables.kraken.setOrderQuantity(input);
    this.tables.bitfinex.setOrderQuantity(input);
    this.tables.binance.setOrderQuantity(input);
    this.tables.bitstamp.setOrderQuantity(input);
  };

  setOrderQuantityHighlight = (input: string) => {
    // this.orderQuantity = input;
    this.tables.kraken.setOrderQuantityHighlight(input);
    // this.tables.bitfinex.setOrderQuantity(input);
    // this.tables.binance.setOrderQuantity(input);
    // this.tables.bitstamp.setOrderQuantity(input);
  };

}

decorate(AppStore, {
  currencyPair: observable,
  orderQuantity: observable,
  setCurrencyPair: action,
  setOrderQuantity: action,
});

const appStore = new AppStore();

export { appStore };
