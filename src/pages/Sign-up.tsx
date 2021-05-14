import React, { useEffect }  from 'react';
import 'src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
// import { RadioButtonCheckedTwoTone } from '@material-ui/icons';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';
import { isUndefined } from 'lodash';

ReactGA.initialize('UA-184831310-1');

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    minWidth: '1600px',
    overflowX: 'auto',
    fontFamily: 'sans-serif',
    letterSpacing: 0,
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 400,
    marginLeft: '10px',
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

export const SignUp = () => {
  const classes = useStyles();

  useEffect( () => {
    // GoogleAnalytics
    ReactGA.pageview(window.location.pathname + window.location.search); 
  });

  return (
    <div className={classes.root}>
      <Helmet>
        <meta charSet="utf-8" />          
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="./favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="application-name" content="TradePump" />
        <meta name="description" content="Tradepump is not just a Bitcoin and Cryptocurrency Free Aggregator. Come see why our servise is the best place to know crypto exchanges orders books and trades history." />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="google" content="notranslate" />
        <meta name="generator" content="ReactJS"></meta>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <link rel="stylesheet" href="style.css" />
        <title>Bitcoin & Cryptocurrency Free Aggregator | TradePump.com</title>
        <meta property="og:title" content="Bitcoin & Cryptocurrency Aggregator | TradePump.com" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tradepump.com/terms" />
        <meta property="og:image" content="https://www.tradepump.com/android-chrome-192x192.png" />
        <meta property="og:description" content="Tradepump is not just a Bitcoin and Cryptocurrency Aggregator. Come see why our servise is the best place to know crypto exchanges orders books and trades history." />
      </Helmet>
        <div style={{ display: 'block' }}>
          <h2>Create your account</h2>
          <form method="POST" action="/sign-up" style={{ display: 'block' }}>
            <input type="hidden" name="a488a0256d669666eb6e986577e96270faf81fe70c927903d8a801382c5404da" value="b76ebf80de8e53220584"/>
            <input type="hidden" name="a488a0256d669666eb6e986577e96270faf81fe70c927903d8a801382c5404da-time" value="11.440000031143427"/>
 {/* E-Mail input             */}
            <div className="mb3">
              <div className="flex relative Field-module_container__2SO49 RetailField-module_retailField__2JJkb RetailField-module_fontWeightRetail__1zq82 Field-module_negative__2LDT6">
                <div className="flex w-100 tl items-center">
                  <div className="flex-auto relative flex items-center h-100 bg-pure-white Field-module_FieldItem__2qUNO RetailField-module_FieldItem__OAxZ1">
                    <label htmlFor="email" className="text-N300 absolute Field-module_floatingLabel__12Szv text-R300">Email</label>
                    <input data-testid="signup-email-field" id="email" name="email" className="w-100 text-N600 h-100 Field-module_input__1PIFR body-2 Field-module_floating__BjUHH pl3/2 pr3/2 Field-module_FX_WWW__8FicW" value=""/>
                  </div>
                </div>
              </div>
            </div>
 {/* Username input             */}
            <div className="SignupForm-module_usernamePasswordFields__2qidk">
              <div className="SignupForm-module_usernameField__2kYML">
                <div>
                  <div className="flex relative Field-module_container__2SO49 RetailField-module_retailField__2JJkb RetailField-module_fontWeightRetail__1zq82">
                    <div className="flex w-100 tl items-center">
                      <div className="flex-auto relative flex items-center h-100 bg-pure-white Field-module_FieldItem__2qUNO RetailField-module_FieldItem__OAxZ1">
                        <label htmlFor="username" className="text-N300 absolute Field-module_floatingLabel__12Szv">Username</label>
                        <input data-testid="signup-username-field" id="username" name="username" className="w-100 text-N600 h-100 Field-module_input__1PIFR w-100 body-2 text-N600 h-100 Field-module_input__1PIFR Field-module_floating__BjUHH Field-module_floating__BjUHH body-2 pl3/2 pr3/2 Field-module_FX_WWW__8FicW" value=""/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
 {/* Password input              */}
              <div className="SignupForm-module_passwordField__yyegQ" data-reach-tooltip-trigger="">
                <div className="flex relative Field-module_container__2SO49 RetailField-module_retailField__2JJkb RetailField-module_fontWeightRetail__1zq82">
                  <div className="flex w-100 tl items-center">
                    <div className="flex-auto relative flex items-center h-100 bg-pure-white Field-module_FieldItem__2qUNO RetailField-module_FieldItem__OAxZ1">
                      <label htmlFor="password" className="text-N300 absolute Field-module_floatingLabel__12Szv">Password</label>
                      <input tabIndex ={0} data-testid="signup-password-field" type="password" id="password" name="password" className="w-100 text-N600 h-100 Field-module_input__1PIFR w-100 body-2 text-N600 h-100 Field-module_input__1PIFR Field-module_withIconRight__2xwIp Field-module_floating__BjUHH Field-module_floating__BjUHH body-2 pl3/2 pr3/2 Field-module_FX_WWW__8FicW" value=""/>
                      <button className="flex text-N600 Field-module_iconRight__3psFJ" tabIndex ={0} type="button" data-testid="show password button">
                        <svg width="20" height="20" className="svg-icon" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.0711 0.514648L18.4853 1.92886L2.92893 17.4852L1.51472 16.071L7.2924 10.2933C7.29249 10.2935 7.29232 10.2931 7.2924 10.2933L11.293 6.29198C11.2928 6.2919 11.2931 6.29206 11.293 6.29198L17.0711 0.514648ZM9.30148 8.28424C9.29572 8.28986 9.29003 8.29555 9.28441 8.3013L9.30148 8.28424Z"></path>
                          <path d="M8.91264 12.9148C9.26655 12.97 9.62933 12.9999 10 12.9999C13.39 12.9999 16.12 10.4999 17.45 8.99992C16.8805 8.35765 16.0544 7.53204 15.0296 6.79785L16.4612 5.36625C18.6964 7.04448 20 8.99992 20 8.99992C20 8.99992 16 14.9999 10 14.9999C9.0277 14.9999 8.10791 14.8424 7.24916 14.5783L8.91264 12.9148Z"></path>
                          <path d="M10 2.99992C10.9719 2.99992 11.8912 3.15734 12.7496 3.42118L11.086 5.08481C10.7325 5.02974 10.3702 4.99992 10 4.99992C6.61 4.99992 3.89 7.48993 2.55 8.99992C3.11931 9.64201 3.94515 10.4673 4.96947 11.2014L3.53789 12.6329C1.30328 10.9549 0 8.99992 0 8.99992C0 8.99992 4 2.99992 10 2.99992Z"></path>
                          <path d="M10.1664 6.00436C10.1113 6.00135 10.0558 5.99983 10 5.99983C8.34315 5.99983 7 7.34297 7 8.99983C7 9.05565 7.00152 9.11112 7.00453 9.16619L10.1664 6.00436Z"></path>
                          <path d="M9.83216 11.9952C9.88772 11.9983 9.94368 11.9998 10 11.9998C11.6569 11.9998 13 10.6567 13 8.99983C13 8.9435 12.9984 8.88754 12.9954 8.83199L9.83216 11.9952Z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 {/* Select your country button */}
            <div className="relative pointer border-radius mb3 Dropdown-module_retailField__2VFcM Dropdown-module_fontWeightRetail__20_h9 Dropdown-module_dropdown__1E-NF Dropdown-module_dirty__JoYL3 Dropdown-module_retailDirty__2_CDn" data-testid="country-selector" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="downshift-3-label">
              <button data-testid="button-toggle-country" className="bg-pure-white relative flex items-center pl3/2 pr3/2 h-100 w-100 tl text-N600 caption-2 Dropdown-module_FieldItem__3wy5h Dropdown-module_button__2_NAp" type="button" role="button" aria-label="open menu" aria-haspopup="true" data-toggle="true" name="country" id="country">
                <div className="flex h-100 w-100">
                  <input type="hidden" name="country" value="PL"/>
                    <div className="w-100 h-100 relative flex items-center">
                      <label htmlFor="downshift-3-input" id="downshift-3-label" className="block text-N300 absolute Dropdown-module_label__2oniX Dropdown-module_dirty__JoYL3">Country of residence</label>
                      <span className="body-2 db w-100 Dropdown-module_value__2e1z6 Dropdown-module_value__3HQYO">
                        <span className="nowrap">Poland</span>
                      </span>
                    </div>
                  <div className="flex items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.001 15.8453L6.33199 10.7433L7.66992 9.25668L12.001 13.1546L16.332 9.25668L17.6699 10.7433L12.001 15.8453Z" fill="#5841D8"></path>
                    </svg>
                  </div>
                </div>
              </button>
            </div>
{/* Accept agreement tick box             */}
            <div className="mb3">
              <label htmlFor="agreement" data-testid="agreement-checkbox" className="flex items-center">
                <div className="Checkbox-module_checkbox__1oJuk flex-shrink-0 SignupForm-module_linkFocusCheckbox__1AK2P mr1">
                  <div className="Checkbox-module_checkboxWrapper__2Zls-">
                    <svg width="24" height="24" className="svg-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"></path>
                    </svg>
                    <input id="agreement" name="agreement" type="checkbox"/>
                  </div>
                </div>
                <p className="caption-2 text-N400">By continuing I agree to the 
                  <a target="_BLANK" rel="nooopener noreferrer" className="SignupForm-module_link__17Tw2 SignupForm-module_underlineFocus__341Bu" href="https://www.tradepump.com/terms">Terms and Conditions</a> and 
                  <a target="_BLANK" rel="nooopener noreferrer" className="SignupForm-module_link__17Tw2 SignupForm-module_underlineFocus__341Bu" href="https://www.tradepump.com/privacy">Privacy Policy</a>.
                </p>
              </label>
            </div>
            <div className="SignupForm-module_confirmationWrapper__9iamy">
              <div className="flex w-100 items-center justify-end mb4 Confirmation-module_confirmation__2jq_G">
                <div className="Confirmation-module_buttons__371Ph">
                  <button className="Button-module_button__wXbPI Button-module_primary__2X85A Button-module_extra-large__1Lr_s Confirmation-module_confirmButton__3ItrC" data-testid="confirm button" type="submit" disabled>
                    <div className="Button-module_focusRing__qT6o8">
                      <div className="Button-module_spacer__rMVgk">
                        <div className="Button-module_buttonInner__21spx SignupForm-module_confirmationButton__2RbmF">Create account</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </form>         
        </div>
    </div>
  );
};
