import { App } from "cdktf";
import { Stage, stages } from "./config/stages";
import { ComputeStack } from "./stacks/compute";
import { StreamingStack } from "./stacks/streaming";
import { ServicesStack } from "./stacks/services";
import { SecretsStack } from "./stacks/secrets";
import { LoggingStack } from "./stacks/logging";
import { MonitoringStack } from "./stacks/monitoring";

/**
 * WARNING!
 * TODO:
 * Right now this app has infrastructure and services deployed together. This brings quite tight coupling between two.
 * Infrastructure at this moment (e.g. installing and configuring docker) is set on single machine and not a subject of staging.
 * Services on the other hand can be deployed and configured per stage.
 * We need to split those two concepts into different pipelines.
 * TODO:
 * WARNING!
 */
export class TradepumpApp extends App {
  constructor() {
    super();

    for (const stg in stages) {
      const stage = stg as Stage;
      const config = stages[stage];

      if (!config) {
        throw new Error(`Stage config for '${stage}' is not defined`);
      }
      if (config.skip) {
        console.log(`Skipping ${stage}, as defined in the stage config {skip: true}`);
        continue;
      }
      console.log(`Building '${stage}' stage...`);

      // 1. Setup machines/docker images/ssh keys
      const secretsStack = new SecretsStack(this, {
        stage,
        config,
      });
      const computeStack = new ComputeStack(this, {
        stage,
        config,
        sshPrivateKey: secretsStack.sshPrivateKey,
      });
      const loggingStack = new LoggingStack(this, {
        stage,
        config,
        sshPrivateKey: secretsStack.sshPrivateKey!,
        dockerNetwork: computeStack.dockerNetwork,
      });
      // 2. deploy kafka + ui
      const streamingStack = new StreamingStack(this, {
        stage,
        config,
        sshPrivateKey: secretsStack.sshPrivateKey!,
        dockerNetwork: computeStack.dockerNetwork,
        logUrl: loggingStack.logUrl,
      });
      // 3. deploy harvester
      // 4. deploy server
      // 5. deploy client
      new ServicesStack(this, {
        stage,
        config,
        sshPrivateKey: secretsStack.sshPrivateKey!,
        dockerNetwork: computeStack.dockerNetwork,
        kafkaHost: `${streamingStack.kafkaHost}:${streamingStack.kafkaPort}`,
        databaseUrl: "postgres://",
        logUrl: loggingStack.logUrl,
      });
      // 6. deploy monitoring stack: grafana, prometeus
      // 6.1 Setup alarms and dashboards
      new MonitoringStack(this, {
        stage,
        config,
        sshPrivateKey: secretsStack.sshPrivateKey!,
        network: computeStack.dockerNetwork,
        logUrl: loggingStack.logUrl,
      });
      // 7. Setup loadbalancer (nginx/haproxy)
      // 8. Install certificates
    }
  }
}
