import { debounce } from 'lodash';
import { action, computed, decorate, observable, reaction } from 'mobx';
import { CurrencyPair, decodeBookMessage, decodeTradeMessage, TradeModel, BookModel, BookSide, MarketType } from '@tradepump/types';
import {
  setDataHandler,
  getAPISocket,
} from 'src/logic/apiSocket';
import { DEFAULT_PAIR } from 'src/logic/pairsConfig';

// TODO: Make Buffered array of limited size
interface APIData {
  trades: Record<MarketType, TradeModel[]>;
  books: Record<MarketType, BookModel[]>;
}

const stats = {
  counts: {} as Record<string, number>,
  addCount(name: string, count: number) {
    this.counts[name] = (this.counts[name] ?? 0) + count;
    if (Date.now() % 10000 === 0) {
      console.log(this.counts);
    }
  }
};

export class AppStoreAPI {
  currentPair: CurrencyPair = DEFAULT_PAIR;
  orderQuantity: number = 1;
  orderQuantityHighlight: number = 1;

  defaultQuantityHighlight = 1;

  shouldHighlight = (book: BookModel) => {
    if (this.orderQuantityHighlight === this.defaultQuantityHighlight) {
      return false;
    }

    return book.volume >= this.orderQuantityHighlight;
  }

  // captionText = 'Last Price';
  captionText = '';

  data: APIData = {
    trades: {
      [MarketType.binance]: [],
      [MarketType.kraken]: [],
      [MarketType.bitfinex]: [],
      [MarketType.bitstamp]: [],
    },
    books: {
      [MarketType.binance]: [],
      [MarketType.kraken]: [],
      [MarketType.bitfinex]: [],
      [MarketType.bitstamp]: [],
    },
  };

  get askBidTableKraken() {
    const interestingBooks = this.data.books.kraken
      .filter(book => book.volume >= this.orderQuantity);
    const asks = interestingBooks
      .filter(book => book.side === BookSide.ask)
      .slice(0, 30);
    const bids = interestingBooks
      .filter(book => book.side === BookSide.bid)
      .slice(0, 30);

    return {
      asks,
      bids,
    };
  }

  get askBidTableBitfinex() {
    const interestingBooks = this.data.books.bitfinex
      .filter(book => book.volume >= this.orderQuantity);
    const asks = interestingBooks
      .filter(book => book.side === BookSide.ask)
      .slice(0, 30);
    const bids = interestingBooks
      .filter(book => book.side === BookSide.bid)
      .slice(0, 30);

    return {
      asks,
      bids,
    };
  }

  get askBidTableBinance() {
    const interestingBooks = this.data.books.binance
      .filter(book => book.volume >= this.orderQuantity);
    const asks = interestingBooks
      .filter(book => book.side === BookSide.ask)
      .slice(0, 30);
    const bids = interestingBooks
      .filter(book => book.side === BookSide.bid)
      .slice(0, 30);

    return {
      asks,
      bids,
    };
  }

  get askBidTableBitstamp() {
    const interestingBooks = this.data.books.bitstamp
      .filter(book => book.volume >= this.orderQuantity);
    const asks = interestingBooks
      .filter(book => book.side === BookSide.ask)
      .slice(0, 30);
    const bids = interestingBooks
      .filter(book => book.side === BookSide.bid)
      .slice(0, 30);

    return {
      asks,
      bids,
    };
  }

  constructor() {
    reaction(
      () => this.currentPair,
      (pair: CurrencyPair) => {
        console.debug('pairChanged', pair);
      },
      {
        fireImmediately: true,
      },
    );
  }

  setOrderQuantity = debounce((input: string) => {
    const quantity = parseFloat(input);
    if (isNaN(quantity)) {
      console.warn('Wrong number', input);
      this.orderQuantity = 1;
      return;
    }

    this.orderQuantity = quantity;
  }, 1000);

  setOrderQuantityHighlight = debounce((input: string) => {
    const quantityHighlight = parseFloat(input);
    if (isNaN(quantityHighlight)) {
      console.warn('Wrong number', input);
      this.orderQuantityHighlight = 1;
      return;
    }

    this.orderQuantityHighlight = quantityHighlight;
  }, 1000);


  setCurrentAPIPair = (input: CurrencyPair) => {
    this.resetData();
    this.currentPair = input;
  };

  setData = (msg: ArrayBuffer) => {
    // 1 - Book, 2 - Trade - see Harvester service for more info
    const mode = new Uint8Array(msg.slice(0, 1))[0];
    const buffer = new Uint8Array(msg.slice(1));
    const message = mode === 1 ? decodeBookMessage(buffer) : decodeTradeMessage(buffer);

    if (!message.models?.length) {
      return;
    }
    if (mode === 1) {
      const models = (message.models as BookModel[])?.filter(data => data.pair === this.currentPair) ?? [];

      for (const key in MarketType) {
        const market = key as typeof MarketType[keyof typeof MarketType];
        const data = models.filter(b => b.market === market);
        stats.addCount(`${market}-books`, data.length);
        this.data.books[market] = [
          ...data,
          ...this.data.books[market],
        ].slice(0, 100);
      }
    } else {
      const models = (message.models as TradeModel[])?.filter(data => data.pair === this.currentPair) ?? [];

      for (const key in MarketType) {
        const market = key as typeof MarketType[keyof typeof MarketType];
        const data = models.filter(b => b.market === market);
        stats.addCount(`${market}-trades`, data.length);
        this.data.trades[market] = [
          ...data,
          ...this.data.trades[market],
        ].slice(0, 100);
      }
    }
  };

  resetData = () => {
    for (const key in MarketType) {
      const market = key as typeof MarketType[keyof typeof MarketType];
      this.data.books[market] = [];
      this.data.trades[market] = [];
    }
  };
}

decorate(AppStoreAPI, {
  currentPair: observable,
  captionText: observable,
  data: observable,
  orderQuantity: observable,
  resetData: action,
  setData: action,
  askBidTableKraken: computed,
  askBidTableBitfinex: computed,
  askBidTableBinance: computed,
  askBidTableBitstamp: computed,
});

const appStoreAPI = new AppStoreAPI();
setDataHandler(appStoreAPI.setData);
getAPISocket();

export { appStoreAPI };
