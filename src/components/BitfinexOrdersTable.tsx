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
// import { AppStore } from 'src/logic/appStore';
import { AppStoreBitfinex } from 'src/logic/appStoreBitfinex';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    
    fontSize: 14,
  },
  head: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: '2px',
  },
});

const ccyPriceToPrecise: any = {
  'BTC/USD': 0,
  'BTC/USDT': 0,
  'BTC/EUR': 0,
  'ETH/USD': 2,
  'ETH/EUR': 2,
  'ETH/USDT': 2,
  'XRP/USD': 5,
  'XRP/USDT': 5,
  'XRP/BTC': 9,
  'XRP/ETH': 9,
  'XRP/EUR': 5,
  'ADA/USD': 5,
  'ADA/USDT': 5,
  'ADA/BTC': 8,
  'ADA/ETH': 8,
  'ADA/EUR': 5,
  'BCH/USD': 2,
  'BCH/USDT': 2,
  'BCH/BTC': 8,
  'BCH/ETH': 8,
  'BCH/EUR': 2,
  'LTC/USD': 2,
  'LTC/USDT': 2,
  'LTC/BTC': 8,
  'LTC/ETH': 8,
  'LTC/EUR': 2,
  'EOS/USD': 2,
  'EOS/USDT': 2,
  'EOS/BTC': 8,
  'EOS/ETH': 8,
  'EOS/EUR': 2,
  'DASH/BTC': 8,
  'DASH/USD': 2,
  'DASH/EUR': 2,
  'XLM/USD': 5,
  'XLM/USDT': 5,
  'XLM/BTC': 8,
  'XLM/ETH': 8,
  'XLM/EUR': 5,
  'LINK/USD': 2,
  'LINK/USDT': 2,
  'LINK/BTC': 8,
  'LINK/ETH': 8,
  'LINK/EUR': 2,
};
const ccyQtyToPrecise: any = {
  'BTC/USD': 2,
  'BTC/USDT': 2,
  'BTC/EUR': 2,
  'ETH/USD': 3,
  'ETH/EUR': 3,
  'ETH/USDT': 3,
  'XRP/USD': 0,
  'XRP/USDT': 0,
  'XRP/EUR': 0,
  'XRP/BTC': 0,
  'XRP/ETH': 0,
  'ADA/USD': 0,
  'ADA/USDT': 0,
  'ADA/EUR': 0,
  'ADA/BTC': 0,
  'ADA/ETH': 0,
  'BCH/USD': 2,
  'BCH/USDT': 2,
  'BCH/BTC': 2,
  'BCH/ETH': 2,
  'BCH/EUR': 2,
  'LTC/USD': 2,
  'LTC/USDT': 2,
  'LTC/BTC': 2,
  'LTC/ETH': 2,
  'LTC/EUR': 2,
  'EOS/USD': 0,
  'EOS/USDT': 0,
  'EOS/BTC': 0,
  'EOS/ETH': 0,
  'EOS/EUR': 0,
  'DASH/BTC': 2,
  'DASH/USD': 2,
  'DASH/EUR': 2,
  'XLM/USD': 0,
  'XLM/USDT': 0,
  'XLM/EUR': 0,
  'XLM/BTC': 0,
  'XLM/ETH': 0,
  'LINK/USD': 0,
  'LINK/USDT': 0,
  'LINK/BTC': 0,
  'LINK/ETH': 0,
  'LINK/EUR': 0,
};
interface MonitorProps {
  storeBitfinex: AppStoreBitfinex;
}
export const BitfinexOrdersTable = observer(
  ({ storeBitfinex }: MonitorProps): JSX.Element => {
    // //console.log('@@@', storeBitfinex);
    const { asks, bids } = storeBitfinex.askBidTable;
    const currentCcyPair = storeBitfinex.currentBitfinexPair;
    const classes = useStyles();

    const formatPrice = (prc: any) => {
      if (prc.indexOf('.') > -1) {
        return prc.slice(0, prc.indexOf('.') + ccyPriceToPrecise[currentCcyPair] || 5);
      }
      return prc;
    };

    const formatQty = (qty: any) => {
      if (qty.indexOf('.') > -1) {
        return qty.slice(0, qty.indexOf('.') + ccyQtyToPrecise[currentCcyPair] || 5);
      }
      return qty;
    };

    return (
      <table style={{ display: 'inline-block' }}>
        <caption className={classes.caption}>Bitfinex</caption>
        <thead>
          <tr style={{ border: 'black solid 2px' }}>{/*<th>Bitfinex</th>*/}</tr>
        </thead>
        <tbody>
          <tr>
            <td align="center"></td>
            <td className="inline" style={{ border: 'black solid 1px' }}>
              <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ask Price</TableCell>
                      <TableCell align="right">Volume (Qty)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {asks.length ? (
                      asks.map((ask) => (
                        <TableRow key={ask['price']}>
                          <TableCell component="th" scope="row">
                            {formatPrice(ask['price'])}
                          </TableCell>
                          <TableCell align="right">{formatQty(ask['amount'])}</TableCell>
                        </TableRow>
                      ))
                    ) : ''}
                    {!asks.length && (
                      <TableRow key={'no-data'}>
                        <TableCell component="th" scope="row" colSpan={2} align="center">
                          No orders
                        </TableCell>
                      </TableRow>
                    )}
                    </TableBody>
                </Table>
              </TableContainer>
            </td>
            <td className="inline" style={{ border: 'black solid 1px' }}>
              <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Bid Price</TableCell>
                      <TableCell align="right">Volume (Qty)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {bids.length ? (
                      bids.map((bid) => (
                        <TableRow key={bid['price']}>
                          <TableCell component="th" scope="row">
                            {formatPrice(bid['price'])}
                          </TableCell>
                          <TableCell align="right">{formatQty(bid['amount'])}</TableCell>
                        </TableRow>
                      ))
                    ) : ''}
                    {!bids.length && (
                      <TableRow key={'no-data'}>
                        <TableCell component="th" scope="row" colSpan={2} align="center">
                          No orders
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
);
