import { debounce } from 'lodash';
import { action, computed, decorate, observable, reaction } from 'mobx';
import {
  subscribeToBinanceCurrencyPair,
  setBinanceDataHandler,
  // getBinanceSocket,
} from 'src/logic/binanceRest';
import { DEFAULT_PAIR, SelectorOptions } from 'src/logic/pairsConfig';
//import { getBinanceOrdersData } from 'src/logic/binanceRest';
import { binanceOrdersDataArr } from 'src/logic/binanceRest';
//console.log ('bit1', binanceOrdersDataArr);
interface binanceOrdersDataArr {
  // lastUpdateId: any;
  asks: any[];
  bids: any[];
}

export class AppStoreBinance {
  currentBinancePair: SelectorOptions = DEFAULT_PAIR;
  orderQuantity: number = 1;

  binanceData: binanceOrdersDataArr = {
    asks: [],
    bids: [],
  };

  get askBidTable() {
    //console.table('@@@ get', this.binanceData.asks);

    const asks = this.binanceData.asks
      .filter((v) => {
        // console.log('@@@ get ask binance', parseFloat(v[1]));
        return parseFloat(v[1]) >= this.orderQuantity;
      })
      .slice(0, 30);
    //console.log('@@@ asks binance', asks);
    const bids = this.binanceData.bids
      .filter((v) => {
        return parseFloat(v[1]) >= this.orderQuantity;
      })
      .slice(0, 30);
    return {
      asks,
      bids,
    };
  }

  constructor() {
    reaction(
      () => this.currentBinancePair,
      (pair: SelectorOptions) => {
        console.log('pairChanged', pair);
        subscribeToBinanceCurrencyPair(pair);
      },
      {
        fireImmediately: true,
      },
    );
  }

  setOrderQuantity = debounce((input: string) => {
    //Need to rename setOrderQuantity for Binance
    const quantity = parseFloat(input);
    console.log('setOrderQuantity Binance', quantity);
    if (isNaN(quantity)) {
      console.warn('Wrong number', input);
      this.orderQuantity = 1;
      return;
    }

    this.orderQuantity = quantity;
    console.log('here', this.orderQuantity);
  }, 1000);

  setCurrentBinancePair = (input: SelectorOptions) => {
    this.currentBinancePair = input;
  };

  setBinanceData = (msg: any) => {
    const newData = msg;

    //  if (newData.channelID || newData.connectionID || !Array.isArray(newData) || newData.length < 2 || !newData[1]) {

    //      return;
    //  }

    this.resetData();

    console.count('onmessage');
    console.log(newData[1]);
    this.binanceData.asks = newData.asks;
    this.binanceData.bids = newData.bids;
  };

  resetData = () => {
    this.binanceData.asks = [];
    this.binanceData.bids = [];
  };
}

decorate(AppStoreBinance, {
  currentBinancePair: observable,
  binanceData: observable,
  orderQuantity: observable,
  resetData: action,
  setBinanceData: action,
  askBidTable: computed,
});

const appStoreBinance = new AppStoreBinance();

setBinanceDataHandler(appStoreBinance.setBinanceData);

export { appStoreBinance };
