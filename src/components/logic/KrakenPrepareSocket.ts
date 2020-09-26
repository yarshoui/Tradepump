import {sendSubscription} from './KrakenSubscribeOrders';
import {populateOrderTable} from './KrakenPopulateOrderTable';
import {data} from './KrakenPopulateOrderTable'
import { WSAEACCES } from 'constants';



 export const KrakenPrepareSocket = () => {
  let ws:any;
  ws = new WebSocket('wss://ws.kraken.com');

  ws.onclose = (data:any)=>{
//data is coming from KrakenPopulateOrderTable

    // todo reset if failed 5 times in 30-60second
    // timeOfClose = timeOfClose === 0 ? Date.now() timeOfClose
    // if timeOfClose - Date.now() > 60000 alert()

    KrakenPrepareSocket();
    console.log('WebSocket is closed now.', data);
    
  }
  

  ws.onopen = ()=>{
    console.log('[open] Connection established 1');
    setInterval(sendSubscription, 30000);
    //     ws.send(sendSubscription('/pair'));
    sendSubscription('/pair');
  }

  ws.onerror = (error)=>{
    console.log(`[error] ${error.message}`);
  }

  ws.onmessage = function(msg) {
    //     todo: 
  //   populateTradeTable(msg);
     populateOrderTable(msg);

  }
  //trying to make ws accessible for KrakenSubscribeOrder.ts
  return ws;
}


