const log4js = require('log4js');

const setupLog4js = (level = 'info') => {
  log4js.configure({
    appenders: {
      console: { type: 'console' },
    },
    categories: {
      default: { appenders: ['console'], level }
    }
  });
}

module.exports = setupLog4js;
