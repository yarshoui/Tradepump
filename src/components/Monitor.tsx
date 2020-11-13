import { map } from 'lodash';
import React from 'react';
import { observer } from 'mobx-react';
import './../../src/css/index.css';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
import { Header } from './Header';
import { OrderMonitorMenu } from './OrderMonitorMenu';
import { TopLogoPanel } from './TopLogoPanel';
import { AppStore } from 'src/logic/appStore';
import { AppStoreBitfinex } from 'src/logic/appStoreBitfinex';
import { AppStoreBinance } from 'src/logic/appStoreBinance';
import { AppStoreBitstamp } from 'src/logic/appStoreBitstamp';
import { AppStoreBittrex } from 'src/logic/appStoreBittrex';

import { subscribeToBitfinexCurrencyPair } from 'src/logic/bitfinexRest';
import { PAIRS } from './../components/OrderMonitorMenu';
import { BitfinexOrdersTable } from './BitfinexOrdersTable';
import { KrakenOrdersTable } from 'src/components/KrakenOrdersTable';
import { BinanceOrdersTable } from 'src/components/BinanceOrdersTable';
import { BitstampOrdersTable } from 'src/components/BitstampOrdersTable';
import { BittrexOrdersTable } from './BittrexOrdersTable';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

interface MonitorProps {
  store: AppStore;
  storeBitfinex: AppStoreBitfinex;
  storeBinance: AppStoreBinance;
  storeBittrex: AppStoreBittrex;
  storeBitstamp: AppStoreBitstamp;
}

export const Monitor = observer(({ store, storeBitfinex, storeBinance, storeBittrex, storeBitstamp }: MonitorProps): JSX.Element => {
  const classes = useStyles();

  return (
  
    <div className={classes.root}>
      <TopLogoPanel />
      <Header />
      <OrderMonitorMenu storeKraken={store} storeBitfinex={storeBitfinex} storeBinance={storeBinance} storeBittrex={storeBittrex} storeBitstamp={storeBitstamp} />
      {/*<KrakenOrdersTable store={store} />*/}
      <div>
      <Grid container justify="flex-start" spacing={1}>
      <Grid item xs={3}>
      <KrakenOrdersTable store={store} />
      </Grid>
      <Grid item xs={3}>
      <BitfinexOrdersTable storeBitfinex={storeBitfinex} />
      </Grid>
      <Grid item xs={3}>
      <BinanceOrdersTable storeBinance={storeBinance} />
      </Grid>
      {/*<BittrexOrdersTable storeBittrex={storeBittrex} />*/}
      <Grid item xs={3}>
      <BitstampOrdersTable storeBitstamp={storeBitstamp} />
      </Grid>
      </Grid>
      </div>

    </div>
  );
});



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
