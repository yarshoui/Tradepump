import log4js from 'log4js'

export const setupLog4js = (level = 'INFO') => {
  log4js.configure({
    appenders: {
      console: { type: 'console' },
    },
    categories: {
      default: { appenders: ['console'], level }
    }
  });
}
