import { CurrencyPair } from "@tradepump/types";

export interface BinanceResponse extends Record<string, unknown> {
  id: string;
  status: number;
  result: Record<string, unknown>;
}

export interface BinanceBookUpdate {
  /**
   * Event type
   */
  e: "depthUpdate";
  /**
   * Event time
   */
  E: number;
  /**
   * Symbol
   */
  s: string;
  /**
   * First update ID in event
   */
  U: number;
  /**
   * Final update ID in event
   */
  u: number;
  /**
   * Bids to be updated
   * [Price level to be updated, Quantity][]
   */
  "b": [string, string][];
  /**
   * Asks to be updated
   * [Price level to be updated, Quantity][]
   */
  "a": [string, string][];
}

export interface BinanceTrade {
  /**
   * Event type
   */
  e: "trade";
  /**
   * Event time
   */
  E: number;
  /**
   * Symbol
   */
  s: string;
  /**
   * Trade ID
   */
  t: number;
  /**
   * Price
   */
  p: string;
  /**
   * Quantity
   */
  q: string;
  /**
   * Buyer order ID
   */
  b: number;
  /**
   * Seller order ID
   */
  a: number;
  /**
   * Trade time
   */
  T: number;
  /**
   * Is the buyer the market maker?
   */
  m: true;
  /**
   * Ignore
   */
  M: true;
}

export interface BinanceStream extends Record<string, unknown> {
  /**
   * <symbol>@trade|depth
   */
  stream: string;
  data: BinanceBookUpdate | BinanceTrade;
}

export type BinancePayload = BinanceResponse | BinanceStream;

export const isBinanceResponse = (payload: any): payload is BinanceResponse => "id" in payload;
export const isBinanceStream = (payload: any): payload is BinanceResponse => "stream" in payload;

export const isBinancePayload = (payload: any): payload is BinancePayload => isBinanceResponse(payload) || isBinanceStream(payload);

export const isBinancePair = (pair: CurrencyPair): boolean => {
  const [a, b] = pair.split("/");

  return a !== "USD" && b !== "USD" && a !== "EUR" && b !== "EUR";
};

export const symbolToPair = (symbol: string): CurrencyPair => {
  const pair = CurrencyPair.find(pair => pair.toLowerCase().replace(/\//g, "") === symbol.toLowerCase());

  if (!pair) {
    throw new Error(`Could not find currency pair match for symbol '${symbol}'`);
  }

  return pair;
};