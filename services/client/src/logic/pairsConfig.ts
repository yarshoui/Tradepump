import { CurrencyPair } from '@tradepump/types';
export interface TradePairsConfig {
  kraken: string;
  bitfinex: string;
  binance: string;
  bittrex: string;
  bitstamp: string;
};

export const PAIRS: Record<CurrencyPair, TradePairsConfig> = {
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
  'BTC/USDT': {
    kraken: 'BTC/USDT',
    bitfinex: 'btcusd',
    binance: 'BTCUSDT',
    bittrex: 'BTC-USD',
    bitstamp: 'btcusd',
  },
  'ETH/USD': {
    kraken: 'ETH/USD',
    bitfinex: 'ethusd',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: 'ethusd',
  },
  'ETH/EUR': {
    kraken: 'ETH/EUR',
    bitfinex: 'etheur',
    binance: 'ETHEUR',
    bittrex: 'BTC-USD',
    bitstamp: 'etheur',
  },
  'ETH/USDT': {
    kraken: 'ETH/USDT',
    bitfinex: '',
    binance: 'ETHUSDT',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'XRP/BTC': {
    kraken: 'XRP/BTC',
    bitfinex: 'xrpbtc',
    binance: 'XRPBTC',
    bittrex: 'BTC-USD',
    bitstamp: 'xrpbtc',
  },
  'XRP/ETH': {
    kraken: 'XRP/ETH',
    bitfinex: '',
    binance: 'XRPETH',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'XRP/USD': {
    kraken: 'XRP/USD',
    bitfinex: 'xrpusd',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: 'xrpusd',
  },
  'XRP/EUR': {
    kraken: 'XRP/EUR',
    bitfinex: '',
    binance: 'XRPEUR',
    bittrex: 'BTC-USD',
    bitstamp: 'xrpeur',
  },
  'XRP/USDT': {
    kraken: 'XRP/USDT',
    bitfinex: '',
    binance: 'XRPUSDT',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'ADA/BTC': {
    kraken: 'ADA/BTC',
    bitfinex: 'adabtc',
    binance: 'ADABTC',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'ADA/ETH': {
    kraken: 'ADA/ETH',
    bitfinex: '',
    binance: 'ADAETH',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'ADA/USD': {
    kraken: 'ADA/USD',
    bitfinex: 'adausd',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'ADA/EUR': {
    kraken: 'ADA/EUR',
    bitfinex: '',
    binance: 'ADAEUR',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'ADA/USDT': {
    kraken: 'ADA/USDT',
    bitfinex: '',
    binance: 'ADAUSDT',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'BCH/BTC': {
    kraken: 'BCH/BTC',
    bitfinex: '',
    binance: 'BCHBTC',
    bittrex: 'BTC-USD',
    bitstamp: 'bchbtc',
  },
  'BCH/ETH': {
    kraken: 'BCH/ETH',
    bitfinex: '',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'BCH/USD': {
    kraken: 'BCH/USD',
    bitfinex: 'bchn:usd',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: 'bchusd',
  },
  'BCH/EUR': {
    kraken: 'BCH/EUR',
    bitfinex: '',
    binance: 'BCHEUR',
    bittrex: 'BTC-USD',
    bitstamp: 'bcheur',
  },
  'BCH/USDT': {
    kraken: 'BCH/USDT',
    bitfinex: '',
    binance: 'BCHUSDT',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'LTC/BTC': {
    kraken: 'LTC/BTC',
    bitfinex: 'ltcbtc',
    binance: 'LTCBTC',
    bittrex: 'BTC-USD',
    bitstamp: 'ltcbtc',
  },
  'LTC/ETH': {
    kraken: 'LTC/ETH',
    bitfinex: '',
    binance: 'LTCETH',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'LTC/USD': {
    kraken: 'LTC/USD',
    bitfinex: 'ltcusd',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: 'ltcusd',
  },
  'LTC/EUR': {
    kraken: 'LTC/EUR',
    bitfinex: '',
    binance: 'LTCEUR',
    bittrex: 'BTC-USD',
    bitstamp: 'ltceur',
  },
  'LTC/USDT': {
    kraken: 'LTC/USDT',
    bitfinex: '',
    binance: 'LTCUSDT',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'EOS/BTC': {
    kraken: 'EOS/BTC',
    bitfinex: 'eosbtc',
    binance: 'EOSBTC',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'EOS/ETH': {
    kraken: 'EOS/ETH',
    bitfinex: 'eoseth',
    binance: 'EOSETH',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'EOS/USD': {
    kraken: 'EOS/USD',
    bitfinex: 'eosusd',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'EOS/EUR': {
    kraken: 'EOS/EUR',
    bitfinex: 'eoseur',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'EOS/USDT': {
    kraken: 'EOS/USDT',
    bitfinex: '',
    binance: 'EOSUSDT',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'DASH/BTC': {
    kraken: 'DASH/BTC',
    bitfinex: '',
    binance: 'DASHBTC',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'DASH/USD': {
    kraken: 'DASH/USD',
    bitfinex: '',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'DASH/EUR': {
    kraken: 'DASH/EUR',
    bitfinex: '',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'LINK/BTC': {
    kraken: 'LINK/BTC',
    bitfinex: '',
    binance: 'LINKBTC',
    bittrex: 'BTC-USD',
    bitstamp: 'linkbtc',
  },
  'LINK/ETH': {
    kraken: 'LINK/ETH',
    bitfinex: '',
    binance: 'LINKETH',
    bittrex: 'BTC-USD',
    bitstamp: 'linketh',
  },
  'LINK/USD': {
    kraken: 'LINK/USD',
    bitfinex: 'link:usd',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: 'linkusd',
  },
  'LINK/EUR': {
    kraken: 'LINK/EUR',
    bitfinex: '',
    binance: 'LINKEUR',
    bittrex: 'BTC-USD',
    bitstamp: 'linkeur',
  },
  'LINK/USDT': {
    kraken: 'LINK/USDT',
    bitfinex: '',
    binance: 'LINKUSDT',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'XLM/BTC': {
    kraken: '',
    bitfinex: 'xlmbtc',
    binance: 'XLMBTC',
    bittrex: 'BTC-USD',
    bitstamp: 'xlmbtc',
  },
  'XLM/ETH': {
    kraken: '',
    bitfinex: 'xlmeth',
    binance: 'XLMETH',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
  'XLM/USD': {
    kraken: 'XLM/USD',
    bitfinex: 'xlmusd',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: 'xlmusd',
  },
  'XLM/EUR': {
    kraken: 'XLM/EUR',
    bitfinex: '',
    binance: '',
    bittrex: 'BTC-USD',
    bitstamp: 'xlmeur',
  },
  'XLM/USDT': {
    kraken: '',
    bitfinex: '',
    binance: 'XLMUSDT',
    bittrex: 'BTC-USD',
    bitstamp: '',
  },
};

export const DEFAULT_PAIR: CurrencyPair = 'BTC/USD';
