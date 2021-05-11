import React, { Suspense } from 'react';
import './../../src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';

export const TopLogoPanel = () => {
  return (
    <div>
      <div className="top">
        <a className="logo" href="http://tradepump.com">
         <img src="./Icon3.jpg" alt="tradepump-logo"></img>
        </a>
      </div>
    </div>
  );
};
