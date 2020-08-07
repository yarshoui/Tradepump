import * as React from 'react';
import { ChangeEvent } from 'react';
import { Typography, TextField, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { btn } from '../style/postcss';

const useStyles = makeStyles({
  btn,
});

export const LoginComponent = () => {
  const classes = useStyles();
  return (
    <form  className="login-container">
      <Grid container direction="column" justify="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Login:
        </Typography>
        <TextField
          type="text"
          placeholder="username"
          name="username"
          defaultValue="test1"
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <TextField
          type="password"
          placeholder="password"
          name="password"
          InputLabelProps={{
            shrink: true,
          }}
          required
          defaultValue={1}
        />
        <Button className={classes.btn} color="primary" type="submit" value="login">
          OK
        </Button>
      </Grid>
    </form>
  );
};
