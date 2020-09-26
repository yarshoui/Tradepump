import {KrakenPrepareSocket} from './KrakenPrepareSocket';
//import {ws} from './KrakenPrepareSocket'

export const subscribeToCurrencyPair = ()=>{


  let pairFilterInput:  HTMLElement | null = document.getElementById('pairfilter');
  if (pairFilterInput) {
    const definitelyAnElement: HTMLElement = pairFilterInput;
  }
 
  if (Object.is(pairFilterInput, null)) return;
  const payload = {
    event: 'subscribe',
    pair: [pairFilterInput.value, ],
    subscription: {
      depth: 1000,
      name: 'book',
    }
  };
  return JSON.stringify(payload);
}

export function sendSubscription(/*type='/pair'*/) {
  ws.send(subscribeToCurrencyPair);
 /* let subscription;

  //   switch(window.location.pathname) {
  switch (type) {
  case '/':
  case '/pair':
    subscription = subscribeToCurrencyPair;
    break;
 // case '/trade':
  //  subscription = subscribeToTradeTable;
   // break;
  }

  const sub = subscription();
  //ws is coming from KrakenPrepareSocket
  ws.send(sub);*/
}


