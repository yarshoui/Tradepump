import React from 'react';
//Switch was introduced in react router v4
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { Terms } from 'src/pages/Terms';
import { OrdersMonitor } from 'src/components/OrdersMonitor';
import { Privacy } from 'src/pages/Privacy';
import { About } from 'src/pages/About';

function Routes() {
  return (

<BrowserRouter>
      
        
        <Switch>
          <Route path='/monitor' component={OrdersMonitor} />
          <Route path='/terms' component={Terms} />
          <Route path='/privacy' component={Privacy} />
          <Route path='/about' component={About} />
          <Redirect path='/' to='/monitor' />
        </Switch>
        

      </BrowserRouter>
      );
    }
    export default Routes;