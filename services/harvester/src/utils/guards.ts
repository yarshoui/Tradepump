import { BookModel, BookSide } from '@tradepump/types';
import { KrakenPayload } from '../lib/KrakenSocket/utils';

export const isTradingPair = (str: string) => /[A-Z0-9]{3,4}\/[A-Z0-9]{3,4}/.test(str);
export const isKrakenPayload = (payload: any): payload is KrakenPayload => (
  Array.isArray(payload)
  && payload.length === 4
  && isTradingPair(payload[3])
);
export const isBookTrade = (bookModels: any[]): bookModels is BookModel[] => bookModels.every(bookModel => (
  'side' in bookModel
  && (bookModel.side === BookSide.ask || bookModel.side === BookSide.bid)
));
