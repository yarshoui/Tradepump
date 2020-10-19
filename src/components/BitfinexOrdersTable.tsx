import React from 'react';
import { observer } from 'mobx-react';
import './../../src/css/index.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { AppStore } from 'src/logic/appStore';
import { AppStoreBitfinex } from 'src/logic/appStoreBitfinex';
import {mockData} from './logic/mockdata';
interface MonitorProps {
  storeBitfinex: AppStoreBitfinex;
}
export const BitfinexOrdersTable = observer(({ storeBitfinex }: MonitorProps): JSX.Element => {

console.log('@@@', storeBitfinex);

const { asks, bids } = storeBitfinex.askBidTable; // make storeBitfinex.askBidTable to get data
console.log('@@@', storeBitfinex.askBidTable);

  return (
    <table style={{display : 'inline-block'}}>
          <thead>
             <tr style={{ border: 'black solid 2px;' }}> 
                <th>Bitfinex</th>
            </tr>
          </thead>
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
                          {asks.map((ask, index) => (
                            <TableRow key={ask['amount'] + index}>
                              <TableCell component="th" scope="row">
                                {`${ask['amount']} ${ask['price']}`}
                              </TableCell>
                              <TableCell align="right">{ask['timestamp']}</TableCell>
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
                            {bids.map((bid, index) => (
                              <TableRow key={bid['amount'] + index}>
                                <TableCell component="th" scope="row">
                                  {`${bid['amount']} ${bid['price']}`}
                                </TableCell>
                                <TableCell align="right">{bid['timestamp']}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                  </td>
              </tr>
          </tbody>
      </table>

  );
});
