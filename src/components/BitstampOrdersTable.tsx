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
import { AppStoreBitstamp } from 'src/logic/appStoreBitstamp';
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
  'XRP/USD': 5,
  'XRP/EUR': 5,
};
const ccyQtyToPrecise: any = {
  'BTC/USD': 2,
  'BTC/USDT': 2,
  'BTC/EUR': 2,
  'ETH/USD': 2,
  'ETH/EUR': 2,
  'XRP/USD': 5,
  'XRP/EUR': 5,
};
interface MonitorProps {
  storeBitstamp: AppStoreBitstamp;
}
export const BitstampOrdersTable = observer(
  ({ storeBitstamp }: MonitorProps): JSX.Element => {
    const { asks, bids } = storeBitstamp.askBidTable;
    //const lastTradePrc = storeBitstamp.lastTradePrice;
    const classes = useStyles();
    const currentCcyPair = storeBitstamp.currentBitstampPair;

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
        <caption className={classes.caption}>Bitstamp {/*lastTradePrc*/}</caption>
        <thead>
          <tr style={{ border: 'black solid 2px;' }}>{/*} <th>Bitstamp</th>*/}</tr>
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
                  {asks.length ? (
                      asks.map((ask) => (
                        <TableRow key={ask[0]}>
                          <TableCell component="th" scope="row">
                            {formatPrice(ask[0])}
                          </TableCell>
                          <TableCell align="right">{formatQty(ask[1])}</TableCell>
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
                  {bids.length ? (
                      bids.map((bid) => (
                        <TableRow key={bid[0]}>
                          <TableCell component="th" scope="row">
                            {formatPrice(bid[0])}
                          </TableCell>
                          <TableCell align="right">{formatQty(bid[1])}</TableCell>
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
