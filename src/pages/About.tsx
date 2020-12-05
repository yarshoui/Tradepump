import React from 'react';
import './../../src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { RadioButtonCheckedTwoTone } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    minWidth: '1600px',
    overflowX: 'auto',
    fontFamily: 'sans-serif',
    letterSpacing: 0,
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 400,
    marginLeft: '10px',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  contentHolder: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  tableHolder: {
    flexGrow: 1,
  },
  asideHolder: {
    width: '180px',
    paddingLeft: '20px',
  },
  topHolder: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  logoHolder: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  asideTopHolder: {
    paddingLeft: '20px',
  },
}));

export const About = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      
        <h2>About TradePump.com</h2>
        <p>
          <em>Last Updated: December 4, 2020</em>
        </p>

        <p><a href="http://tradepump.com">TradePump</a> is an Indispensable assistant in cryptocurrency trading. 
        Our service is to aggregate and provide Order Books and Trades History from the bigest cryptocurrency exchanges:</p>
        <ul>
          <li><a href="https://kraken.com">KRAKEN</a></li>
          <li><a href="https://bitfinex.com">BITFINEX</a></li>
          <li><a href="https://binance.com">BINANCE</a></li>
          <li><a href="https://bitstamp.net">BITSTAMP</a></li>
          </ul>
        <p>The information provided by our servise is inaccessible to other traders and gives practical benefits to our Users.</p>
        <p>
          By using our servise User gets an important information about large blocks and trades which exchanges do not show.
        </p>

      
    </div>
  );
};
