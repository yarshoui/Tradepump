import { debounce } from 'lodash';
import { action, computed, decorate, observable, reaction } from 'mobx';
import { CurrencyPair, decodeBookMessage, decodeTradeMessage, TradeModel, BookModel, BookSide, MarketType } from '@tradepump/types';
import {
  setDataHandler,
  getAPISocket,
} from 'src/logic/apiSocket';
import { DEFAULT_PAIR } from 'src/logic/pairsConfig';
import { tryParse } from 'src/utils/json-utils';

const enum DataEvent {
  BOOK_UPDATE = 1,
  TRADE_UPDATE = 2,
}
type APIPayload = {
  type: DataEvent.BOOK_UPDATE;
  models: BookModel[];
} | {
  type: DataEvent.TRADE_UPDATE;
  models: TradeModel[];
};

type APIData<T extends TradeModel | BookModel> = Record<MarketType, T[]>;

const stats = {
  counts: {} as Record<string, number>,
  lastMeasure: Date.now(),
  inc(name: string, count: number) {
    this.counts[name] = (this.counts[name] ?? 0) + count;
  },
  set(name: string, count: number) {
    this.counts[name] = count;
  },
  printAndReset() {
    const diff = ((Date.now() - this.lastMeasure) / 1000).toFixed(3);
    this.lastMeasure = Date.now();
    console.log("==========")
    console.log("== Last measured", diff, "seconds ago ==");
    for (const name in this.counts) {
      console.log(`${name} has ${this.counts[name]} count`);
      this.counts[name] = 0;
    }
    console.log("==========")
  }
};
// setInterval(() => {
//   stats.printAndReset();
// }, 1000);

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

  trades: APIData<TradeModel> = {
    [MarketType.binance]: [],
    [MarketType.kraken]: [],
    [MarketType.bitfinex]: [],
    [MarketType.bitstamp]: [],
  };
  books: APIData<BookModel> = {
    [MarketType.binance]: [],
    [MarketType.kraken]: [],
    [MarketType.bitfinex]: [],
    [MarketType.bitstamp]: [],
  };

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
    this.updateSubscription();
  }

  private async updateSubscription() {
    setDataHandler(this.setData);
    const socket = await getAPISocket();
    socket.send(JSON.stringify({
      pair: this.currentPair,
    }));
  }

  private filterBooks(market: MarketType) {
    const interestingBooks = this.books[market]
      .filter(book => book.volume >= this.orderQuantity);
    const asks = interestingBooks
      .filter(book => book.side === BookSide.ask)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 30);
    const bids = interestingBooks
      .filter(book => book.side === BookSide.bid)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 30);

    return {
      asks,
      bids,
    };
  }

  get askBidTableKraken() {
    return this.filterBooks(MarketType.kraken);
  }

  get askBidTableBitfinex() {
    return this.filterBooks(MarketType.bitfinex);
  }

  get askBidTableBinance() {
    return this.filterBooks(MarketType.binance);
  }

  get askBidTableBitstamp() {
    return this.filterBooks(MarketType.bitstamp);
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
    this.updateSubscription();
  };

  setData = (msg: string) => {
    const [message, error] = tryParse<APIPayload>(msg);

    if (error) {
      console.error(error);
      return;
    }
    if (!message) {
      console.error("Failed to get message", msg);
      return;
    }

    if (!message.models?.length) {
      return;
    }
    if (message.type === DataEvent.BOOK_UPDATE) {
      const models = message.models.filter(data => data.pair === this.currentPair) ?? [];

      for (const key in MarketType) {
        const market = key as typeof MarketType[keyof typeof MarketType];
        const data = models.filter(b => b.market === market);
        stats.inc(`${market} books per second`, data.length);
        this.books[market] = [
          ...data,
          ...this.books[market],
        ].slice(0, 200);
        stats.set(`${market} books buffer size`, this.books[market].length);
        stats.set(`${market} books asks`, this.books[market].filter(book => book.side === BookSide.ask).length);
        stats.set(`${market} books bids`, this.books[market].filter(book => book.side === BookSide.bid).length);
      }
    } else {
      const models = message.models.filter(data => data.pair === this.currentPair) ?? [];

      for (const key in MarketType) {
        const market = key as typeof MarketType[keyof typeof MarketType];
        const data = models.filter(b => b.market === market);
        // stats.addCount(`${market}-trades`, data.length);
        this.trades[market] = [
          ...data,
          ...this.trades[market],
        ].slice(0, 50);
      }
    }
  };

  resetData = () => {
    for (const key in MarketType) {
      const market = key as typeof MarketType[keyof typeof MarketType];
      this.books[market] = [];
      this.trades[market] = [];
    }
  };
}

decorate(AppStoreAPI, {
  currentPair: observable,
  captionText: observable,
  books: observable,
  trades: observable,
  orderQuantity: observable,
  resetData: action,
  setData: action,
  askBidTableKraken: computed,
  askBidTableBitfinex: computed,
  askBidTableBinance: computed,
  askBidTableBitstamp: computed,
});

const appStoreAPI = new AppStoreAPI();

export { appStoreAPI };
