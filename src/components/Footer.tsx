import React from 'react';
import './../../src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';

export const Footer = () => {
  return (
    <div>
      <ul className="bottom-nav">
        <li>
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
        </li>
        
        {/* <li>
          <a className="bottom-menu-button" href="/support">
            Support
          </a>
        </li> */}
      </ul>
      <p>Send your comments and suggestions to <a className="bottom-menu-button" href="mailto:tradepump.com@gmail.com">Support</a></p>
      <p>Copyright © 2020 TradePump.com</p>
    </div>
  );
};
