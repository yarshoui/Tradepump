import { createServer, Server, IncomingMessage, ServerResponse } from "http";
import { Metric, Registry, collectDefaultMetrics } from "prom-client";
import { getLogger } from "log4js";

const logger = getLogger("MetricsAgent");

export interface MetricsAgentProps {
    host: string;
    port: number;
}

/**
 * Metric Agent that serves Prometheus metrics listening on MetricsAgentProps.host:MetricsAgentProps.port
 * Use MetricsAgent.start({host, port})
 */
export class MetricsAgent {
    private static _instance: MetricsAgent;
    private readonly props: MetricsAgentProps;
    private server: Server;
    public readonly registry: Registry;

    private static get(props: Partial<MetricsAgentProps> = {}) {
        if (!this._instance) {
            this._instance = new MetricsAgent(props);
        }
        return this._instance;
    }

    private constructor(props: Partial<MetricsAgentProps> = {}) {
        this.props = {
            host: "0.0.0.0",
            port: 19091,
            ...props,
        };
        // TODO: Run http server in a worker thread
        this.registry = new Registry();
        collectDefaultMetrics({ register: this.registry });
        this.server = createServer(this._requestHandler);
    }

    public static registerMetric(metric: Metric) {
        metric.get().then(data => {
            logger.debug(`Registering metric [${data.type}] '${data.name}'`);
        }).catch(() => { });
        this.get().registry.registerMetric(metric);
    }

    private _requestHandler = async (req: IncomingMessage, res: ServerResponse) => {
        res.setHeader("Content-Type", this.registry.contentType);
        const metrics = await this.registry.metrics();
        res.write(metrics);
        res.end();
    }

    private listen() {
        // TODO: reconnect if closed
        if (this.server.listening) {
            return Promise.resolve(this.server);
        }
        // Gracefully stop on exit. Safe switch
        process.on("beforeExit", this.close);
        return new Promise((resolve, reject) => {
            this.server.once("error", reject);
            this.server.listen(this.props.port, this.props.host, () => {
                logger.info(`Metrics agent is listening on port ${this.props.host}:${this.props.port}`);
                resolve(this.server);
            });
        });
    }

    private close = () => {
        if (!this.server.listening) {
            return Promise.resolve();
        }
        process.off("beforeExit", this.close);
        return new Promise<void>((resolve, reject) => {
            this.server.close(err => err ? reject(err) : resolve());
        });
    };

    public static async start(props: Partial<MetricsAgentProps> = {}) {
        await this.get(props).listen();
    }
    public static async stop() {
        await this.get().close();
    }
}
