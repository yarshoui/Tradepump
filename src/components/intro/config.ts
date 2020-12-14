import IntroJs from 'intro.js';
import 'intro.js/minified/introjs.min.css';
import 'intro.js/themes/introjs-modern.css';
import 'src/css/index.css';

const SHOW_KEY_NAME = 'intro_shown';

const steps = [
  {
    intro:
      'Welcome to TradePump.com! This is Free Bitcoin and Cryptocurrency aggregator. Our servise is the best place to know crypto exchanges Orders Books. Feel free to skip the tour if you are not a new visitor.',
  },
  {
    element: '#pairfilter',
    intro: 'Select the trading pair you need to know Orders Book for.',
  },
  {
    element: '#qtyfilter',
    intro: 'Set Minimum Orders Quantity to be shown.',
  },
  {
    element: '#highlightfilter',
    intro: 'Set the minimum Order Quantity to be highlighted.',
  },
];

export const startTourAgain = () => {
  localStorage.removeItem(SHOW_KEY_NAME);
  start();
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
