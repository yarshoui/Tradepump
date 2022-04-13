import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import log4js from 'log4js';
import { QueueManager } from '../../commons/src/QueueManager'
import { setupLog4js } from './config/logging';
import { setupPassport } from './config/passport';
import { resolveErrorCodeAndMessage } from './helpers/errors';
import { router } from './routers';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost';

setupLog4js(process.env.LOG_LEVEL || 'info');
setupPassport();

const logger = log4js.getLogger('Main');

async function main() {
  const requestLogger = log4js.getLogger('Server');
  const app = express();
  const host = process.env.IP || '127.0.0.1';
  const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

  // Initialize queue manager
  QueueManager.init(RABBITMQ_URL);

  // Connect logger for proper request logging
  app.use(log4js.connectLogger(requestLogger, { level: 'info' }));
  // Parse Cookies
  app.use(cookieParser());
  // parse application/x-www-form-urlencoded
  app.use(urlencoded({ extended: false }))
  // parse application/json
  app.use(json())
  // Serve API
  app.use('/api', router);
  app.use('/api', (_req, res) => {
    res.status(405).json({ error: 'Not implemented' });
  });
  // Fallback to index.html otherwise
  app.use((_req, res) => res.sendFile(path.resolve(__dirname, '../build/index.html')));
  // Error handling
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const [code, message] = resolveErrorCodeAndMessage(err);
    if (code === 500 && err.stack) {
      logger.fatal(err);
    }

    res.status(code).json({ error: message });
  });

  app.listen(port, host, () => {
    logger.info(`Server started at ${host}:${port}`);
  });
}

main()
  .then(logger.info)
  .catch(logger.fatal);
