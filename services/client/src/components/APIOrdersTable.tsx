import React from 'react';
import { observer } from 'mobx-react';
import 'src/css/index.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { AppStoreAPI } from 'src/logic/appStoreAPI';
import { capitalize, formatPrice, formatQty } from 'src/utils/common-utils';
import { BookModel, MarketType } from '@tradepump/types';

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
  base: {
    backgroundColor: '#FFFFFF',
  },
  highlight: {
    backgroundColor: '#AECCD7',
  },
});

interface MonitorProps {
  store: AppStoreAPI;
  market: MarketType;
}

function getBooksFromStoreByMarket(store: AppStoreAPI, market: MarketType): {asks: BookModel[], bids: BookModel[]} {
  switch (market) {
    case MarketType.kraken:
      return store.askBidTableKraken;
    case MarketType.bitfinex:
      return store.askBidTableBitfinex;
    case MarketType.binance:
      return store.askBidTableBinance;
    case MarketType.bitstamp:
      return store.askBidTableBitstamp;
    default:
      throw new Error(`Unknown market type: '${market}'`);
  }
}

export const APIOrdersTable = observer(
  ({ store, market }: MonitorProps): JSX.Element => {
    const { asks, bids } = getBooksFromStoreByMarket(store, market);
    const currentCcyPair = store.currentPair;
    const classes = useStyles();

    return (
      <table style={{ display: 'inline-block' }}>
        <caption className={classes.caption}>{capitalize(market)} {store.captionText}</caption>
        <tbody>
          <tr>
            <td align="center"></td>
            <td className="inline">
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ask Price</TableCell>
                      <TableCell align="right">Volume (Qty)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className={classes.table}>
                    {asks.length ? (
                      asks.map((ask) => {
                        const rowClassName = store.shouldHighlight(ask)
                          ? classes.highlight
                          : classes.base;
                        return (
                          <TableRow key={ask.time} className={rowClassName}>
                            <TableCell component="th" scope="row">
                              {formatPrice(currentCcyPair, ask.price)}
                            </TableCell>
                            <TableCell align="right">{formatQty(currentCcyPair, ask.volume)}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
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
            <td className="inline">
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Bid Price</TableCell>
                      <TableCell align="right">Volume (Qty)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bids.length ? (
                      bids.map((bid) => {
                        const rowClassName = store.shouldHighlight(bid)
                          ? classes.highlight
                          : classes.base;
                        return (
                          <TableRow key={bid.time} className={rowClassName}>
                            <TableCell component="th" scope="row">
                              {formatPrice(currentCcyPair, bid.price)}
                            </TableCell>
                            <TableCell align="right">{formatQty(currentCcyPair, bid.volume)}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
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
