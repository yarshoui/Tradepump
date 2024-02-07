import { App } from "cdktf";
import { Stage, stages } from "./config/stages";
import { ComputeStack } from "./stacks/compute";
import { StreamingStack } from "./stacks/streaming";
import { ServicesStack } from "./stacks/services";

export class TradepumpApp extends App {
  constructor() {
    super();

    for (const stg in stages) {
      const stage = stg as Stage;
      const config = stages[stage];

      if (!config) {
        throw new Error(`Stage config for '${stage}' is not defined`);
      }

      // 1. Setup machines/docker images/ssh keys
      const computeStack = new ComputeStack(this, {
        stage,
        config,
      });
      // 2. deploy kafka + ui
      const streamingStack = new StreamingStack(this, {
        stage,
        config,
        sshKey: computeStack.sshPrivateKey!,
        dockerNetwork: computeStack.dockerNetwork,
      });
      // 3. deploy harvester
      // 4. deploy server
      // 5. deploy client
      new ServicesStack(this, {
        stage,
        config,
        sshKey: computeStack.sshPrivateKey!,
        dockerNetwork: computeStack.dockerNetwork,
        kafkaHost: `${streamingStack.kafkaHost}:${streamingStack.kafkaPort}`,
        databaseUrl: "postgres://",
      });
      // 6. deploy monitoring stack: grafana, prometeus
      // 6.1 Setup alarms and dashboards
      // 7. Setup loadbalancer (nginx/haproxy)
      // 8. Install certificates

    }
  }
}
