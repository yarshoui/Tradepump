import { BookModel, BookSide } from '@tradepump/types';

export const isTradingPair = (str: string) => /[A-Z0-9]{3,4}\/[A-Z0-9]{3,4}/.test(str);
export const isBookTrade = (bookModels: any[]): bookModels is BookModel[] => bookModels.every(bookModel => (
  'side' in bookModel
  && (bookModel.side === BookSide.ask || bookModel.side === BookSide.bid)
));
