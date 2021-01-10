import React from 'react';
import 'src/css/index.css';
import { NavLink } from 'react-router-dom';

// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';

export const Footer = () => {
  return (
    <div>
      <ul className="nav-footer">
        {/* <li>
          <a className="bottom-menu-button" href="/terms">
            Terms and conditions
          </a>
        </li>
        <li>
          <a className="bottom-menu-button" href="/privacy">
            Privacy Policy
          </a>
        </li>
        <li>
          <a className="bottom-menu-button" href="/about">
            About
          </a>
        </li> */}
        
        <li>
          <NavLink to="/terms">
            Terms and conditions
          </NavLink>
        </li>
        <li>
          <NavLink to="/privacy">
            Privacy Policy
          </NavLink>
        </li>
        <li>
          <NavLink to="/about">
            About
          </NavLink>
        </li>
      </ul>
      <p style={{ marginLeft: '10px' }}>Send your comments and suggestions to <a className="bottom-menu-button" href="mailto:support@tradepump.com">Support</a></p>
      <p style={{ marginLeft: '10px' }}>Copyright © 2021 TradePump.com</p>
    </div>
  );
};
