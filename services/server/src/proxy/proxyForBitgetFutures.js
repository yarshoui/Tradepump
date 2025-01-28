
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const futuresProxy = createProxyMiddleware({
  target: 'https://api.bitget.com', 
  changeOrigin: true,
  pathRewrite: (path, req) => {
    
    return '/api/v2/mix/market/tickers?productType=USDT-FUTURES';
  },
});


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/bitgetapifutures', futuresProxy);

app.listen(3004, () => {
  console.log(`Proxy server is running at http://localhost:${3004}`);
});
