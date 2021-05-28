import { BookModel, BookSide, CurrencyPair, MarketType, OrderType, TradeModel, TradeSide } from '@tradepump/types';

type PriceLevel = [string, string, string];
type TradePayload = [string, string, string, 's' | 'b', 'm' | 'l', string];
type BookPayload = {
  as?: PriceLevel[];
  a?: PriceLevel[];
  bs?: PriceLevel[];
  b?: PriceLevel[];
};
type BookWithDepth = 'book' | 'book-10' | 'book-25' | 'book-25' | 'book-100' | 'book-500' | 'book-1000';

export type KrakenPayload =
  // Trade
  [number, TradePayload[], 'trade', CurrencyPair] |
  // Book
  [number, BookPayload, BookWithDepth, CurrencyPair];

export const parseKrakenPayload = (payload: KrakenPayload) => {
  const pair = payload[3];

  switch (payload[2]) {
    case 'trade':
      return payload[1].map<TradeModel>(item => ({
        market: MarketType.kraken,
        pair,
        type: item[4] === 'l' ? OrderType.limit : OrderType.market,
        side: item[3] === 's' ? TradeSide.sell : TradeSide.sell,
        price: parseFloat(item[0]),
        volume: parseFloat(item[1]),
        time: parseFloat(item[2]) * 1000,
      }));
    case 'book-10':
    case 'book-25':
    case 'book-100':
    case 'book-500':
    case 'book-1000':
    case 'book':
      if (
        !payload[1].as && !payload[1].a &&
        !payload[1].bs && !payload[1].b
      ) {
        return null;
      }

      return (payload[1].as || payload[1].a || []).map<BookModel>(item => ({
          side: BookSide.ask,
          price: parseFloat(item[0]),
          volume: parseFloat(item[1]),
          time: parseFloat(item[2]) * 1000,
        })).concat(
          (payload[1].bs || payload[1].b || []).map<BookModel>(item => ({
            side: BookSide.bid,
            price: parseFloat(item[0]),
            volume: parseFloat(item[1]),
            time: parseFloat(item[2]) * 1000,
          })),
        );
    default:
      return null;
  }
};
