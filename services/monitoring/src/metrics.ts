import { Metric, Histogram, Summary, Gauge } from "prom-client";
import { getLogger } from "log4js";
import { MetricsAgent } from "./metrics-agent";
import { MetricConfiguration } from "prom-client";

const logger = getLogger("Metrics");

export type Unit = "Count" | "Gauge" | "Bytes" | "Milliseconds";

export class Metrics {
    private static _instance: Metrics;
    private static readonly metrics: Map<string, Metric> = new Map();

    public static get() {
        if (!this._instance) {
            this._instance = new Metrics();
        }
        return this._instance;
    }

    static emit(name: string, value: any, unit: Unit) {
        if (!this.metrics.has(name)) {
            const metric = getMetricByUnit(unit, name, `${name} ${unit}`);
            MetricsAgent.registerMetric(metric);
            this.metrics.set(name, metric);
        }
        if (unit === "Gauge") {
            (this.metrics.get(name) as Gauge).set(value);
        } else {
            (this.metrics.get(name) as Histogram).observe(value);
        }
        logger.trace({ timestamp: Date.now(), metricName: name, value, unit });
    }

    static inc(name: string, value = 1) {
        if (!this.metrics.has(name)) {
            const metric = getMetricByUnit("Gauge", name, `${name} Gauge`);
            MetricsAgent.registerMetric(metric);
            this.metrics.set(name, metric);
        }
        (this.metrics.get(name) as Gauge).inc(value);
    }

    static dec(name: string, value = 1) {
        if (!this.metrics.has(name)) {
            const metric = getMetricByUnit("Gauge", name, `${name} Gauge`);
            MetricsAgent.registerMetric(metric);
            this.metrics.set(name, metric);
        }
        (this.metrics.get(name) as Gauge).dec(value);
    }

    static startTimer(name: string, labels?: Record<string, string | number>) {
        if (!this.metrics.has(name)) {
            const metric = getMetricByUnit("Milliseconds", name, `${name} Timer`, labels ? Object.keys(labels) : []);
            MetricsAgent.registerMetric(metric);
            this.metrics.set(name, metric);
        }
        return (this.metrics.get(name) as Summary).startTimer(labels);
    }
}

function getMetricByUnit(unit: Unit, name: string, help: string, labelNames?: string[]) {
    const props: MetricConfiguration<any> = { name, help };

    if (labelNames && labelNames.length) {
        props.labelNames = labelNames;
    }
    switch (unit) {
        case "Count":
        case "Bytes":
            return new Histogram({ ...props });
        case "Gauge":
            return new Gauge({ ...props });
        case "Milliseconds":
            return new Summary({ ...props });
        default:
            throw new Error(`Unknown unit: ${unit}`);
    }
}