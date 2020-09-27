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
// import { Clock } from './logic/Clock';
//import { startTime } from './logic/Clock';

// type MonitorState = {
//   monitor: any;
//   data: any;
//   currentMonitor: boolean;
//   showAll: any[];
// }
interface MonitorProps {
  store: AppStore;
}

export const Monitor = observer(({ store }: MonitorProps): JSX.Element => {

  // constructor() {
  //   this.change = this.change.bind(this);
  // }
   
  // The tick function sets the current state. TypeScript will let us know
  // which ones we are allowed to set.
  // change = () => {
  //   this.setState({
  //     currentMonitor: !this.state.currentMonitor,
  //     monitor: <div> my monitor </div>,
  //     showAll: [ ]
  //   });
  // }

  // Before the component mounts, we initialise our state
  // componentWillMount() {
  //   // subscribe socket
  //   // KrakenPrepareSocket();

  //   this.setState({
  //     currentMonitor: true,
  //     monitor: <div> some monitor </div>,
  //     // showAll: () => [ <OrderMonitorMenu />, <OrderMonitorMenu />, <OrderMonitorMenu /> ]
  //     showAll: [ <OrderMonitorMenu />, <OrderMonitorMenu />, <OrderMonitorMenu /> ]
  //   });
  // }

  // After the component did mount, we set the state each second.
  // componentDidMount() {
    
  // }

  // render will know everything!

  console.log(store);

  const { asks, bids } = store.askBidTable;

  return (
  
    <div>
      <TopLogoPanel />
      <Header />
      <OrderMonitorMenu store={store} />

      <table>
          <tbody>
              <tr>
                  <td align="center"></td>
                  <td className="inline" style={{ border: 'black solid 1px;' }}>
                    <TableContainer component={Paper}>
                      <Table size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Ask Price</TableCell>
                            <TableCell align="right">Volume (Qty)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {asks.map((ask) => (
                            <TableRow key={ask[0]}>
                              <TableCell component="th" scope="row">
                                {ask[0]}
                              </TableCell>
                              <TableCell align="right">{ask[1]}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </td>
                  <td className="inline" style={{ border: 'black solid 1px;' }}>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Bid Price</TableCell>
                              <TableCell align="right">Volume (Qty)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {bids.map((bid) => (
                              <TableRow key={bid[0]}>
                                <TableCell component="th" scope="row">
                                  {bid[0]}
                                </TableCell>
                                <TableCell align="right">{bid[1]}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                  </td>
              </tr>
          </tbody>
      </table>

      {/* {this.state.currentMonitor ? <div> order monitor </div> : <div> trade monitor </div> }

      {this.state.monitor}

      {this.state.showAll} */}

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
