const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/v1/*',
    createProxyMiddleware({
      target: 'https://api.bitfinex.com/',
      changeOrigin: true,
    }),
  );
  app.use(
    '/api/*',
    createProxyMiddleware({
      target: 'http://localhost:8080/',
      changeOrigin: true,
    }),
  );
};
