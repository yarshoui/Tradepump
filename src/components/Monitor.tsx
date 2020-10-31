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
import Paper from '@material-ui/core/Paper';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
import { Header } from './Header';
import { OrderMonitorMenu } from './OrderMonitorMenu';
import { TopLogoPanel } from './TopLogoPanel';
import { AppStore } from 'src/logic/appStore';
import { AppStoreBitfinex } from 'src/logic/appStoreBitfinex';
import { KrakenOrdersTable } from 'src/components/KrakenOrdersTable';
import { subscribeToBitfinexCurrencyPair } from 'src/logic/bitfinexRest';
import { PAIRS } from './../components/OrderMonitorMenu';
import { BitfinexOrdersTable } from './BitfinexOrdersTable';
interface MonitorProps {
  store: AppStore;
  storeBitfinex: AppStoreBitfinex;

}

export const Monitor = observer(({ store, storeBitfinex }: MonitorProps): JSX.Element => {


  return (
  
    <div>
      <TopLogoPanel />
      <Header />
      <OrderMonitorMenu storeKraken={store} storeBitfinex={storeBitfinex} />
      {/*<KrakenOrdersTable store={store} />*/}
      <div style={{display: 'flex;'}}>
      <KrakenOrdersTable store={store} />
      <BitfinexOrdersTable storeBitfinex={storeBitfinex} />
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
