import React, { useState, useEffect } from 'react';
import { Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router';

import { Dashboard } from './Dashboard';
import { LoginComponent } from './Login';
import { Navigation } from './Navigation';

const RouteGuard = (Component: any) => ({ match }: { match: any }) => {
  if (true) {
    return <Redirect to="/" />;
  } else {
    return <Component match={match} />;
  }
};

export const Main = () => {
 

  return (
    <Router history={history}>
      <Provider store={store}>
        <Navigation />
        <Route exact path="/" component={LoginComponent} />
        <Route exact path="/dashboard" render={RouteGuard(Dashboard)} />
      </Provider>
    </Router>
  );
};
