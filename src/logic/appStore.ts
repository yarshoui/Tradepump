import { debounce } from 'lodash';
import { action, computed, decorate, observable, reaction } from 'mobx';
import { subscribeToKrakenCurrencyPair, setKrakenDataHandler, getKrakenSocket } from 'src/logic/krakenSocket';

interface KrakenData {
    as: any[];
    bs: any[];
};

export class AppStore {
    currentKrakenPair: string = 'BTC/USD';
    orderQuantity: number = 1;

    krakenData: KrakenData = {
        as: [],
        bs: [],
    };

    get askBidTable() {
        const asks = this.krakenData.as.filter(v => {
            return parseFloat(v[1]) >= this.orderQuantity;
        }).slice(0, 30);

        const bids = this.krakenData.bs.filter(v => {
            return parseFloat(v[1]) >= this.orderQuantity;
        }).slice(0, 30);

        return {
            asks,
            bids,
        };
    }

    constructor() {
        reaction(
            () => this.currentKrakenPair,
            (pair) => {
                console.log('pairChanged', pair);
                subscribeToKrakenCurrencyPair(pair);
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

    setCurrentKrakenPair = (input: string) => {
        this.currentKrakenPair = input;
    }

    setKrakenData = (msg: any) => {
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
        this.krakenData.as = newData[1].as;
        this.krakenData.bs = newData[1].bs;
    };

    resetData = () => {
        this.krakenData.as = [];
        this.krakenData.bs = [];
    };
}

decorate(
    AppStore, {
        currentKrakenPair: observable,
        krakenData: observable,
        orderQuantity: observable,
        resetData: action,
        setKrakenData: action,
        askBidTable: computed,
    }
)

const appStore = new AppStore();
setKrakenDataHandler(appStore.setKrakenData);
getKrakenSocket();

export { appStore };
