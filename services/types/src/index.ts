export * from './CurrencyPair';
export * from "./types";
export * from './TradeModel';
export * from './BookModel';
import { BookSide, BookModel } from "./BookModel";

export enum QueueName {
    TradingQueue = "trading_queue",
}

export const isBookTrade = (bookModels: any[]): bookModels is BookModel[] => bookModels.every(bookModel => (
    'side' in bookModel
    && (bookModel.side === BookSide.ask || bookModel.side === BookSide.bid)
));
