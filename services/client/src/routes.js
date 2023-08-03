import React from 'react';
//Switch was introduced in react router v4
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { Terms } from 'src/pages/Terms';
import { OrdersMonitor } from 'src/components/OrdersMonitor';
import { Privacy } from 'src/pages/Privacy';
import { About } from 'src/pages/About';
// import { Users } from './components/admin/users/users';

import {routes} from "./routemap";

function Routes() {
  return (

<BrowserRouter>
      
        
        <Switch>
          <Route path={routes.OrdersMonitor} component={OrdersMonitor} />
          <Route path={routes.Terms} component={Terms} />
          <Route path={routes.Privacy} component={Privacy} />
          <Route path={routes.About} component={About} />
          <Redirect path='/' to='/monitor' />
        </Switch>
        

      </BrowserRouter>
      );
    }
    export default Routes;
