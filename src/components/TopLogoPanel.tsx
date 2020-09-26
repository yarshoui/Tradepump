import * as React from 'react';
import './../../src/css/index.css'
import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { themeStyles } from '../style/postcss';


export const TopLogoPanel = () => {
  return (
    <div>
      <div className="top"><a className="logo" href="http://tradepump.com">TradePump.com</a></div>
    </div>
  );
};
