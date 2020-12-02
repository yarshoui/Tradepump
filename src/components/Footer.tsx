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
          <a className="bottom-menu-button" href="/aboutus">
            About Us
          </a>
        </li>
        <li>
          <a className="bottom-menu-button" href="/contacts">
            Contacts
          </a>
        </li>
        <li>
          <a className="bottom-menu-button" href="/support">
            Support
          </a>
        </li>
      </ul>
    </div>
  );
};
