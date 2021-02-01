import React, { useEffect }  from 'react';
import 'src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
// import { RadioButtonCheckedTwoTone } from '@material-ui/icons';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-184831310-1');

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

  aboutPageLinks:{
    textDecoration: 'none',
    color: 'blue',
  },
}));

export const About = () => {
  const classes = useStyles();

  useEffect( () => {
    // GoogleAnalytics
    ReactGA.pageview(window.location.pathname + window.location.search); 
  });

  return (
    <div className={classes.root}>
      <Helmet>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="./favicon.ico" />
          <meta name="theme-color" content="#000000" />
          <meta name="application-name" content="TradePump" />
          <meta name="description" content="Tradepump is not just a Bitcoin and Cryptocurrency Free Aggregator. Come see why our servise is the best place to know crypto exchanges orders books and trades history." />
          <meta name="robots" content="index,follow" />
          <meta name="googlebot" content="index,follow" />
          <meta name="google" content="notranslate" />
          <meta name="generator" content="ReactJS"></meta>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="style.css" />
          <title>Bitcoin & Cryptocurrency Free Aggregator | TradePump.com</title>
          <meta property="og:title" content="Bitcoin & Cryptocurrency Aggregator | TradePump.com" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.tradepump.com/about" />
          <meta property="og:image" content="https://www.tradepump.com/android-chrome-192x192.png" />
          <meta property="og:description" content="Tradepump is not just a Bitcoin and Cryptocurrency Aggregator. Come see why our servise is the best place to know crypto exchanges orders books and trades history." />

        </Helmet>
      
        <h2>About TradePump.com</h2>
        <p>
          <em>Last Updated: December 4, 2020</em>
        </p>
        <p>This web application will help you to become a better crypto-trader and make smart decisions on buying or selling criptocurrecncy.</p>

        <p><a href="http://tradepump.com" className={classes.aboutPageLinks}>TradePump</a> is an Indispensable assistant in cryptocurrency trading. 
        Our service allows to aggregate and provide Order Books, Trades History and other analytics data from the bigest cryptocurrency exchanges:</p>
        <ul>
          <li><a href="https://kraken.com" className={classes.aboutPageLinks}>KRAKEN</a></li>
          <li><a href="https://bitfinex.com" className={classes.aboutPageLinks}>BITFINEX</a></li>
          <li><a href="https://binance.com" className={classes.aboutPageLinks}>BINANCE</a></li>
          <li><a href="https://bitstamp.net" className={classes.aboutPageLinks}>BITSTAMP</a></li>
          </ul>
        <p>The information provided by our servise is inaccessible to other traders and gives practical benefits to our Users.</p>
        <p>We are constantly developing our servise so feel free to send your proppositions to <a href="mailto:support@tradepump.com" className={classes.aboutPageLinks}>Support</a>. Your experience is very important to us!</p>
        <p>
          By using our servise User gets an important information about large blocks and trades which exchanges do not show.

        </p>
        <h2>Getting real-time data</h2>
        <p>TradePump uses websokets and Public APIs provided by crypto exchanges to get and aggregate real-time updates on Order Books, Trades History and other data.</p>
        <h2>Orders Monitor Filters</h2>
        <p>We have just a couple of filter fields available on Orders Monitor window which allow to precise the data received trom the exchanges:</p>
        <p><strong>Min Order Qty</strong> - allows you to filter Orders Book for the exact cryptocurrency. Orders with Quantity more than mentioned in the field will remain in the table. </p>
        <p><strong>Highlight Min Order Qty</strong> - allows you to highlight orders with Quantity equal or more than mentioned in the field.</p>
        <p>If you are trading on any exchange which is mentioned above and the currency pair you are interested in is not on the Currency Pair list please write an email to <a href="mailto:support@tradepump.com" className={classes.aboutPageLinks}>Support</a>. Your experience is very important to us!</p>

      
    </div>
  );
};
