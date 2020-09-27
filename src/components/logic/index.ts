export const d = 1;
// export const subscribeToCurrencyPair = ()=>{
//   const payload = {
//     event: 'subscribe',
//     pair: ['XBT/USD'],
//     subscription: {
//       depth: 1000,
//       name: 'book',
//     }
//   };

//   return JSON.stringify(payload);
// }

// export const subscribeToTradeTable = ()=>{
//   const payload = {
//     event: 'subscribe',
//     pair: [],
//     subscription: {
//       name: 'trade',
//     }
//   };

//   return JSON.stringify(payload);
// }

// export function sendSubscription() {
//   // let subscription;

//   // switch (type) {
//   //   case '/':
//   //   case '/pair':
//   //     subscription = subscribeToCurrencyPair;
//   //     break;
//   //   case '/trade':
//   //     subscription = subscribeToTradeTable;
//   //     break;
//   // }

//   const sub = subscribeToCurrencyPair();
//   ws.send(sub);
// }

// export function prepareSocket() {
//   ws = new WebSocket('wss://ws.kraken.com');

//   ws.onclose = (data)=>{
//     prepareSocket();
//     console.log('WebSocket is closed now.', data);
//   }

//   ws.onopen = ()=>{
//     console.log('[open] Connection established 1');
//     setInterval(sendSubscription, 30000);

//     sendSubscription('/trade');
//   }

//   ws.onerror = (error)=>{
//     console.log(`[error] ${error.message}`);
//   }

//   ws.onmessage = function(msg) {  }
// }
