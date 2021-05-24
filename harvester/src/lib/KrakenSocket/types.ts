export interface KrakenOptions {
  sendTimeout: number;
  onMessage?: (event: Buffer) => void;
}
export type KrakenStatus = 'online' | 'maintenance' | 'cancel_only' | 'limit_only' | 'post_only';
export type KrakenSocketEvents = 'ready' | 'statusChange' | 'open' | 'close';
