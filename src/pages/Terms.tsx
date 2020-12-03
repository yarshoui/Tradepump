import React from 'react';
import './../../src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    minWidth: '1600px',
    overflowX: 'auto',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  contentHolder: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  tableHolder: {
    flexGrow: 1,
  },
  asideHolder: {
    width: '180px',
    paddingLeft: '20px',
  },
  topHolder: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  logoHolder: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  asideTopHolder: {
    paddingLeft: '20px',
  },
}));

export const Terms = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      
        <p><strong>Terms of agreement</strong></p>

        <p>Agreement to use the services of TradePump.com.
        This agreement, hereinafter referred to as the "Agreement", is concluded between the TradePump.com service, hereinafter referred to as the "Site", 
        and the user of the services, hereinafter referred to as the "Client" or "User", determining the conditions for purchasing services through the Site.
        </p>
        <p><strong>1. Fundamentals</strong></p>
        <p>
          <p>1.1. This Agreement is concluded between the Client and the Site at the time of registration on the service. The Client confirms his agreement with the conditions 
            established by this Agreement by checking checkbox in the column "I agree with the terms of the agreement" when registering on the site.</p>
          <p>1.2. The client can be any individual or entity who is able to accept and pay for the service ordered by him in the manner and on the terms established by this Agreement.</p>
          <p>1.3. The site administration reserves the right at any time to change, add or delete clauses of this Agreement without notifying the User.</p>
          <p>1.4. Continued use of the Site by the User means acceptance of the Agreement and changes made to this Agreement.</p>

        </p>
      
    </div>
  );
};
