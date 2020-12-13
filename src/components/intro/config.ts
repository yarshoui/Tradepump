import IntroJs from 'intro.js';
import 'intro.js/minified/introjs.min.css';

const SHOW_KEY_NAME = 'intro_shown';

const steps = [
  {
    intro: 'Welcome to our new website!',
  },
  {
    element: '#pairfilter',
    intro: 'test 2',
  },
];

export const startTourAgain = () => {
  localStorage.removeItem(SHOW_KEY_NAME);
  start();
}

export const start = () => {
  if (localStorage.getItem(SHOW_KEY_NAME)) {
    return;
  }

  localStorage.setItem(SHOW_KEY_NAME, JSON.stringify(true));

  IntroJs()
    .setOptions({
      steps,
    })
    .start();
};
