
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const CryptoJS = require("crypto-js");
const app = express();
let now = Date.now();
const api_key = "";
const api_secret = "";
const api_passphrase = "";

// const url = 'https://api-futures.kucoin.com/api/v1/allTickers';
// const signatureInBase64 = (url, now) => {  
//   let msg = now + "POST" + url;
//   let signature = CryptoJS.HmacSHA256(msg, api_secret);
//   return CryptoJS.enc.Base64.stringify(signature);
// }
// /* passphrase */
// const passphraseInBase64 = () => {
//   var passphrase = CryptoJS.HmacSHA256(api_passphrase, api_secret);
//   return CryptoJS.enc.Base64.stringify(passphrase);
// }
// // create the proxy
// const futuresProxy = createProxyMiddleware({
//   target: url, 
//   changeOrigin: true, 
//   secure:false,
//   headers:{
//     "KC-API-SIGN": signatureInBase64(url, now),
//     // "KC-API-TIMESTAMP": now,
//     "KC-API-KEY": api_key,
//     "KC-API-PASSPHRASE": passphraseInBase64(),
//     "KC-API-KEY-VERSION": "2",
//   }
  
// });
  const api = "/api/v1/allTickers"; 
  const url = "https://api-futures.kucoin.com" + api;
  
  const str_to_sign = now + "GET" + api;

  const signaturehash = CryptoJS.HmacSHA256(str_to_sign, api_secret);
  const passphrasehash = CryptoJS.HmacSHA256(api_passphrase, api_secret);
  const signature = CryptoJS.enc.Base64.stringify(signaturehash);
  const passphrase = CryptoJS.enc.Base64.stringify(passphrasehash);
  // const headers = {
  //   "KC-API-SIGN": signature,
  //   "KC-API-TIMESTAMP": now,
  //   "KC-API-KEY": api_key,
  //   "KC-API-PASSPHRASE": passphrase,
  //   "KC-API-KEY-VERSION": "2",
  // };

  const futuresProxy = createProxyMiddleware({
      target: url, 
      changeOrigin: true, 
      secure:false,
      headers:{
        "KC-API-SIGN": signature,
        "KC-API-TIMESTAMP": now,
        "KC-API-KEY": api_key,
        "KC-API-PASSPHRASE": passphrase,
        "KC-API-KEY-VERSION": "2",
      }      
    });
// console.log({ 
//   "KC-API-SIGN": signature,
//   // "KC-API-TIMESTAMP": toString(now),
//   "KC-API-TIMESTAMP": now + "",
//   "KC-API-KEY": api_key,
//   "KC-API-PASSPHRASE": passphrase,
//   "KC-API-KEY-VERSION": "2",
  
// })




app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  req.header({
        "KC-API-KEY-VERSION": "2",
        "KC-API-SIGN": signature,
        "KC-API-TIMESTAMP": now,
        "KC-API-KEY": api_key,
        "KC-API-PASSPHRASE": passphrase,
        }
      );
      
  next();
  //console.log(JSON.stringify(req.headers));
});
app.use('/kucoinapifutures', futuresProxy);
  

app.listen(3006, () => {
  console.log(`Proxy server is running at http://localhost:${3006}`);
  
  
});
