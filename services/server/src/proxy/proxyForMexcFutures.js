
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// create the proxy
/** @type {import('http-proxy-middleware/dist/types').RequestHandler<express.Request, express.Response>} */
const futuresProxy = createProxyMiddleware({
  target: 'https://contract.mexc.com/api/v1/contract/ticker', 
  changeOrigin: true, 
});

// mount `exampleProxy` in web server


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/mexcapifutures', futuresProxy);

app.listen(3002, () => {
  console.log(`Proxy server is running at http://localhost:${3002}`);
});
