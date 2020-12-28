// import { map } from 'lodash';
import React, { useEffect } from 'react';
// import { observer } from 'mobx-react';
import 'src/css/index.css';
import { Header } from 'src/components/Header';
// import { OrderMonitorMenu } from './OrderMonitorMenu';
import { TopLogoPanel } from 'src/components/TopLogoPanel';
// import { AppStore } from 'src/logic/appStore';
// import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import { Footer } from 'src/components/Footer';
import { TopAd } from 'src/components/TopAd';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Terms } from 'src/pages/Terms';
import { OrdersMonitor } from 'src/components/OrdersMonitor';
import { Privacy } from 'src/pages/Privacy';
import { About } from 'src/pages/About';
import { start } from 'src/components/intro/config';
import ReactGA from 'react-ga';
import CookieConsent from "react-cookie-consent";
import {Tour} from '@styled-icons/material/Tour';
import {Help} from '@styled-icons/material-twotone/Help';
import { startTourAgain } from 'src/components/intro/config';

// import styled from 'styled-components';
// import 'src/intro/intro.min.js';
// import 'src/intro/introconfig.js';
// import 'src/intro/intro.css';
// import 'src/intro/intro.js';

// import { Steps, Hints } from 'intro.js-react';
//import Analytics from 'analytics';

ReactGA.initialize('UA-184831310-1');




const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    minWidth: '1700px',
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
  cookiesNitification:{
    color: 'rgb(240, 185, 11)',

  },
  introIcon: {
    color: '#AECCD7',
    // color: '#F4B200', //yellow
    // color: 'rgb(50, 60, 70)',    
        
   
    
    position: 'fixed',
    right:'20px',
    bottom: '20px',
    

  }
}));

export const Monitor = () => {
    const classes = useStyles();

    useEffect(() => {
      // ReactGA.pageview(window.location.pathname + window.location.search);
      start();
    }, []);

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
        
        <Switch>
          <Route path='/monitor' component={OrdersMonitor} />
          <Route path='/terms' component={Terms} />
          <Route path='/privacy' component={Privacy} />
          <Route path='/about' component={About} />
          <Redirect path='/' to='/monitor' />
        </Switch>
        <Help className={classes.introIcon} size="50" title="Intro Tour" 
        onClick={() => {startTourAgain()}}/> 
          
        <Footer />
        <CookieConsent>We use cookies to enhance your experience, analyze our traffic, and for security and marketing. By visiting our website you agree to our use of cookies. <a data-bn-type="text" target="_blank" href="/privacy" className={classes.cookiesNitification}>*Read more about cookies*</a></CookieConsent>
       
      </div>

      </BrowserRouter>
    );
  }

