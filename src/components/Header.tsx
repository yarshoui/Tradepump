import React from 'react';
import { NavLink } from 'react-router-dom';
import 'src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
import { Clock } from 'src/components/logic/Clock';
// import { startTourAgain } from 'src/components/intro/config';

export const Header = (props: any) => {
  console.log('currentMOnitor', props.currMonitor);

  return (
    <div>
      <ul className="nav">
      {/* <li>
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
        </li> */}



        <li>
          <NavLink to="/monitor">
            Orders Monitor
          </NavLink>
        </li>
        <li>
          <NavLink to="/about">
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/SignUp">
            Sign-Up
          </NavLink>
        </li>
        <li>
          <NavLink to="/SignIn">
            Sign-In
          </NavLink>
        </li>
         {/* <li>
          <NavLink className="nonActive" to="/monitor" onClick={() => startTourAgain()}>
            Intro tour
          </NavLink>
        </li> */}
        {/* <li>
          <NavLink className="disabled" to="/statistics">
            Market Statistics
          </NavLink>
        </li>  */}

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
