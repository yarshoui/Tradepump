import React from 'react';
import './../../src/css/index.css';
import { makeStyles } from '@material-ui/core/styles';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: 90,
    },
  
}));

export const TopLogoPanel = () => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.root}>
        <a className="logo" href="http://tradepump.com">
         <img src="./Icon3.jpg" alt="tradepump-logo"></img>
        </a>
      </div>
    </div>
  );
};
