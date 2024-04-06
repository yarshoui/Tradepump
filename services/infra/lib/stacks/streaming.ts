import { Image } from "@cdktf/provider-docker/lib/image";
import { Network } from "@cdktf/provider-docker/lib/network";
import { DockerProvider } from "@cdktf/provider-docker/lib/provider";
import { SensitiveFile } from "@cdktf/provider-local/lib/sensitive-file";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { DockerContainer } from "../components/docker-container";
import { StackBaseProps } from "../types/stacks";
import { nstg } from "../utils/common-utils";

interface StreamingStackProps extends StackBaseProps {
  sshPrivateKey: SensitiveFile;
  dockerNetwork: Network;
  logUrl?: string;
}

/**
 * This stack deploys message streamin services such as Kafka.
 * Kafka will help deliver messages from the trade markets in resilient and efficient way.
 */
export class StreamingStack extends TerraformStack {
  kafkaHost: string;
  kafkaPort = 9092;
  kafkaUI: string;

  constructor(scope: Construct, props: StreamingStackProps) {
    super(scope, nstg("streaming", props.stage));
    const isDev = props.stage === "Dev";

    new DockerProvider(this, "docker", {
      host: isDev
        ? undefined
        : `ssh://${props.config.user}@${props.config.host}`,
      sshOpts: isDev ? undefined : ["-i", props.sshPrivateKey.filename],
    });

    this.kafkaHost = this.setupKafka(props);
    this.kafkaUI = this.setupKafkaUI(props);
  }

  setupKafka({ dockerNetwork: network, stage, logUrl }: StreamingStackProps) {
    const hostname = "kafka-server";
    const env = [
      "KAFKA_ENABLE_KRAFT=yes",
      "KAFKA_CFG_NODE_ID=0",
      "KAFKA_CFG_PROCESS_ROLES=controller,broker",
      "KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093",
      "KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT",
      `KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@${hostname}:9093`,
      "KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER",
    ];

    if (stage !== "Prod") {
      // Allow plaintext for non prod
      env.push("ALLOW_PLAINTEXT_LISTENER=yes");
    }

    const image = new Image(this, "kafka-image", {
      name: "bitnami/kafka:latest",
    });
    const dockerContainer = new DockerContainer(this, "kafka", {
      stage,
      network,
      logUrl,
      image: image.imageId,
      name: nstg("kafka", stage),
      hostname,
      volumes: [
        {
          volumeName: nstg("kafka", stage),
          containerPath: "/bitnami/kafka",
        },
      ],
      env,
    });

    return dockerContainer.networkData.get(0).ipAddress;
  }

  setupKafkaUI({ dockerNetwork: network, stage, logUrl }: StreamingStackProps) {
    const image = new Image(this, "kafkaui-image", {
      name: "provectuslabs/kafka-ui",
    });
    const dockerContainer = new DockerContainer(this, "kafka-ui", {
      stage,
      network,
      logUrl,
      image: image.imageId,
      name: nstg("kafka-ui", stage),
      env: [
        "DYNAMIC_CONFIG_ENABLED=true",
        `KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=${nstg("kafka", stage)}:${
          this.kafkaPort
        }`,
      ],
    });

    return `${dockerContainer.networkData.get(0).ipAddress}:8080`;
  }
}
