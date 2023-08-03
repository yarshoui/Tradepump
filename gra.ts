import { createServer } from "http";
import client from "prom-client";

const logger = console;

export type Unit = "Count" | "Bytes" | "Milliseconds";

async function main() {
    const gw = new client.Pushgateway("http://localhost:9090");
    const collectDefaultMetrics = client.collectDefaultMetrics;
    const Registry = client.Registry;
    const register = new Registry();
    collectDefaultMetrics({ register });
    const testCounter = new client.Counter({
        name: "banana_counter",
        help: "How many bananas you can handle",
        labelNames: ["bananas"] as const,
    });
    client.
    register.registerMetric(testCounter);

    const x = setInterval(() => {
        const rnd = Math.floor(Math.random() * 100);
        testCounter.labels("bananas").inc(rnd + 1);
    }, 100);
    // setTimeout(() => {
    //     clearInterval(x);
    // }, 1000);

    const server = createServer(async (req, res) => {
        res.setHeader("Content-Type", register.contentType);
        const metrics = await register.metrics();
        res.write(metrics);
        res.end();
    });
    server.listen(9091, '0.0.0.0', () => {
        logger.info("Metrics server listening on", server.address())
    });
}

main();