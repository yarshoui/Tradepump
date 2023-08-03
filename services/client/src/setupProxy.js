const { createProxyMiddleware } = require('http-proxy-middleware');

const SERVER_URL = process.env.SERVER_URL ?? "http://localhost:8080/";

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
      target: SERVER_URL,
      changeOrigin: true,
    }),
  );
};
