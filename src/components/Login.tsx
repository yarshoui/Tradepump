import * as React from 'react';
import { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Typography, TextField, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import mutations from '../store/mutations';
import { btn } from '../style/postcss';

const useStyles = makeStyles({
  btn,
});

// @ts-expect-error
export const LoginComponent = ({ authenticatedUser, authenticated }) => {
  const classes = useStyles();
  return (
    <form onSubmit={authenticatedUser} className="login-container">
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
        {authenticated === mutations.NOT_AUTHENTICATED ? <p>LOGIN INCORRECT</p> : null}
        <Button className={classes.btn} color="primary" type="submit" value="login">
          OK
        </Button>
      </Grid>
    </form>
  );
};

// @ts-expect-error
const mapStateToProps = ({ session }) => ({
  authenticated: session.authenticated,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    authenticatedUser(e: ChangeEvent<HTMLInputElement>) {
      e.preventDefault();
      // @ts-expect-error
      let username = e.target['username'].value;
      // @ts-expect-error
      let password = e.target['password'].value;
      dispatch(mutations.requestAuthenticateUser(username, password));
    },
  };
};

export const ConnectedLogin = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
