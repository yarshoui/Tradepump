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
import { url } from 'inspector';

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
  aboutPageLinks:{
    textDecoration: 'none',
    color: 'blue',
  },
  tfaLockIcon:{
    backgroundSize: 'cover',
    // backgroundImage: url(),
    width: '4.5rem',
    height: '6rem',
  },
}));

export const SignIn = () => {
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
        <div>
          <div className="flex flex-grow-1 justify-center content-wrapper relative">
            <div className="content flex flex-column w-100">
              <div className="header flex justify-center mb20 tc">
                <span>Secure Sign-In</span>
              </div>
              <div className="flex flex-column login-form-container">
                <form className="form login-form login-form-2fa" method="POST" tabIndex={-1}>
                  <input type="hidden" name="csr"/>
                  <input className="challenge-input" type="hidden" name="ac" value="932278061"/>
                  <input type="hidden" name="44f0eed14d258dec6c8ddb212a202f4a2e2231d3a0ee2fa03bfe59319bae381f" value="52c03941df4f4be0bf16"/>
                  <input type="hidden" name="44f0eed14d258dec6c8ddb212a202f4a2e2231d3a0ee2fa03bfe59319bae381f-time" value="67.20499997027218"/>
                    <div className="flex flex-column">
                      <div className="" data-testid="login-basic">
                        <div className="flex justify-center mb20">
                          <i className="tfaLockIcon" aria-hidden="true">Lock Icon is here</i>
                        </div>
                        <div className="flex justify-center mb10">
                          <div className="input flex items-center dib ba w-100 overflow-hidden">
                            <div className="relative dib w-100">
                              <input id="username" name="username" type="text" autoComplete="current-username" spellCheck="false" className="" value=""/>
                              <label className="form-label f5 nowrap absolute top-0 h1 ma0" htmlFor="username">
                                <span className="required-label">
                                  <span>Username</span>
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center mb10">
                          <div className="password-input w-100 relative">
                            <div className="input flex items-center dib ba w-100 overflow-hidden">
                              <div className="relative dib w-100">
                                <input id="password" name="password" type="password" autoComplete="current-password" className="" value=""/>
                                <label className="form-label f5 nowrap absolute top-0 h1 ma0" htmlFor="password">
                                  <span className="required-label">
                                    <span>Password</span>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <button className="visibility-toggle absolute bn right-0 top-0 f5x z-1 bg-transparent" type="button">
                              <i className="fas fa-eye">Password visibility icon is here </i>
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-center mb20">
                          <button className="button di fw4 submit w-100 maintain-style starboard" type="submit" disabled>
                            <div className="flex justify-center items-center">
                              <span className="f6x lh-solid ttu ls-1">
                                <span>Sign In</span>
                              </span>
                            </div>
                          </button>
                        </div>
                        <div className="flex self-service-links justify-center">
                          <button className="flex self-service-link brand-color underline" type="button">
                            <span>Trouble signing in?</span>
                          </button>
                        </div>
                      </div>
                    </div>
                </form>
              </div>

{/* Secure Sign-In Help to restore Username or password (like on https://www.kraken.com/sign-in) */}
              <div className="flex flex-grow-1 justify-center content-wrapper relative">
                <button className="protect-account-close-button flex items-center justify-center absolute pointer" data-testid="protect-account-close-button">
                  <i className="f5 flex items-center justify-center krakicon-close close-icon-default-height brand-color">X</i>
                </button>
                <div className="content flex flex-column w-100">
                  <div className="header flex justify-center mb20 tc">
                    <span>Secure Sign-In Help</span>
                  </div>
                  <div className="flex flex-column login-form-container">
                    <div className="need-help flex flex-column justify-center items-center" data-testid="need-help">
                      <div className="flex justify-center mb20">
                        <i className="security-lock-icon" aria-hidden="true"></i>
                      </div>
                      <span className="need-help-title f5 bold">I need help with</span>
                      <button data-testid="recover-password" className="button di fw4 need-help-button mt20 f6x w-100 starboard" type="button">
                        <div className="flex justify-center items-center">
                          <span className="f6x lh-solid ttu ls-1">
                            <span className="ttn">Resetting my password</span>
                          </span>
                        </div>
                      </button>
                      <button data-testid="recover-username" className="button di fw4 need-help-button mt10 f6x w-100 starboard" type="button">
                        <div className="flex justify-center items-center">
                          <span className="f6x lh-solid ttu ls-1">
                            <span className="ttn">Remembering my username</span>
                          </span>
                        </div>
                      </button>
                      
                      <a href="mailto:support@tradepump.com" className={classes.aboutPageLinks}>Contact Support</a>
                    </div>
                  </div>
                </div>
              </div>
{/* Reset my password button form */}
              <div className="self-service relative" data-testid="self-service">
                <button className="close-self-service-button flex items-center justify-center absolute pointer" data-testid="close-self-service-button">
                  <i className="f5 flex items-center justify-center krakicon-close close-icon-default-height brand-color">X</i>
                </button>
                <div className="self-service-layout flex items-flex-start justify-center" data-testid="recover-password-form">
                  <div className="illustration-container relative flex items-center justify-center mt20">
                    <img src="/bundles/87209c565877218f06b7.svg"/>
                    <span>Some nice icon for Recover your password page</span>
                  </div>
                  <div className="action-container">
                    <span className="f5-smaller self-service-heading db">Recover your password</span>
                    <h3>
                      <span className="f4 self-service-description db mt10">Enter the email address and username associated with your Kraken account to receive an email with password reset instructions.</span>
                    </h3>
                    <form className="form recover-password-form" method="POST" tabIndex={-1}>
                      <input type="hidden" name="csr"/>
                        <div className="flex flex-column">
                          <div className="flex justify-center flex-column">
                            <div className="input flex items-center dib ba w-100 overflow-hidden">
                              <div className="relative dib w-100">
                                <input data-testid="email-input" name="email" type="text" autoComplete="current-email" className="" value=""/>
                                  <label className="form-label f5 nowrap absolute top-0 h1 ma0">
                                    <span className="required-label">
                                      <span>Email</span>
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div className="input flex items-center dib ba w-100 overflow-hidden">
                                <div className="relative dib w-100">
                                  <input data-testid="username-input" name="username" type="text" className="" value=""/>
                                    <label className="form-label f5 nowrap absolute top-0 h1 ma0">
                                      <span className="required-label">
                                        <span>Username</span>
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="flex">
                                <button data-testid="submit-button" className="button di fw4 submit maintain-style starboard" type="submit" disabled>
                                  <div className="flex justify-center items-center">
                                    <span className="f6x lh-solid ttu ls-1">
                                      <span>Recover password</span>
                                    </span>
                                  </div>
                                </button>
                              </div>
                              <button className="flex self-service-link brand-color underline mt10" type="button">
                                <span>Forgot username?</span>
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
{/* Remembering my username button form */}
              <div className="self-service relative" data-testid="self-service">
                <button className="close-self-service-button flex items-center justify-center absolute pointer" data-testid="close-self-service-button">
                  <i className="f5 flex items-center justify-center krakicon-close close-icon-default-height brand-color">X</i>
                </button>
                <div className="self-service-layout flex items-flex-start justify-center" data-testid="recover-username-form">
                  <div className="illustration-container relative flex items-center justify-center mt20">
                    <img src="/bundles/8a2c5e0aca9d632490bb.svg"/>
                    <span>Some nice icon for Recover your username page</span>
                  </div>
                  <div className="action-container">
                    <span className="f5-smaller self-service-heading db">Recover your username</span>
                    <h3>
                      <span className="f4 self-service-description db mt10">Enter the email address associated with your Kraken account to receive an email with your username.</span>
                    </h3>
                    <form className="form recover-username-form" method="POST" tabIndex={-1}>
                      <input type="hidden" name="csr"/>
                        <div className="flex flex-column">
                          <div className="flex justify-center flex-column">
                            <div className="input flex items-center dib ba w-100 overflow-hidden">
                              <div className="relative dib w-100">
                                <input data-testid="email-input" name="email" type="text" autoComplete="current-email" className="" value=""/>
                                  <label className="form-label f5 nowrap absolute top-0 h1 ma0">
                                    <span className="required-label">
                                      <span>Email</span>
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="flex">
                              <button data-testid="submit-button" className="button di fw4 submit maintain-style starboard" type="submit" disabled>
                                <div className="flex justify-center items-center">
                                  <span className="f6x lh-solid ttu ls-1">
                                    <span>Recover username</span>
                                  </span>
                                </div>
                              </button>
                            <div className="flex items-center ml20 mt20">Forgot email? 
                              <a href="mailto:support@tradepump.com" className={classes.aboutPageLinks}>Contact Support</a>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
    </div>
  );
};
