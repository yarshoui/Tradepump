import IntroJs from 'intro.js';
import 'intro.js/minified/introjs.min.css';

const steps = [
  {
    intro: 'Welcome to our new website!',
  },
  {
    element: '#pairfilter',
    intro: 'test 2',
  },
];

export const start = () => {
  IntroJs()
    .setOptions({
      steps,
    })
    .start();
};
