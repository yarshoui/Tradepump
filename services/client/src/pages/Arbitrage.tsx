import React, { useEffect }  from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ReactGA from 'react-ga';

import { makeStyles } from '@material-ui/core/styles';

function createData(
  pair: string,
  exchange1: string,
  side1: string,
  price1: number,
  exchange2: string,
  side2: string,
  price2: number,
  startspread: string,
  maxspread: string,
  status: string,
) {
  return { pair, exchange1, side1, price1, exchange2, side2, price2, startspread, maxspread, status };
}
import type { ArbitrageStore } from 'src/logic/arbitrageStore';
import { observer } from 'mobx-react';

const rows = [
  createData('VANA/USDT', 'Bybit Spot', 'Buy', 24, 'MEXC Futures', 'Sell', 25, '25%', '40%', 'Active'),
  createData('GRASS/USDT', 'Cucoin Spot', 'Buy', 24, 'Bybit Futures', 'Sell', 25, '10%', '15%', 'Active'),
  createData('BTC/USDT', 'Bitget Spot', 'Buy', 24, 'MEXC Futures', 'Sell', 25, '25%', '40%', 'Ended'),
  createData('MNT/USDT', 'Bybit Spot', 'Buy', 24, 'MEXC Futures', 'Sell', 25, '25%', '40%', 'Ended'),
  createData('ETH/USDT', 'Bybit Spot', 'Buy', 24, 'MEXC Futures', 'Sell', 25, '25%', '40%', 'Ended'),
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    minWidth: '1600px',
    overflowX: 'auto',
    fontFamily: 'sans-serif',
    letterSpacing: 0,
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 400,
    marginLeft: '10px',
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

type ArbitrageProps = {
  store: ArbitrageStore;
}

export const Arbitrage = observer(({ store }: ArbitrageProps) => {
  const classes = useStyles();

  console.log('~~~ Arbitrage', { store });

  useEffect( () => {
    // GoogleAnalytics
    ReactGA.pageview(window.location.pathname + window.location.search); 
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: 1000 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Pair</TableCell>
            <TableCell>Exchange</TableCell>
            <TableCell>Side</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Exchange</TableCell>
            <TableCell>Side</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Spread</TableCell>
            {/* <TableCell>Max Spread</TableCell>
            <TableCell>Status</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {store.rowData.map((row) => {
            console.log('~~~ Arbitrage', { row });
            return (
            <TableRow key={row.pair} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
              <TableCell component="th" scope="row"> {row.spot.base} </TableCell>
              <TableCell>{row.spot.exchange +' '+ row.spot.category}</TableCell>
              <TableCell>{' Buy'}</TableCell>
              <TableCell>{row.spot.bidPrice}</TableCell>
              <TableCell>{row.futures.exchange +' '+ row.futures.category}</TableCell>
              <TableCell>{' Sell'}</TableCell>
              <TableCell>{row.futures.askPrice}</TableCell>
              <TableCell>{row.spread} %</TableCell>
              {/* <TableCell>{row.maxspread}</TableCell>
              <TableCell>{row.status}</TableCell> */}

              
            </TableRow>)
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
});