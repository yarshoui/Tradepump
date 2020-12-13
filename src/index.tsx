import React from 'react';
import ReactDOM from 'react-dom';

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// import { appStore } from './logic/appStore';

import { Monitor } from './components/Monitor';

// import red from '@material-ui/core/colors/red';
// eslint-disable-next-line camelcase
import { unstable_createMuiStrictModeTheme, createMuiTheme } from '@material-ui/core/styles';

// import { appStoreBittrex } from './logic/appStoreBittrex';

const getThemeConstructor = (): typeof createMuiTheme => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line camelcase
    return unstable_createMuiStrictModeTheme;
  }

  return createMuiTheme;
};

const themeConstructor = getThemeConstructor();

// A custom theme for this app
const theme = themeConstructor({});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Monitor />
  </ThemeProvider>,
  document.querySelector('#root'),
  

);

