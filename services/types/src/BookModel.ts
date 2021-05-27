export const enum BookSide {
  Bid = 'bid',
  Ask = 'ask',
}

export interface BookModel {
  side: BookSide;
  price: number;
  volume: number;
  time: number;
}
