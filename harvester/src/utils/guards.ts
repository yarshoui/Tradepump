import { CurrencyPair } from '../lib/common/CurrencyPair';

export const isTradingPair = (pair: string): pair is CurrencyPair => CurrencyPair.includes(pair as any);
