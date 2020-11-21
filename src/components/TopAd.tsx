import * as React from 'react';
import './../../src/css/index.css'
import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { themeStyles } from '../style/postcss';
import { BorderColor } from '@material-ui/icons';


export const TopAd = () => {
  return (
    <div style={{display : 'inline-block'}}>
      <div className="topadv"> 
      <p>Please disable your ad-blocker (adv 728*90 align=right)</p>
      <p>You may not like this ad, but it supports the developer and keeps this site free.</p>
       </div>
    </div>
  );
};
