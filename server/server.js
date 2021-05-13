const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const { json, urlencoded } = require('body-parser');
const log4js = require('log4js');
const setupLog4js = require('./config/logging');
const { setupPassport } = require('./config/passport');
const { resolveErrorCodeAndMessage } = require('./helpers/errors');
const router = require('./routers');

setupLog4js();
setupPassport();

const requestLogger = log4js.getLogger('Server');
const logger = log4js.getLogger('Main');
const app = express();
const host = process.env.IP || '127.0.0.1';
const port = process.env.PORT || 8080;

// Connect logger for proper request logging
app.use(log4js.connectLogger(requestLogger, { level: 'info' }));
// React built static files
app.use(express.static(path.resolve(__dirname, '../build')));
// Parse Cookies
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: false }))
// parse application/json
app.use(json())
// Serve API
app.use('/api', router);
app.use('/api', (req, res) => {
  res.status(405).json({ error: 'Not implemented' });
});
// Fallback to index.html otherwise
app.use((_req, res) => res.sendFile(path.resolve(__dirname, '../build/index.html')));
// Error handling
app.use((err, _req, res, _next) => {
  const [code, message] = resolveErrorCodeAndMessage(err);

  res.status(code).json({ error: message });
});

app.listen(port, host, () => {
  logger.info(`Server started at ${host}:${port}`);
});
