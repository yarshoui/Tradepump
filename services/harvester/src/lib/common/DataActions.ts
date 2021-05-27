import { BookModel, TradeModel } from '@tradepump/types';

export const enum DataEvent {
  TRADE_UPDATE = 'TRADE_UPDATE',
  BOOK_UPDATE = 'BOOK_UPDATE',
};

export const actions = {
  tradeUpdate: (payload: TradeModel[]) => ({
    type: DataEvent.TRADE_UPDATE,
    payload,
  }),
  bookUpdate: (payload: BookModel[]) => ({
    type: DataEvent.BOOK_UPDATE,
    payload,
  }),
};
export type actions = ReturnType<typeof actions[keyof typeof actions]>;
