import React from 'react';
import 'src/css/index.css';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: 90,
    },
  
}));

export const TopPriceBar = () => {
  const classes = useStyles();
  return (
    <div className="top-price-bar">
      <span>
        <span> BTC/USDT </span>
        <span>
          <span>105000</span>
          <span> / </span>
          <span>-3.52</span>
          <span>%</span>
          <span> | </span>
        </span>
      </span>

      <span>
        <span> BTC/USDT </span>
        <span>
          <span>105000</span>
          <span> / </span>
          <span>-3.52</span>
          <span>%</span>
          <span> | </span>
        </span>
      </span>

      <span>
        <span> ETH/USDT </span>
        <span>
          <span>3250</span>
          <span> / </span>
          <span>-5.52</span>
          <span>%</span>
          <span> | </span>
        </span>
      </span>

      <span>
        <span> SOL/USDT </span>
        <span>
          <span>256</span>
          <span> / </span>
          <span>-2.1</span>
          <span>%</span>
          <span> | </span>
        </span>
      </span>

      <span>
        <span> BTC/USDT </span>
        <span>
          <span>105000</span>
          <span> / </span>
          <span>-3.52</span>
          <span>%</span>
          <span> | </span>
        </span>
      </span>

    </div>
  );
};
