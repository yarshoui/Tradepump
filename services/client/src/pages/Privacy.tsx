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

export const Privacy = () => {
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
          <meta property="og:url" content="https://www.tradepump.com/privacy" />
          <meta property="og:image" content="https://www.tradepump.com/android-chrome-192x192.png" />
          <meta property="og:description" content="Tradepump is not just a Bitcoin and Cryptocurrency Aggregator. Come see why our servise is the best place to know crypto exchanges orders books and trades history." />

        </Helmet>
      
        <h2>Privacy Policy</h2>
        <p>
          <em>Last Updated: December 4, 2020</em>
        </p>
        <p>Your privacy is important to us. It is TradePump's policy to respect your privacy regarding any information we may collect from you across our website, <a href="http://tradepump.com">tradepump.com</a>, and other sites we own and operate.</p>
        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
        <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
        <p>We don’t share any personally identifying information publicly or with third-parties, except when required to by law.</p>
        <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>
        <p>You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.</p>
        <p>Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.</p>
        <p>This policy is effective as of 31 December 2021.</p>
        <p></p>
        <h3>Aggregated Statistics</h3>
        <p>
        <a href="http://tradepump.com">tradepump.com</a> may collect statistics about the behavior of visitors to its websites. For instance, <a href="http://tradepump.com">tradepump.com</a> may monitor the most popular pages on this site. 
        <a href="http://tradepump.com">tradepump.com</a> may display this information publicly or provide it to others. 
        However, <a href="http://tradepump.com">tradepump.com</a> does not disclose personally–identifying information other than as described below.</p>
        
        <p><h3>Privacy Policy Changes</h3></p>
        <p>Although most changes are likely to be minor, <a href="http://tradepump.com">tradepump.com</a> may change its Privacy Policy from time to time, and in <a href="http://tradepump.com">tradepump.com</a>’s sole discretion. 
        <a href="http://tradepump.com">tradepump.com</a> encourages visitors to frequently check this page for any changes to its Privacy Policy. 
        Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.</p>

        <p><h3>Cookie Declaration</h3></p>
        <p>
        We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. 
        We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.
        Cookies are small text files that can be used by websites to make a user's experience more efficient.
        The law states that we can store cookies on your device if they are strictly necessary for the operation of this site. 
        For all other types of cookies we need your permission.
        This site uses different types of cookies. Some cookies are placed by third party services that appear on our pages.
        You can at any time change or withdraw your consent from the Cookie Declaration on our website.</p>
        


      
    </div>
  );
};
