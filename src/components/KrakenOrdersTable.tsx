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
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    fontSize: 14,
  },
  head: {
    fontSize: 10,
  },
});


interface MonitorProps {
  store: AppStore;
}
export const KrakenOrdersTable = observer(({ store }: MonitorProps): JSX.Element => {


const { asks/*: notFormattedAsks*/, bids/*: notFormattedBids*/ } = store.askBidTable;
const classes = useStyles();

// const  [ base, float ] = ${inputNumber}.split(',');

// const cutNumberString = [ base, float.substr(0, 2) ].join(',');

// const resultNumber = parseFloat(cutNumberString)

//const asks = notFormattedAsks.map(ask => [ask[0].slice(0, (ask[0].indexOf('.')) + 0), ask[1].slice(0, (ask[1].indexOf('.')) + 3)]);
//const bids = notFormattedBids.map(bid => [bid[0].slice(0, (bid[0].indexOf('.')) + 0), bid[1].slice(0, (bid[1].indexOf('.')) + 3)]);


  return (
    
    <table style={{display : 'inline-block'}}>
          <thead>
             <tr style={{ border: 'black solid 2px;' }}> 
                <th >Kraken</th>
            </tr>
          </thead>
          <tbody >
              <tr >
                  <td align="center"></td>
                  <td className="inline" style={{ border: 'black solid 1px;' }}>
                      <TableContainer component={Paper}>
                      <Table size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow className={classes.head}>
                            <TableCell>Ask Price</TableCell>
                            <TableCell align="right">Volume (Qty)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className={classes.table}>
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
      
  );
});
