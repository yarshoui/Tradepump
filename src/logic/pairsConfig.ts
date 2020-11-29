export type SelectorOptions = 'BTC/EUR' | 'BTC/USD';
export interface TradePairsConfig {
  kraken: string;
  bitfinex: string;
  binance: string;
  bittrex: string;
  bitstamp: string;
};

export const PAIRS: Record<SelectorOptions, TradePairsConfig> = {
  'BTC/EUR': {
    kraken: 'BTC/EUR',
    bitfinex: 'btceur',
    binance: 'BTCEUR',
    bittrex: 'BTC-EUR',
    bitstamp: 'btceur',
  },
  'BTC/USD': {
    kraken: 'BTC/USD',
    bitfinex: 'btcusd',
    binance: 'BTCUSDT',
    bittrex: 'BTC-USD',
    bitstamp: 'btcusd',
  },
};

export const DEFAULT_PAIR = 'BTC/USD';