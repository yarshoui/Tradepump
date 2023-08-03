// import { map } from 'lodash';
import React from 'react';
import { observer } from 'mobx-react';
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
// import { OrderMonitorMenu } from './OrderMonitorMenu';
// import { TopLogoPanel } from './TopLogoPanel';
import { AppStore } from 'src/logic/appStore';

// import { subscribeToBitfinexCurrencyPair } from 'src/logic/bitfinexRest';
// import { PAIRS } from './../components/OrderMonitorMenu';
import { BitfinexOrdersTable } from './BitfinexOrdersTable';
import { KrakenOrdersTable } from 'src/components/KrakenOrdersTable';
import { BinanceOrdersTable } from 'src/components/BinanceOrdersTable';
import { BitstampOrdersTable } from 'src/components/BitstampOrdersTable';
// import { BittrexOrdersTable } from './BittrexOrdersTable';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { APIOrdersTable } from './APIOrdersTable';
import { MarketType } from '@tradepump/types';
// import Paper from '@material-ui/core/Paper';
// import { Footer } from './Footer';
// import { RightAd } from './RightAd';
// import { TopAd } from './TopAd';

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

export const OrdersMonitorTables = observer(
  ({ store }: MonitorProps): JSX.Element => {
    const classes = useStyles();

    return (
      <div className={classes.tableHolder}>
        <Grid container justifyContent="flex-start" spacing={1}>
          <Grid item xs={3}>
            <APIOrdersTable market={MarketType.kraken} store={store.tables.api} />
          </Grid>
          <Grid item xs={3}>
            <APIOrdersTable market={MarketType.bitfinex} store={store.tables.api} />
          </Grid>
          <Grid item xs={3}>
            <APIOrdersTable market={MarketType.binance} store={store.tables.api} />
          </Grid>
          {/*<BittrexOrdersTable storeBittrex={storeBittrex} />*/}
          <Grid item xs={3}>
            <BitstampOrdersTable storeBitstamp={store.tables.bitstamp} />
          </Grid>
        </Grid>
      </div>
    );
  },
);

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
