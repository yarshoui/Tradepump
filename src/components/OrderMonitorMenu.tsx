import * as React from 'react';
import './../../src/css/index.css'
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';

export const OrderMonitorMenu = () => {
  return (
    <div className="top-menu"> <span>Trading Pair</span>
      <select name="pair" id='pairfilter'>
        <optgroup label="Bitcoin">
          <option value="BTC/EUR">BTC/EUR</option>
          <option value="BTC/USD">BTC/USD</option>
          <option value="BTC/USDT">BTC/USDT</option>
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
      <span>Min Order Qty</span>
      <input id='qtyfilter' value="1"></input>

    </div>
  );
};

