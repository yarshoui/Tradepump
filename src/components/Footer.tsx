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
          <a className="bottom-menu-button" href="#dumpLink">
            Terms and conditions
          </a>
        </li>
        <li>
          <a className="bottom-menu-button" href="#dumpLink">
            Privacy Policy
          </a>
        </li>
        <li>
          <a className="bottom-menu-button" href="#dumpLink">
            About Us
          </a>
        </li>
        <li>
          <a className="bottom-menu-button" href="#dumpLink">
            Contacts
          </a>
        </li>
        <li>
          <a className="bottom-menu-button" href="#dumpLink">
            Support
          </a>
        </li>
      </ul>
    </div>
  );
};
