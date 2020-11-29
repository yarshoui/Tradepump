import React from 'react';
import './../../src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
import { Clock } from './logic/Clock';

export const Header = (props: any) => {
  console.log('currentMOnitor', props.currMonitor);

  return (
    <div>
      <ul className="nav">
        <li>
          <a className="active" href="./index.html">
            Orders Monitor
          </a>
        </li>
        <li>
          <a className="disabled" href="#dumpLink">
            Market Monitor
          </a>
        </li>
        <li>
          <a className="disabled" href="./tradehistory.html">
            Trade History
          </a>
        </li>
        <li>
          <a className="disabled" href="#dumpLink">
            Market Statistics
          </a>
        </li>
        <li>
          <a className="disabled" href="#dumpLink">
            Info
          </a>
        </li>
        <li>
          <a className="disabled" href="#dumpLink">
            About Us
          </a>
        </li>
        <li>
          <a className="disabled" href="#dumpLink">
            Sign In
          </a>
        </li>
        <li>
          <a className="disabled" href="#dumpLink">
            Create Account
          </a>
        </li>
        <li>
          <span className="clock">
            Date/Time:{' '}
            <span id="datetime">
              <Clock />
            </span>
          </span>
        </li>
      </ul>
    </div>
  );
};
