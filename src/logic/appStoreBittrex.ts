export class AppStoreBittrex {}
// import { debounce } from 'lodash';
// import { action, computed, decorate, observable, reaction } from 'mobx';
// import {
//   subscribeToBittrexCurrencyPair,
//   setBittrexDataHandler,
//   getBittrexSocket,
// } from 'src/logic/bittrexSocket';

// interface BittrexData {
//   as: any[];
//   bs: any[];
// }

// export class AppStoreBittrex {
//   currentBittrexPair: string = 'BTC/USD';
//   orderQuantity: number = 1;

//   bittrexData: BittrexData = {
//     as: [],
//     bs: [],
//   };

//   get askBidTable() {
//     const asks = this.bittrexData.as
//       .filter((v) => {
//         return parseFloat(v[1]) >= this.orderQuantity;
//       })
//       .slice(0, 30);

//     const bids = this.bittrexData.bs
//       .filter((v) => {
//         return parseFloat(v[1]) >= this.orderQuantity;
//       })
//       .slice(0, 30);

//     return {
//       asks,
//       bids,
//     };
//   }

//   constructor() {
//     reaction(
//       () => this.currentBittrexPair,
//       (pair) => {
//         console.log('pairChanged', pair);
//         // subscribeToBittrexCurrencyPair(pair);
//       },
//       {
//         fireImmediately: true,
//       },
//     );
//   }

//   setOrderQuantity = debounce((input: string) => {
//     const quantity = parseFloat(input);
//     console.log('setOrderQuantity', quantity);
//     if (isNaN(quantity)) {
//       console.warn('Wrong number', input);
//       this.orderQuantity = 1;
//       return;
//     }

//     this.orderQuantity = quantity;
//     // console.log('here', this.orderQuantity)
//   }, 1000);

//   setCurrentBittrexPair = (input: string) => {
//     this.currentBittrexPair = input;
//   };

//   setBittrexData = (msg: any) => {
//     const newData = JSON.parse(msg.data);

//     if (
//       newData.channelID ||
//       newData.connectionID ||
//       !Array.isArray(newData) ||
//       newData.length < 2 ||
//       !newData[1]
//     ) {
//       return;
//     }

//     // bid update
//     if (newData[1].b) {
//       // if bid is 0 - find and remove from initial data
//       // this.bittrexData.bs = [ ...this.bittrexData.bs, ...newData[1].b ];
//       return;
//     }

//     // ask update
//     if (newData[1].a) {
//       // if ask is 0 - find and remove from initial data
//       // this.bittrexData.as = [ ...this.bittrexData.as, ...newData[1].a ];
//       return;
//     }

//     // something which is not valid for us
//     if (!newData[1].as || !newData[1].bs) {
//       return;
//     }

//     this.resetData();

//     console.count('onmessage');
//     console.log(newData[1]);
//     // update initial ask/bid array(1000 elements)
//     this.bittrexData.as = newData[1].as;
//     this.bittrexData.bs = newData[1].bs;
//   };

//   resetData = () => {
//     this.bittrexData.as = [];
//     this.bittrexData.bs = [];
//   };
// }

// decorate(AppStoreBittrex, {
//   currentBittrexPair: observable,
//   bittrexData: observable,
//   orderQuantity: observable,
//   resetData: action,
//   setBittrexData: action,
//   askBidTable: computed,
// });

// const appStoreBittrex = new AppStoreBittrex();
// setBittrexDataHandler(appStoreBittrex.setBittrexData);
// getBittrexSocket();

// export { appStoreBittrex };
