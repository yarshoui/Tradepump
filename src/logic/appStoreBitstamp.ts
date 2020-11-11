
 import { debounce } from 'lodash';
 import { action, computed, decorate, observable, reaction } from 'mobx';
 import { subscribeToBitstampCurrencyPair, setBitstampDataHandler, /*getBitstampSocket*/ } from 'src/logic/bitstampRest';
//import { getBitstampOrdersData } from 'src/logic/bitstampRest';
 import { bitstampOrdersDataArr } from 'src/logic/bitstampRest'; 
//console.log ('bit1', bitstampOrdersDataArr);
 interface bitstampOrdersDataArr {
    // lastUpdateId: any;
     asks: any[];
     bids: any[];
 };

 export class AppStoreBitstamp {
     currentBitstampPair: string = 'btcusd';
     orderQuantity: number = 1;

     bitstampData: bitstampOrdersDataArr = {
         asks: [],
         bids: [],
     };

    get askBidTable() {
        //console.table('@@@ get', this.bitstampData.asks);

        const asks = this.bitstampData.asks.filter(v => {
            // console.log('@@@ get ask bitstamp', parseFloat(v[1]));
            return parseFloat(v[1]) >= this.orderQuantity;
        }).slice(0, 30);
        // console.log('@@@ asks bitstamp', asks);
        const bids = this.bitstampData.bids.filter(v => {
            return parseFloat(v[1]) >= this.orderQuantity;
        }).slice(0, 30);
        return {
            asks,
            bids,
        };
    }

     constructor() {
         reaction(
             () => this.currentBitstampPair,
             (pair) => {
                 console.log('pairChanged', pair);
                 subscribeToBitstampCurrencyPair(pair);
             },
             {
                 fireImmediately: true,
             }
         );
     }

    setOrderQuantity = debounce((input: string) => {//Need to rename setOrderQuantity for Bitstamp
        const quantity = parseFloat(input);
        console.log('setOrderQuantity Bitstamp', quantity);
        if (isNaN(quantity)) {
            console.warn('Wrong number', input);
            this.orderQuantity = 1;
            return;
        }

        this.orderQuantity = quantity;
        console.log('here', this.orderQuantity)
    }, 1000)

     setCurrentBitstampPair = (input: string) => {
         this.currentBitstampPair = input;
     }

     setBitstampData = (msg: any) => {
         const newData = msg;
        
        //  if (newData.channelID || newData.connectionID || !Array.isArray(newData) || newData.length < 2 || !newData[1]) {
             
        //      return;
        //  }

       

        this.resetData();

        console.count('onmessage');
        console.log(newData[1]);
        this.bitstampData.asks = newData.asks;
        this.bitstampData.bids = newData.bids;
    };

    resetData = () => {
        this.bitstampData.asks = [];
        this.bitstampData.bids = [];
    };
}

 decorate(
     AppStoreBitstamp, {
         currentBitstampPair: observable,
         bitstampData: observable,
         orderQuantity: observable,
         resetData: action,
         setBitstampData: action,
         askBidTable: computed,
     }
 )

 const appStoreBitstamp = new AppStoreBitstamp();

 setBitstampDataHandler(appStoreBitstamp.setBitstampData);

 export { appStoreBitstamp };