
import 'src/intro/intro.js';
import 'src/intro/intro.css';

export const intro = introJs();

intro.setOptions({
    steps:[
        {
            intro: 'Welcome to our new website!'
        },
        {
            element: '#pairfilter',
            intro: 'Pairfilter intro text'
        },
    ]
})

intro.start();