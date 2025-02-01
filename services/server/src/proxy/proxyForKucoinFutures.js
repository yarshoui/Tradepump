
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const CryptoJS = require("crypto-js");
const app = express();

// create the proxy
/** @type {import('http-proxy-middleware/dist/types').RequestHandler<express.Request, express.Response>} */
const futuresProxy = createProxyMiddleware({
  target: 'https://api-futures.kucoin.com/api/v1/allTickers', 
  changeOrigin: true, 
  
});


let now = Date.now().toString();
const api_key = "your api_key";
const api_secret = "your api_secret";
const api_passphrase = "your api_passphrase";
let queryString = now + "GET" + target;
/* signature */
const signature = CryptoJS.HmacSHA256(queryString, api_secret);
const signatureInBase64 = CryptoJS.enc.Base64.stringify(signature);

/* passphrase */
const passphrase = CryptoJS.HmacSHA256(api_passphrase, api_secret);
const passphraseInBase64 = CryptoJS.enc.Base64.stringify(passphrase);


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header(
        "KC-API-SIGN": signatureInBase64,
        "KC-API-TIMESTAMP": now,
        "KC-API-KEY": api_key,
        "KC-API-PASSPHRASE": passphraseInBase64,
        "KC-API-KEY-VERSION": "2",
  );
  next();
});
app.use('/kucoinapifutures', futuresProxy);

app.listen(3006, () => {
  console.log(`Proxy server is running at http://localhost:${3006}`);
});
