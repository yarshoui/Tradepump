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
import { AppStoreBinance } from 'src/logic/appStoreBinance';
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
  base:{
    backgroundColor: "#FFFFFF",
  },
  highlight:{
    backgroundColor: "#AECCD7",
  },
});


interface MonitorProps {
  
}
export const BinanceOrdersTable = observer(
  ({  }: MonitorProps): JSX.Element => {
    /*console.log(store);*/

    
    const classes = useStyles();

    
    return (
      <table style={{ display: 'inline-block' }}>
        <caption className={classes.caption}>Arbitrage Hunter</caption>        
        <tbody>
          <tr>
            <td align="center"></td>
            <td className="inline">
              
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
);
