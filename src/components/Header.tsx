import * as React from 'react';
import './../../src/css/index.css'
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
import { Clock } from './logic/Clock';


export const Header = (props: any) => {
  console.log('currentMOnitor', props.currMonitor)

  return (
    <div>
      <ul className="nav">
        <li><a className="menu-button" href="#">Market Monitor</a></li>
        <li><a className="menu-button" href="./index.html">Constructor</a></li>
        <li><a className="menu-button" href="#">Statistics</a></li>
        <li><a className="menu-button" href="./tradehistory.html">Trade History</a></li>
        <li><a className="menu-button" href="#">Info</a></li>
        <li><a className="menu-button" href="#">About Us</a></li>
        <li><a className="sign-in-button" href="#">Sign In</a></li>
        <li><a className="create-account-button" href="#">Create Account</a></li>
        <li><p className="clock"> Date/Time: <span id="datetime"><Clock /></span> </p> </li>
      </ul>
    </div>
  );
};
