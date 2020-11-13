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
import { AppStoreBitstamp } from 'src/logic/appStoreBitstamp';

const ccyPriceToPrecise:any = {
  'btcusd': 0,
  'BTC/USDT': 0,
  'BTC/EUR': 0,
  'ETH/USD': 2,
  'ETH/EUR': 2,
  'XRP/USD': 5,
  'XRP/EUR': 5,
}
const ccyQtyToPrecise:any = {
  'btcusd': 2,
  'BTC/USDT': 2,
  'BTC/EUR': 2,
  'ETH/USD': 2,
  'ETH/EUR': 2,
  'XRP/USD': 5,
  'XRP/EUR': 5,
}
interface MonitorProps {
  storeBitstamp: AppStoreBitstamp;
}
export const BitstampOrdersTable = observer(({ storeBitstamp }: MonitorProps): JSX.Element => {


const { asks, bids } = storeBitstamp.askBidTable;

const currentCcyPair = storeBitstamp.currentBitstampPair;
const formatPrice = (prc:any) => {
  return prc.slice(0, prc.indexOf('.') + ccyPriceToPrecise[currentCcyPair] || 5);
}
const formatQty = (qty:any) => {
 return qty.slice(0, qty.indexOf('.') + ccyQtyToPrecise[currentCcyPair] || 5);
}

  return (
    <table style={{display : 'inline-block'}}>
      <caption>Bitstamp</caption>
          <thead>
             <tr style={{ border: 'black solid 2px;' }}> 
               {/*} <th>Bitstamp</th>*/}
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
                            <TableRow key={ask[0]}>
                              <TableCell component="th" scope="row">
                                {formatPrice(ask[0])}
                              </TableCell>
                              <TableCell align="right">{formatQty(ask[1])}</TableCell>
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
                                  {formatPrice(bid[0])}
                                </TableCell>
                                <TableCell align="right">{formatQty(bid[1])}</TableCell>
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
