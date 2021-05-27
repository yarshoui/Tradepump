import { debounce } from 'lodash';
import { action, computed, decorate, observable, reaction } from 'mobx';
import { CurrencyPair } from '@tradepump/types';
import {
  subscribeToBitstampCurrencyPair,
  setBitstampDataHandler,
  // getBitstampSocket,
} from 'src/logic/bitstampRest';
import { bitstampOrdersDataArr } from 'src/logic/bitstampRest';
//import { bitstampLastTradeDataArr } from 'src/logic/bitstampRest';
import { DEFAULT_PAIR } from './pairsConfig';
//console.log ('bit1', bitstampOrdersDataArr);
interface bitstampOrdersDataArr {
  // lastUpdateId: any;
  asks: any[];
  bids: any[];
}
// interface bitstampLastTradeDataArr {
//   // lastUpdateId: any;
//   high: any;
//   last: any;
//   timestamp: any;
//   bid: any;
//   vwap: any;
//   volume: any;
//   low: any;
//   ask: any;
//   open: any;
// }

export class AppStoreBitstamp {
  currentBitstampPair: CurrencyPair = DEFAULT_PAIR;
  orderQuantity: number = 1;
  orderQuantityHighlight: number = 1;

  defaultQuantityHighlight = 1;

  shouldHighlight = (inputValue: string) => {
    if (this.orderQuantityHighlight === this.defaultQuantityHighlight) {
      return false;
    }

    return parseFloat(inputValue) >= this.orderQuantityHighlight;
  }

  bitstampData: bitstampOrdersDataArr = {
    asks: [],
    bids: [],
  };
  // bitstampLastTradeData: bitstampLastTradeDataArr = {
  //   high: "",
  //   last: "",
  //   timestamp: [],
  //   bid: [],
  //   vwap: [],
  //   volume: [],
  //   low: [],
  //   ask: [],
  //   open: [],
  // };

  get askBidTable() {
    //console.table('@@@ get', this.bitstampData.asks);

    const asks = this.bitstampData.asks
      .filter((v) => {
        // console.log('@@@ get ask bitstamp', parseFloat(v[1]));
        return parseFloat(v[1]) >= this.orderQuantity;
      })
      .slice(0, 30);
    // console.log('@@@ asks bitstamp', asks);
    const bids = this.bitstampData.bids
      .filter((v) => {
        return parseFloat(v[1]) >= this.orderQuantity;
      })
      .slice(0, 30);
      
    return {
      asks,
      bids,      
    };
  }
  // get lastTradePrice(){
  //   const lastTradePrc = this.bitstampLastTradeData.last;
  //   return lastTradePrc;
  // }

  constructor() {
    reaction(
      () => this.currentBitstampPair,
      (pair: CurrencyPair) => {
        console.debug('pairChanged', pair);
        subscribeToBitstampCurrencyPair(pair);
      },
      {
        fireImmediately: true,
      },
    );
  }

  setOrderQuantity = debounce((input: string) => {
    //Need to rename setOrderQuantity for Bitstamp
    const quantity = parseFloat(input);
    console.debug('setOrderQuantity Bitstamp', quantity);
    if (isNaN(quantity)) {
      console.warn('Wrong number', input);
      this.orderQuantity = 1;
      return;
    }

    this.orderQuantity = quantity;
    console.debug('here', this.orderQuantity);
  }, 1000);

  setOrderQuantityHighlight = debounce((input: string) => {
    const quantityHighlight = parseFloat(input);
    // console.log('setHighlightOrderQuantity', quantityHighlight);
    if (isNaN(quantityHighlight)) {
      console.warn('Wrong number', input);
      this.orderQuantityHighlight = 1;
      return;
    }

    this.orderQuantityHighlight = quantityHighlight;
  }, 1000);

  setCurrentBitstampPair = (input: CurrencyPair) => {
    this.resetData();
    this.currentBitstampPair = input;
  };

  setBitstampData = (msg: any) => {
    const newData = msg;

    //  if (newData.channelID || newData.connectionID || !Array.isArray(newData) || newData.length < 2 || !newData[1]) {

    //      return;
    //  }

    this.resetData();

    console.debug(newData[1]);
    this.bitstampData.asks = newData.asks;
    this.bitstampData.bids = newData.bids;
  };

  //setBitstampLastPrc = (msg: any) => {
   // const newData = msg;
    //this.resetData();

    // console.count('onmessage');
    // console.log(newData[1]);
   // this.bitstampLastTradeData.last = newData.lastTradePrc;
    
 // };

  resetData = () => {
    this.bitstampData.asks = [];
    this.bitstampData.bids = [];
   // this.bitstampLastTradeData.last = "";
  };
}

decorate(AppStoreBitstamp, {
  currentBitstampPair: observable,
  bitstampData: observable,
  orderQuantity: observable,
  resetData: action,
  setBitstampData: action,
  askBidTable: computed,
 // lastTradePrice: computed,
});

const appStoreBitstamp = new AppStoreBitstamp();

setBitstampDataHandler(appStoreBitstamp.setBitstampData);
//setBitstampDataHandler(appStoreBitstamp.setBitstampLastPrc);

export { appStoreBitstamp };
