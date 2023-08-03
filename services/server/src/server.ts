import { Metrics, MetricsAgent } from "@tradepump/monitoring";
import { QueueName } from "@tradepump/types";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import log4js from "log4js";
import { Socket } from "net";
import { WebSocketServer } from "ws";
import { setupLog4js } from "./config/logging";
import { setupPassport } from "./config/passport";
import { ConsumerManager, KafkaConsumer } from "./helpers/consumers";
import { resolveErrorCodeAndMessage } from "./helpers/errors";
import router from "./routers";

setupLog4js(process.env.LOG_LEVEL || "INFO");
setupPassport();

const requestLogger = log4js.getLogger("Server");
const logger = log4js.getLogger("Main");
const host = process.env.IP || "127.0.0.1";
const port = parseInt(process.env.PORT ?? "8080");
const brokers = process.env.KAFKA_URL?.split(",") ?? [];

if (!brokers?.length) {
  throw new Error("KAFKA_URL must be specified");
}

async function main() {
  await MetricsAgent.start({ port: 19092 });
  const app = express();
  const server = http.createServer(app);
  const wsServer = new WebSocketServer({ noServer: true });
  const kafka = new KafkaConsumer({ brokers });
  const kfkmgr = new ConsumerManager();

  await kafka.connect(QueueName.TradingQueue);

  kafka.on("message", message => {
    Metrics.emit("KafkaMessageReceived", 1, "Count");
    kfkmgr.sendMessage(message);
  });

  wsServer.on("connection", (socket) => {
    Metrics.inc("WebSocketConnection");
    logger.debug("New connection established", socket.url);
    // Ignore client 2 server messages for now. No use cases.
    // socket.on("message", (message) => console.log(message));
    kfkmgr.addSocket(socket);
    socket.on("close", () => {
      Metrics.dec("WebSocketConnection");
      logger.debug("Connection released");
      kfkmgr.removeConsumer(socket);
    });
  });

  server.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket as Socket, head, (socket) => {
      wsServer.emit("connection", socket, request);
    });
  });

  // Emit metrics
  app.use((req, res, next) => {
    Metrics.emit("RequestCount", 1, "Count");
    const stopTimer = Metrics.startTimer("HTTPRequest", {
      url: req.url,
      method: req.method,
      status: 0,
    });
    res.on("finish", () => {
      stopTimer({
        url: req.url,
        method: req.method,
        status: res.statusCode,
      });
    });
    next();
  });

  // Connect logger for proper request logging
  app.use(log4js.connectLogger(requestLogger, { level: "info" }));
  // Parse Cookies
  app.use(cookieParser());
  // parse application/x-www-form-urlencoded
  app.use(urlencoded({ extended: false }));
  // parse application/json
  app.use(json());
  // Serve API
  app.use("/api", router);
  app.use("/api", (req, res) => {
    res.status(405).json({ error: "Not implemented" });
  });
  // Fallback to index.html otherwise
  app.use((_req, res) =>
    res.sendStatus(404)
  );
  // Error handling
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const [code, message] = resolveErrorCodeAndMessage(err);
    if (code === 500 && err.stack) {
      logger.fatal(err);
    }

    res.status(code).json({ error: message });
  });

  server.listen(port, host, () => {
    logger.info(`Server started on ${host}:${port}`);
  });

  server.on("close", () => {
    kafka.disconnect();
  });
}

main();
