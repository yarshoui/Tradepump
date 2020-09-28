 import { debounce } from 'lodash';
 import { action, computed, decorate, observable, reaction } from 'mobx';
 import { subscribeToBitfinexCurrencyPair, setBitfinexDataHandler, getBitfinexSocket } from 'src/logic/bitfinexSocket';

 interface BitfinexData {
     as: any[];
     bs: any[];
 };

 export class AppStoreBitfinex {
     currentBitfinexPair: string = 'tBTCUSD';
     orderQuantity: number = 1;

     bitfinexData: BitfinexData = {
         as: [],
         bs: [],
     };

//     get askBidTable() {
//         const asks = this.krakenData.as.filter(v => {
//             return parseFloat(v[1]) >= this.orderQuantity;
//         }).slice(0, 30);

//         const bids = this.krakenData.bs.filter(v => {
//             return parseFloat(v[1]) >= this.orderQuantity;
//         }).slice(0, 30);

//         return {
//             asks,
//             bids,
//         };
//     }

     constructor() {
         reaction(
             () => this.currentBitfinexPair,
             (pair) => {
                 console.log('pairChanged', pair);
                 subscribeToBitfinexCurrencyPair(pair);
             },
             {
                 fireImmediately: true,
             }
         );
     }

    setOrderQuantity = debounce((input: string) => {
        const quantity = parseFloat(input);
        console.log('setOrderQuantity', quantity);
        if (isNaN(quantity)) {
            console.warn('Wrong number', input);
            this.orderQuantity = 1;
            return;
        }

        this.orderQuantity = quantity;
        console.log('here', this.orderQuantity)
    }, 1000)

     setCurrentBitfinexPair = (input: string) => {
         this.currentBitfinexPair = input;
     }

     setBitfinexData = (msg: any) => {
         const newData = JSON.parse(msg.data);

         if (newData.channelID || newData.connectionID || !Array.isArray(newData) || newData.length < 2 || !newData[1]) {
             return;
         }

        // bid update
        if (newData[1].b) {
            // if bid is 0 - find and remove from initial data
            // this.krakenData.bs = [ ...this.krakenData.bs, ...newData[1].b ];
            return;
        }

        // ask update
        if (newData[1].a) {
            // if ask is 0 - find and remove from initial data
            // this.krakenData.as = [ ...this.krakenData.as, ...newData[1].a ];
            return;
        }

        // something which is not valid for us
        if (!newData[1].as || !newData[1].bs) {
            return;
        }

        this.resetData();

        console.count('onmessage');
        console.log(newData[1]);
        // update initial ask/bid array(1000 elements)
        this.bitfinexData.as = newData[1].as;
        this.bitfinexData.bs = newData[1].bs;
    };

    resetData = () => {
        this.bitfinexData.as = [];
        this.bitfinexData.bs = [];
    };
}

 decorate(
     AppStoreBitfinex, {
         currentBitfinexPair: observable,
         bitfinexData: observable,
         orderQuantity: observable,
          resetData: action,
          setBitfinexData: action,
        //  askBidTable: computed,
     }
 )

 const appStoreBitfinex = new AppStoreBitfinex();
 setBitfinexDataHandler(appStoreBitfinex.setBitfinexData);
 getBitfinexSocket();

 export { appStoreBitfinex };
