import { CurrencyPair } from './CurrencyPair';

export const enum TradeSide {
  Buy = 'buy',
  Sell = 'sell',
}
export const enum OrderType {
  Market = 'market',
  Limit = 'limit',
}
export const enum MarketType {
  Kraken = 'kraken',
  Bitfinex = 'bitfinex',
}
export interface TradeModel {
  pair: CurrencyPair;
  price: number;
  volume: number;
  time: number;
  side: TradeSide;
  type: OrderType;
  market: MarketType;
}
