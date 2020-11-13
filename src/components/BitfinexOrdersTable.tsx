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


const ccyPriceToPrecise:any = {
  'btcusd': 7,
  'BTC/USDT': 5,
  'BTC/EUR': 5,
  'ETH/USD': 2,
  'ETH/EUR': 2,
  'XRP/USD': 5,
  'XRP/EUR': 5,
}
const ccyQtyToPrecise:any = {
  'btcusd': 3,
  'BTC/USDT': 2,
  'BTC/EUR': 2,
  'ETH/USD': 2,
  'ETH/EUR': 2,
  'XRP/USD': 5,
  'XRP/EUR': 5,
}
interface MonitorProps {
  storeBitfinex: AppStoreBitfinex;
}
export const BitfinexOrdersTable = observer(({ storeBitfinex }: MonitorProps): JSX.Element => {
// //console.log('@@@', storeBitfinex);
const { asks, bids } = storeBitfinex.askBidTable; 
const currentCcyPair = storeBitfinex.currentBitfinexPair;

const formatPrice = (prc:any) => {
  return prc.slice(0, prc.indexOf('.') + ccyPriceToPrecise[currentCcyPair] || 5);
}

const formatQty = (qty:any) => {
 return qty.slice(0, qty.indexOf('.') + ccyQtyToPrecise[currentCcyPair] || 5);
}

  return (
    <table style={{display : 'inline-block'}}>
      <caption>Bitfinex</caption>
          <thead>
             <tr style={{ border: 'black solid 2px;' }}> 
                {/*<th>Bitfinex</th>*/}
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
                          {asks.map((ask) => (
                            <TableRow key={ask['price']}>
                              <TableCell component="th" scope="row">
                                {formatPrice(ask['price'])}
                              </TableCell>
                              <TableCell align="right">{formatQty(ask['amount'])}</TableCell>
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
                              <TableRow key={bid['price']}>
                                <TableCell component="th" scope="row">
                                  {formatPrice(bid['price'])}
                                </TableCell>
                                <TableCell align="right">{formatQty(bid['amount'])}</TableCell>
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
