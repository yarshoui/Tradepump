import IntroJs from 'intro.js';
// import 'intro.js/minified/introjs.min.css';
// import 'intro.js/themes/introjs-modern.css';
import 'src/css/index.css';
import 'src/css/introjs.min.css';
import 'src/css/introjs-modern.css';

const SHOW_KEY_NAME = 'intro_shown';


const steps = [
  {
    intro:
      'Welcome to TradePump.com! <br />This is Free Bitcoin and Cryptocurrency aggregator. Our servise will help you to see the largest crypto exchanges live Orders Books with maximum depth avaialble.<br /> We are constantly developing our servise. Feel free to send your proppositions to <a href="mailto:support@tradepump.com" style="color:rgb(240, 185, 11)">Support</a> or just skip the tour if you are not a new visitor.',
  },
  {
    element: '#pairfilter',
    intro: 'Select the trading pair you need to know Orders Book for.',
  },
  {
    element: '#qtyfilter',
    intro: 'Set Minimum Orders Quantity to be shown.<br /> <br />This filter will allow you to see large blocks of Asks/Bids in the Orders Book',
  },
  {
    element: '#highlightfilter',
    intro: 'Set the minimum Order Quantity to be highlighted.',
  },
];

export const startTourAgain = () => {
  localStorage.removeItem(SHOW_KEY_NAME);
  if (window.location.pathname === '/monitor'){
    start();
  }
  else {
    window.location.pathname = '/monitor';
  }  
};

export const start = () => {
  if (localStorage.getItem(SHOW_KEY_NAME)) {
    return;
  }

  localStorage.setItem(SHOW_KEY_NAME, JSON.stringify(true));

  IntroJs()
    .setOptions({
      steps,
      // tooltipClass: 'customDefault'
    })
    .start();
};
