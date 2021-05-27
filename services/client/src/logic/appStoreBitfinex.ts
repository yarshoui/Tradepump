import { debounce } from 'lodash';
import { action, computed, decorate, observable, reaction } from 'mobx';
import { CurrencyPair } from '@tradepump/types';
import {
  subscribeToBitfinexCurrencyPair,
  setBitfinexDataHandler,
  // getBitfinexSocket,
} from 'src/logic/bitfinexRest';
import { DEFAULT_PAIR } from 'src/logic/pairsConfig';
import { bitfinexOrdersDataArr } from 'src/logic/bitfinexRest';
//console.log ('bit1', bitfinexOrdersDataArr);
interface bitfinexOrdersDataArr {
  asks: any[];
  bids: any[];
}

export class AppStoreBitfinex {
  currentBitfinexPair: CurrencyPair = DEFAULT_PAIR;
  orderQuantity: number = 1;
  orderQuantityHighlight: number = 1;

  defaultQuantityHighlight = 1;

  shouldHighlight = (inputValue: string) => {
    if (this.orderQuantityHighlight === this.defaultQuantityHighlight) {
      return false;
    }

    return parseFloat(inputValue) >= this.orderQuantityHighlight;
  }

  bitfinexData: bitfinexOrdersDataArr = {
    asks: [],
    bids: [],
  };

  get askBidTable() {
    // console.table('@@@ get', this.bitfinexData.asks);

    const asks = this.bitfinexData.asks
      .filter((v) => {
        // console.log('@@@ get ask', parseFloat(v.amount));
        return parseFloat(v.amount) >= this.orderQuantity;
      })
      .slice(0, 30);
    // console.log('@@@ asks', asks);
    const bids = this.bitfinexData.bids
      .filter((v) => {
        return parseFloat(v.amount) >= this.orderQuantity;
      })
      .slice(0, 30);
    return {
      asks,
      bids,
    };
  }

  constructor() {
    reaction(
      () => this.currentBitfinexPair,
      (pair: CurrencyPair) => {
        // console.log('pairChanged', pair);
        subscribeToBitfinexCurrencyPair(pair);
      },
      {
        fireImmediately: true,
      },
    );

    // getBitfinexOrdersData();
  }

  setOrderQuantity = debounce((input: string) => {
    //Need to rename setOrderQuantity for Bitfinex
    const quantity = parseFloat(input);
    console.debug('setOrderQuantity Bitfinex', quantity);
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

  setCurrentBitfinexPair = (input: CurrencyPair) => {
    this.resetData();
    this.currentBitfinexPair = input;
  };

  setBitfinexData = (msg: any) => {
    const newData = msg;

    //  if (newData.channelID || newData.connectionID || !Array.isArray(newData) || newData.length < 2 || !newData[1]) {

    //      return;
    //  }

    this.resetData();

    console.debug(newData[1]);
    this.bitfinexData.asks = newData.asks;
    this.bitfinexData.bids = newData.bids;
  };

  resetData = () => {
    this.bitfinexData.asks = [];
    this.bitfinexData.bids = [];
  };
}

decorate(AppStoreBitfinex, {
  currentBitfinexPair: observable,
  bitfinexData: observable,
  orderQuantity: observable,
  resetData: action,
  setBitfinexData: action,
  askBidTable: computed,
});

const appStoreBitfinex = new AppStoreBitfinex();

setBitfinexDataHandler(appStoreBitfinex.setBitfinexData);

export { appStoreBitfinex };
