// import { map } from 'lodash';
import React, { useEffect } from 'react';
// import { observer } from 'mobx-react';
import './../../src/css/index.css';

// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';

// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { Header } from './Header';
import { OrderMonitorMenu } from './OrderMonitorMenu';
import { OrdersMonitorTables} from 'src/components/OrdersMonitorTables';
// import { TopLogoPanel } from './TopLogoPanel';
import { appStore, AppStore } from 'src/logic/appStore';

// import { subscribeToBitfinexCurrencyPair } from 'src/logic/bitfinexRest';
// import { PAIRS } from './../components/OrderMonitorMenu';
// import { BitfinexOrdersTable } from './BitfinexOrdersTable';
// import { KrakenOrdersTable } from 'src/components/KrakenOrdersTable';
// import { BinanceOrdersTable } from 'src/components/BinanceOrdersTable';
// import { BitstampOrdersTable } from 'src/components/BitstampOrdersTable';
// import { BittrexOrdersTable } from './BittrexOrdersTable';
// import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
// import { Footer } from './Footer';
import { RightAd } from './RightAd';
// import { TopAd } from './TopAd';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-184831310-1');

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    minWidth: '1600px',
    overflowX: 'auto',
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

interface MonitorProps {
  store: AppStore;
}

export const OrdersMonitor = () => {
    const classes = useStyles();
    useEffect( () => {
      // GoogleAnalytics
      ReactGA.pageview(window.location.pathname + window.location.search); 
  });

    return (
      <div>
        <Helmet>
          <title>Bitcoin & Cryptocurrency Free Aggregator | TradePump.com</title>
          <meta property="og:title" content="Bitcoin & Cryptocurrency Aggregator | TradePump.com" />
          <meta property="og:url" content="https://www.tradepump.com/" />
          <meta property="og:image" content="https://www.tradepump.com/android-chrome-192x192.png" />
          <meta property="og:description" content="Tradepump is not just a Bitcoin and Cryptocurrency Aggregator. Come see why our servise is the best place to know crypto exchanges orders books and trades history." />
        </Helmet>


        <OrderMonitorMenu store={appStore} />       
          <div className={classes.contentHolder}>
            <OrdersMonitorTables store={appStore} />
            <div className={classes.asideHolder}>
              <RightAd />
            </div>
          </div>
    </div>          
    );
  }


// export const OrderMonitor = (props: any, state: any) => {
//   console.log('mypops', props, state);
//   return (

//     <div>
//       <TopLogoPanel />
//       <Header />
//       <button onClick={() => { }}></button>
//       <OrderMonitorMenu />

//     </div>
//   );

// };
