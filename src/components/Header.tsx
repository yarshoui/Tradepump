import React from 'react';
import { NavLink } from 'react-router-dom';
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
          <a className="active" href="/">
            Orders Monitor
          </a>
        </li>
        <li>
          <a className="disabled" href="/#dumpLink">
            Market Monitor
          </a>
        </li>
        <li>
          <a className="disabled" href="/history">
            Trade History
          </a>
        </li>
        <li>
          <a className="disabled" href="/#dumpLink">
            Market Statistics
          </a>
        </li>



        {/* <li>
          <NavLink className="active" to="/orders">
            Orders Monitor
          </NavLink>
        </li>
        <li>
          <NavLink className="disabled" to="/market">
            Market Monitor
          </NavLink>
        </li>
        <li>
          <NavLink className="disabled" to="/history">
            Trade History
          </NavLink>
        </li>
        <li>
          <NavLink className="disabled" to="/statistics">
            Market Statistics
          </NavLink>
        </li> */}



        
        <li>
          <span className="clock">
            Time:{' '}
            <span id="datetime">
              <Clock />
            </span>
          </span>
        </li>
      </ul>
    </div>
  );
};
