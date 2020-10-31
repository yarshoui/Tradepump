
 import { debounce } from 'lodash';
 import { action, computed, decorate, observable, reaction } from 'mobx';
 import { subscribeToBitfinexCurrencyPair, setBitfinexDataHandler, /*getBitfinexSocket*/ } from 'src/logic/bitfinexRest';
//import { getBitfinexOrdersData } from 'src/logic/bitfinexRest';
 import { bitfinexOrdersDataArr } from 'src/logic/bitfinexRest'; //эррэй мы 
//console.log ('bit1', bitfinexOrdersDataArr);
 interface bitfinexOrdersDataArr {
     asks: any[];
     bids: any[];
 };

 export class AppStoreBitfinex {
     currentBitfinexPair: string = 'btcusd';
     orderQuantity: number = 1;

     bitfinexData: bitfinexOrdersDataArr = {//BitfinexData
         asks: [],
         bids: [],
     };

    get askBidTable() {
        // console.table('@@@ get', this.bitfinexData.asks);

        const asks = this.bitfinexData.asks.filter(v => {
            console.log('@@@ get ask', v, parseFloat(v[1]));
            return parseFloat(v[1]) >= this.orderQuantity;
        }).slice(0, 30);

        const bids = this.bitfinexData.bids.filter(v => {
            return parseFloat(v[1]) >= this.orderQuantity;
        }).slice(0, 30);

        return {
            asks,
            bids,
        };
    }

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
         const newData = msg;//JSON.parse(msg.data);
         console.log('msg',msg); //тут newData пустой
         console.log('msg2',newData);
         console.log('@@@ app store',newData);

        //  if (newData.channelID || newData.connectionID || !Array.isArray(newData) || newData.length < 2 || !newData[1]) {
             
        //      return;
        //  }

       

        this.resetData();

        console.count('onmessage');
        console.log(newData[1]);
        // update initial ask/bid array(1000 elements)
        this.bitfinexData.asks = newData.asks;
        this.bitfinexData.bids = newData.bids;
    };

    resetData = () => {
        this.bitfinexData.asks = [];
        this.bitfinexData.bids = [];
    };
}

 decorate(
     AppStoreBitfinex, {
         currentBitfinexPair: observable,
         bitfinexData: observable,
         orderQuantity: observable,
         resetData: action,
         setBitfinexData: action,
         askBidTable: computed,
     }
 )

 const appStoreBitfinex = new AppStoreBitfinex();

 setBitfinexDataHandler(appStoreBitfinex.setBitfinexData);
 //getBitfinexSocket();
 
 let someData = bitfinexOrdersDataArr;

 console.log('Some data: ', someData);

 export { appStoreBitfinex };