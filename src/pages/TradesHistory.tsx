import React, { useEffect }  from 'react';
import 'src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
// import { RadioButtonCheckedTwoTone } from '@material-ui/icons';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';
import { url } from 'inspector';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

interface Column {
  id: 'side' | 'price' | 'qty' | 'time' | 'date';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

ReactGA.initialize('UA-184831310-1');

const columns: Column[] = [
  { id: 'side', label: 'Side', minWidth: 170 },
  { id: 'price', label: 'Price', minWidth: 100 },
  {
    id: 'qty',
    label: 'Qty',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'time',
    label: 'Time',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'date',
    label: 'Date',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
];

interface Data {
  price: number;
  side: string;
  qty: number;
  time: number;
  date: number;
}

function createData(side: string, price: number, qty: number, time: number, date: number): Data {
  
  return { side, price, qty, time, date };
}

const rows = [
  createData('B', 30000, 2.5, 213111, 24052021),
  createData('S', 30100, 10, 213100, 24052021),
  
];


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    width:'50%',
    overflowX: 'auto',
    fontFamily: 'sans-serif',
    letterSpacing: 0,
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 400,
    marginLeft: '10px',
  },
  table: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  marketbuttons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },

  formControl: {
    // margin: theme.spacing(1),
    margin:'20px',
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

  tradesfilter: {
    width: '250px',
    margin: '20px'
  },
  buttonGroup: {
    margin:'20px',
  },

  
}));


export const TradesHistory = () => {
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [state, setState] = React.useState<{ pair: string | number; name: string }>({
    pair: '',
    name: 'hai',
    // Do I need 'name' here?
  });

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof state;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  
  useEffect( () => {
    // GoogleAnalytics
    ReactGA.pageview(window.location.pathname + window.location.search); 
  });

  

  return (
    <div className={classes.root}>
      <Helmet>
        <meta charSet="utf-8" />          
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="application-name" content="TradePump" />
        <meta name="description" content="Tradepump is not just a Bitcoin and Cryptocurrency Free Aggregator. Come see why our servise is the best place to know crypto exchanges orders books and trades history." />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="google" content="notranslate" />
        <meta name="generator" content="ReactJS"></meta>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <link rel="stylesheet" href="style.css" />
        <title>Bitcoin & Cryptocurrency Free Aggregator | TradePump.com | Login to your account</title>
        <meta property="og:title" content="Bitcoin & Cryptocurrency Aggregator | TradePump.com" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tradepump.com/sign-in" />
        <meta property="og:image" content="https://www.tradepump.com/android-chrome-192x192.png" />
        <meta property="og:description" content="Tradepump is not just a Bitcoin and Cryptocurrency Aggregator. Come see why our servise is the best place to know crypto exchanges orders books and trades history." />
      </Helmet>

      <Paper className={classes.table}>
        <ButtonGroup color="primary" aria-label="outlined primary button group" className={classes.buttonGroup}>
          <Button>Kraken</Button>
          <Button>Bitfinex</Button>
          <Button>Binance</Button>
          <Button>Bitstamp</Button>
        </ButtonGroup>
        <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="outlined-age-native-simple">Pair</InputLabel>
        <Select
          native
          value={state.pair}
          onChange={handleChange}
          label="Pair"
          inputProps={{
            name: 'pair',
            id: 'outlined-age-native-simple',
          }}
        >
          <option aria-label="None" value="" />
          <option value={"BTC/USD"}>BTC/USD</option>
          <option value={"BTC/EUR"}>BTC/EUR</option>
          <option value={"BTC/USDT"}>BTC/USDT</option>
        </Select>
      </FormControl>

      <TextField className={classes.tradesfilter}
          id="outlined-number"
          label="Show trades more than (Qty):"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          placeholder="1"
          onChange={(event) => {
            //Filter the table data and show only trades with Qty > 'number'
          }}
        />
      </Paper>

      <Paper className={classes.table}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                // it was key={row.code}
                <TableRow hover role="checkbox" tabIndex={-1} key={row.time}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
    <Paper>
      <Grid item xs={12} sm={6} spacing={2}>
      <Typography variant="h6" gutterBottom>
        1 Hour
      </Typography>
      <TextField
            disabled
            id="outlined-disabled"
            label="Sold"
            defaultValue="1H Sold Qty"
            variant="outlined"
          />
      <TextField
            disabled
            id="outlined-disabled"
            label="Bought"
            defaultValue="1H Bought Qty"
            variant="outlined"
          />
      </Grid>
      <Grid item xs={12} sm={6} spacing={2}>
      <Typography variant="h6" gutterBottom>
        1 Day
      </Typography>
      <TextField
            disabled
            id="outlined-disabled"
            label="Sold"
            defaultValue="1D Sold Qty"
            variant="outlined"
          />
      <TextField
            disabled
            id="outlined-disabled"
            label="Bought"
            defaultValue="1D Bought Qty"
            variant="outlined"
          />
      </Grid>
      <Grid item xs={12} sm={6} spacing={2}>
      <Typography variant="h6" gutterBottom>
        1 Week
      </Typography>
      <TextField
            disabled
            id="outlined-disabled"
            label="Sold"
            defaultValue="1W Sold Qty"
            variant="outlined"
          />
      <TextField
            disabled
            id="outlined-disabled"
            label="Bought"
            defaultValue="1W Bought Qty"
            variant="outlined"
          />
      </Grid>
      <Grid item xs={12} sm={6}>
      <Typography variant="h6" gutterBottom>
        1 Month
      </Typography>
      <TextField
            disabled
            id="outlined-disabled"
            label="Sold"
            defaultValue="1M Sold Qty"
            variant="outlined"
          />
      <TextField
            disabled
            id="outlined-disabled"
            label="Bought"
            defaultValue="1M Bought Qty"
            variant="outlined"
          />
      </Grid>
    </Paper>


      
 
    </div>
  );
};
