import React from 'react';
import { observer } from 'mobx-react';
// import { decorate, observable } from 'mobx';
import { TradingOption } from 'src/components/TradingOption';
import { SelectorOptions } from 'src/logic/pairsConfig';
import { AppStore } from 'src/logic/appStore';

// import 'src/intro/introjs.min.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';

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
  store: AppStore;
}

export const OrderMonitorMenu = observer(
  ({
    store,
  }: OrderMonitorMenuProps) => {
    return (
      <div className="top-menu">
        {' '}
        <span> Trading Pair </span>
        <select
          name="pair"
          id="pairfilter"
          title='Select a trading pair'
          onChange={(event) => {
            const value = event.target.value as SelectorOptions;
            store.setCurrencyPair(value);
          }}
        >
          <optgroup label="Bitcoin">
            <TradingOption value="BTC/USD" selected={store.currencyPair} />
            <TradingOption value="BTC/EUR" selected={store.currencyPair} />            
            <TradingOption value="BTC/USDT" selected={store.currencyPair} />
          </optgroup>
          <optgroup label="Ethereum">
            <TradingOption value="ETH/USD" selected={store.currencyPair} />
            <TradingOption value="ETH/EUR" selected={store.currencyPair} />
            <TradingOption value="ETH/USDT" selected={store.currencyPair} />        
          </optgroup>
          <optgroup label="XRP">
            <TradingOption value="XRP/BTC" selected={store.currencyPair} />
            <TradingOption value="XRP/ETH" selected={store.currencyPair} />
            <TradingOption value="XRP/USD" selected={store.currencyPair} />
            <TradingOption value="XRP/EUR" selected={store.currencyPair} />
            <TradingOption value="XRP/USDT" selected={store.currencyPair} />            
          </optgroup>
          <optgroup label="Cardano">
            <TradingOption value="ADA/BTC" selected={store.currencyPair} />
            <TradingOption value="ADA/ETH" selected={store.currencyPair} />
            <TradingOption value="ADA/USD" selected={store.currencyPair} />
            <TradingOption value="ADA/EUR" selected={store.currencyPair} />
            <TradingOption value="ADA/USDT" selected={store.currencyPair} />               
          </optgroup>
          <optgroup label="Bitcoin Cash">
            <TradingOption value="BCH/BTC" selected={store.currencyPair} />
            <TradingOption value="BCH/ETH" selected={store.currencyPair} />
            <TradingOption value="BCH/USD" selected={store.currencyPair} />
            <TradingOption value="BCH/EUR" selected={store.currencyPair} />
            <TradingOption value="BCH/USDT" selected={store.currencyPair} />             
          </optgroup>
          <optgroup label="Litecoin">
            <TradingOption value="LTC/BTC" selected={store.currencyPair} />
            <TradingOption value="LTC/ETH" selected={store.currencyPair} />
            <TradingOption value="LTC/USD" selected={store.currencyPair} />
            <TradingOption value="LTC/EUR" selected={store.currencyPair} />
            <TradingOption value="LTC/USDT" selected={store.currencyPair} />              
          </optgroup>
          <optgroup label="EOS">
            <TradingOption value="EOS/BTC" selected={store.currencyPair} />
            <TradingOption value="EOS/ETH" selected={store.currencyPair} />
            <TradingOption value="EOS/USD" selected={store.currencyPair} />
            <TradingOption value="EOS/EUR" selected={store.currencyPair} />
            <TradingOption value="EOS/USDT" selected={store.currencyPair} />            
          </optgroup>
          <optgroup label="DASH">
            <TradingOption value="DASH/BTC" selected={store.currencyPair} />
            <TradingOption value="DASH/USD" selected={store.currencyPair} />
            <TradingOption value="DASH/EUR" selected={store.currencyPair} />                        
          </optgroup>
          <optgroup label="Stellar">
            <TradingOption value="XLM/BTC" selected={store.currencyPair} />
            <TradingOption value="XLM/ETH" selected={store.currencyPair} />
            <TradingOption value="XLM/USD" selected={store.currencyPair} />
            <TradingOption value="XLM/EUR" selected={store.currencyPair} />
            <TradingOption value="XLM/USDT" selected={store.currencyPair} />          
          </optgroup>
          <optgroup label="Chainlink">
           <TradingOption value="LINK/BTC" selected={store.currencyPair} />
            <TradingOption value="LINK/ETH" selected={store.currencyPair} />
            <TradingOption value="LINK/USD" selected={store.currencyPair} />
            <TradingOption value="LINK/EUR" selected={store.currencyPair} />
            <TradingOption value="LINK/USDT" selected={store.currencyPair} />  
          </optgroup>
        </select>
        <span> Min Order Qty </span>
        <input
          type="text"
          id="qtyfilter"
          placeholder="1"
          title='Set minimum order quantity'
          // value={store.orderQuantity}
          onChange={(event) => {
            store.setOrderQuantity(event.target.value);
          }}
        />
        <span> Highlight Min Order Qty </span>
        <input
          type="text"
          id="highlightfilter"
          placeholder="1"
          title='Highlight Orders with Qty more than'
          onChange={(event) => {
            store.setOrderQuantityHighlight(event.target.value);
          }}
        />

      </div>
    );
  },
);
