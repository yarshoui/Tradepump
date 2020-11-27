import React from 'react';
import { observer } from 'mobx-react';
import { decorate, observable } from 'mobx';
import { AppStore } from 'src/logic/appStore';
import { TradingOption } from 'src/components/TradingOption';
import { AppStoreBitfinex } from 'src/logic/appStoreBitfinex';
import { AppStoreBinance } from 'src/logic/appStoreBinance';
import { AppStoreBittrex } from 'src/logic/appStoreBittrex';
import { AppStoreBitstamp } from 'src/logic/appStoreBitstamp';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';

 export const PAIRS:any = {
   'BTC/EUR': { 
     kraken: 'BTC/EUR', 
     bitfinex: 'btceur',
     binance: 'BTCEUR',
     bittrex: 'BTC-EUR',
     bitstamp: 'btceur'
   },
   'BTC/USD':{
     kraken: 'BTC/USD',
     bitfinex: 'btcusd',
     binance: 'BTCUSDT',
     bittrex: 'BTC-USD',
     bitstamp: 'btcusd'
   }
 }

// const getSubscribePayload = (inputPair: string) => {
//   const payload = {
//     event: 'subscribe',
//     pair: [ PAIRS[inputPair].kraken, ],
//     subscription: {
//       depth: 1000,
//       name: 'book',
//     }
//   };

//   return JSON.stringify(payload);
// };

interface OrderMonitorMenuProps {
  storeKraken: AppStore;
  storeBitfinex: AppStoreBitfinex;
  storeBinance: AppStoreBinance;
  storeBitstamp: AppStoreBitstamp;
  storeBittrex: AppStoreBittrex;
}

export const OrderMonitorMenu = observer(({ storeKraken: storeK, storeBitfinex: storeB, storeBinance: storeBin, storeBittrex: storeBitt, storeBitstamp: storeBitst }: OrderMonitorMenuProps) => {
  return (
    <div className="top-menu"> <span> Trading Pair </span>
      <select
        name="pair"
        id='pairfilter'
        onChange={(event) => {
          storeK.setCurrentKrakenPair(event.target.value);
          storeB.setCurrentBitfinexPair(event.target.value);
          storeBin.setCurrentBinancePair(event.target.value);
          storeBitst.setCurrentBitstampPair(event.target.value);
          
        }}
      >
        <optgroup label="Bitcoin">
          <TradingOption value='BTC/EUR' selected={storeK.currentKrakenPair}  />
          <TradingOption value='BTC/USD' selected={storeK.currentKrakenPair} />
          <TradingOption value='BTC/USDT' selected={storeK.currentKrakenPair} />
        </optgroup>
        <optgroup label="Ethereum">
          <option value="ETH/USD">ETH/USD</option>
          <option value="ETH/EUR">ETH/EUR</option>
          <option value="ETH/USDT">ETH/USDT</option>
        </optgroup>
        <optgroup label="XRP">
          <option value="XRP/BTC">XRP/BTC</option>
          <option value="XRP/ETH">XRP/ETH</option>
          <option value="XRP/EUR">XRP/EUR</option>
          <option value="XRP/USD">XRP/USD</option>
          <option value="XRP/USDT">XRP/USDT</option>
        </optgroup>
        <optgroup label="Cardano">
          <option value="ADA/BTC">ADA/BTC</option>
          <option value="ADA/ETH">ADA/ETH</option>
          <option value="ADA/EUR">ADA/EUR</option>
          <option value="ADA/USD">ADA/USD</option>
        </optgroup>
        <optgroup label="Bitcoin Cash">
          <option value="BCH/BTC">BCH/BTC</option>
          <option value="BCH/ETH">BCH/ETH</option>
          <option value="BCH/EUR">BCH/EUR</option>
          <option value="BCH/USD">BCH/USD</option>
          <option value="BCH/USDT">BCH/USDT</option>
        </optgroup>
        <optgroup label="Litecoin">
          <option value="LTC/BTC">LTC/BTC</option>
          <option value="LTC/ETH">LTC/ETH</option>
          <option value="LTC/EUR">LTC/EUR</option>
          <option value="LTC/USD">LTC/USD</option>
          <option value="LTC/USDT">LTC/USDT</option>
        </optgroup>
        <optgroup label="EOS">
          <option value="EOS/BTC">EOS/BTC</option>
          <option value="EOS/ETH">EOS/ETH</option>
          <option value="EOS/EUR">EOS/EUR</option>
          <option value="EOS/USD">EOS/USD</option>
        </optgroup>
        <optgroup label="DASH">
          <option value="DASH/BTC">DASH/BTC</option>
          <option value="DASH/EUR">DASH/EUR</option>
          <option value="DASH/USD">DASH/USD</option>
        </optgroup>
        <optgroup label="Stellar">
          <option value="XLM/BTC">XLM/BTC</option>
          <option value="XLM/EUR">XLM/EUR</option>
          <option value="XLM/USD">XLM/USD</option>
        </optgroup>
        <optgroup label="Chainlink">
          <option value="LINK/BTC">LINK/BTC</option>
          <option value="LINK/ETH">LINK/ETH</option>
          <option value="LINK/EUR">LINK/EUR</option>
          <option value="LINK/USD">LINK/USD</option>
        </optgroup>
      </select>
      <span> Min Order Qty </span>
      <input
        type="text"
        id='qtyfilter'
        placeholder="1"
        
        // value={store.orderQuantity}
        onChange={(event) => {
          storeK.setOrderQuantity(event.target.value);
          storeB.setOrderQuantity(event.target.value);
          storeBin.setOrderQuantity(event.target.value);
          storeBitt.setOrderQuantity(event.target.value);
          storeBitst.setOrderQuantity(event.target.value);
        }}
      />

    </div>
  );
});
