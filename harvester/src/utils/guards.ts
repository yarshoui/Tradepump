import { BookModel, BookSide, CurrencyPair } from '../../../types';
import { KrakenPayload } from '../lib/KrakenSocket/utils';

export const isTradingPair = (pair: string): pair is CurrencyPair => CurrencyPair.includes(pair as any);
export const isKrakenPayload = (payload: any): payload is KrakenPayload => (
  Array.isArray(payload)
  && payload.length === 4
  && isTradingPair(payload[3])
);
export const isBookTrade = (bookModels: any[]): bookModels is BookModel[] => bookModels.every(bookModel => (
  'side' in bookModel
  && (bookModel.side === BookSide.Ask || bookModel.side === BookSide.Bid)
));
