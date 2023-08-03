import { BookModel, BookSide, CurrencyPair, MarketType, OrderType, TradeModel, TradeSide } from '@tradepump/types';

type KrakenPriceLevel = [string, string, string];
type KrakenTradePayload = [string, string, string, 's' | 'b', 'm' | 'l', string];
type KrakenBookPayload = {
  as?: KrakenPriceLevel[];
  a?: KrakenPriceLevel[];
  bs?: KrakenPriceLevel[];
  b?: KrakenPriceLevel[];
};
type KrakenBookWithDepth = 'book' | 'book-10' | 'book-25' | 'book-25' | 'book-100' | 'book-500' | 'book-1000';

interface KrakenEvent extends Record<string, unknown> {
  event: string;
}

export type KrakenPayload =
  // Event
  KrakenEvent |
  // Trade
  [number, KrakenTradePayload[], 'trade', CurrencyPair] |
  // Book
  [number, KrakenBookPayload, KrakenBookWithDepth, CurrencyPair] |
  // Book (unknown)
  [number, KrakenBookPayload, KrakenBookPayload, KrakenBookWithDepth, CurrencyPair];

export const isKrakenPayload = (payload: any): payload is KrakenPayload => (
  "event" in payload ||
  Array.isArray(payload)
);

export const parseKrakenPayload = (payload: KrakenPayload) => {
  if ("event" in payload) {
    return null;
  }
  // TODO: Decide if this is normal
  // Merge books with split a & b
  if (payload.length === 5) {
    payload = [
      payload[0],
      Object.assign(payload[1], payload[2]),
      payload[3],
      payload[4],
    ];
  }
  // XBT - Kraken's BTC
  const pair = payload[3].replace(/XBT/, "BTC");

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
        market: MarketType.kraken,
        pair,
        side: BookSide.ask,
        price: parseFloat(item[0]),
        volume: parseFloat(item[1]),
        time: parseFloat(item[2]) * 1000,
      })).concat(
        (payload[1].bs || payload[1].b || []).map<BookModel>(item => ({
          market: MarketType.kraken,
          side: BookSide.bid,
          pair,
          price: parseFloat(item[0]),
          volume: parseFloat(item[1]),
          time: parseFloat(item[2]) * 1000,
        })),
      );
    default:
      return null;
  }
};
