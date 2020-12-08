// import { map } from 'lodash';
import React from 'react';
import { observer } from 'mobx-react';
import 'src/css/index.css';
import { Header } from 'src/components/Header';
import { OrderMonitorMenu } from './OrderMonitorMenu';
import { TopLogoPanel } from 'src/components/TopLogoPanel';
import { AppStore } from 'src/logic/appStore';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import { Footer } from 'src/components/Footer';
import { TopAd } from 'src/components/TopAd';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Terms } from 'src/pages/Terms';
import { OrdersMonitor } from 'src/components/OrdersMonitor';
import { Privacy } from 'src/pages/Privacy';
import { About } from 'src/pages/About';
import ReactGA from 'react-ga';
// import 'src/intro/intro.min.js';
// import 'src/intro/introconfig.js';
// import 'src/intro/intro.css';
// import 'src/intro/intro.js';

// import { Steps, Hints } from 'intro.js-react';
//import Analytics from 'analytics';


ReactGA.initialize('G-JC86H2ED6J-xxx');


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
}));

const steps = [
  {
    intro: 'Welcome to our new website!'
  },
  {
    element: '#pairfilter',
    intro: 'test 2',
  },
  
];
interface MonitorProps {
  store: AppStore;
}

export const Monitor = () => {
    const classes = useStyles();

    return (
      <BrowserRouter>
            {/* <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={initialStep}
        onExit={this.onExit}
      /> */}
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
        <Route path='/' component={OrdersMonitor} exact />
        <Route path='/terms' component={Terms} /> 
        <Route path='/privacy' component={Privacy} />
        <Route path='/about' component={About} />
        </Switch>

        <Footer />
        {/* <script src='./src/intro/intro.min.js'></script>
        <script src='./src/intro/introconfig.js'></script> */}
      </div>

      </BrowserRouter>
    );
  }
