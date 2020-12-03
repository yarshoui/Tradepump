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
import { Header } from './Header';
import { OrderMonitorMenu } from './OrderMonitorMenu';
import { TopLogoPanel } from './TopLogoPanel';
import { AppStore } from 'src/logic/appStore';
import { OrdersMonitor} from 'src/components/OrdersMonitor';

// import { subscribeToBitfinexCurrencyPair } from 'src/logic/bitfinexRest';
// import { PAIRS } from './../components/OrderMonitorMenu';
import { BitfinexOrdersTable } from './BitfinexOrdersTable';
import { KrakenOrdersTable } from 'src/components/KrakenOrdersTable';
import { BinanceOrdersTable } from 'src/components/BinanceOrdersTable';
import { BitstampOrdersTable } from 'src/components/BitstampOrdersTable';
// import { BittrexOrdersTable } from './BittrexOrdersTable';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import { Footer } from './Footer';
import { RightAd } from './RightAd';
import { TopAd } from './TopAd';
import { BrowserRouter, Route } from 'react-router-dom';
import { Terms } from './Terms';



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

export const Monitor = observer(
  ({
    store,
  }: MonitorProps): JSX.Element => {
    const classes = useStyles();

    return (
      <BrowserRouter>
      <div className={classes.root}>
        <div className={classes.topHolder}>
          <div className={classes.logoHolder}>
            <TopLogoPanel />
          </div>
          <div className={classes.asideTopHolder}>
            <TopAd />
          </div>
        </div>
        <Header />
        
        <OrderMonitorMenu store={store} /> {/*Need to move to Orders Monitor component*/}
        
        <div className={classes.contentHolder}>

          {/* <Route path='/orders' component={OrdersMonitor} store={store}/>
          <Route path='/terms' component={Terms} /> */}
          <OrdersMonitor store={store}/>

          <div className={classes.asideHolder}>
            <RightAd />
          </div>
        </div>
        <Footer />
      </div>
      </BrowserRouter>
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
