/*const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const remoteApiUrl = 'https://api.mexc.com/api/v3/ticker/24hr';  // Replace with your actual API URL

app.use('/proxy', async (req, res) => {
  try {
    // Fetch data from the remote API using axios
    const response = await axios({
      method: req.method,  // Forward the same HTTP method (GET, POST, etc.)
      url: remoteApiUrl,   // The remote API URL
      headers: req.headers, // Forward the request headers if necessary
      data: req.body        // Forward the request body if necessary
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while proxying the request' });
  }
});
app.listen(port, () => {
  console.log(`Proxy server is running at http://localhost:${port}`);
});

*/
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// create the proxy
/** @type {import('http-proxy-middleware/dist/types').RequestHandler<express.Request, express.Response>} */
const exampleProxy = createProxyMiddleware({
  target: 'https://api.mexc.com/api/v3/ticker/24hr', 
  changeOrigin: true, 
});

// mount `exampleProxy` in web server


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  next();
});
app.use('/api', exampleProxy);

app.listen(3001, () => {
  console.log(`Proxy server is running at http://localhost:${3001}`);
});
