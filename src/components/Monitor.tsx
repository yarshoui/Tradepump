// import { map } from 'lodash';
import React from 'react';
import { observer } from 'mobx-react';
import './../../src/css/index.css';

// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';

// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
import { Header } from './Header';
import { OrderMonitorMenu } from './OrderMonitorMenu';
import { TopLogoPanel } from './TopLogoPanel';
import { AppStore } from 'src/logic/appStore';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import { Footer } from './Footer';
import { TopAd } from './TopAd';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Terms } from 'src/pages/Terms';
import { OrdersMonitor } from 'src/components/OrdersMonitor';
import { Privacy } from 'src/pages/Privacy';
import { About } from 'src/pages/About';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    minWidth: '1600px',
    overflowX: 'auto',
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

interface MonitorProps {
  store: AppStore;
}

export const Monitor = () => {
    const classes = useStyles();

    return (
      <BrowserRouter>
      <div className={classes.root}>
        <div className={classes.topHolder}>
          <div className={classes.logoHolder}>
            <TopLogoPanel />
          </div>
          <div className={classes.asideTopHolder}>
            <TopAd />
          </div>
        </div>
        <Header />
        {/* <OrdersMonitor /> */}

        <Switch>
        <Route path='/' component={OrdersMonitor} exact />
        <Route path='/terms' component={Terms} /> 
        <Route path='/privacy' component={Privacy} />
        <Route path='/about' component={About} />

        </Switch>

        <Footer />
      </div>
      </BrowserRouter>
    );
  }
