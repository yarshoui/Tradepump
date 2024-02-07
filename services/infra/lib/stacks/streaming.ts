import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { DockerProvider } from "@cdktf/provider-docker/lib/provider";
import { Image } from "@cdktf/provider-docker/lib/image";
import { Network } from "@cdktf/provider-docker/lib/network";
import { Container } from "@cdktf/provider-docker/lib/container";
import { SensitiveFile } from "@cdktf/provider-local/lib/sensitive-file";
import { StackBaseProps } from "../types/stacks";
import { nstg } from "../utils/common-utils";

interface StreamingStackProps extends StackBaseProps {
  sshKey: SensitiveFile;
  dockerNetwork: Network;
}

export class StreamingStack extends TerraformStack {
  kafkaHost: string;
  kafkaPort = 9092;
  kafkaUI: string;

  constructor(scope: Construct, props: StreamingStackProps) {
    super(scope, nstg("streaming", props.stage));

    new DockerProvider(this, "docker", {
      host:
        props.stage === "Dev"
          ? undefined
          : `ssh://${props.config.user}@${props.config.host}`,
      sshOpts:
        props.stage === "Dev" ? undefined : [`-i "${props.sshKey.filename}"`],
    });

    this.kafkaHost = this.setupKafka(props);
    this.kafkaUI = this.setupKafkaUI(props);
  }

  setupKafka({ dockerNetwork: network, stage }: StreamingStackProps) {
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
    const dockerContainer = new Container(this, "kafka", {
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
      networksAdvanced: [
        {
          name: network.name,
        },
      ],
    });

    return dockerContainer.networkData.get(0).ipAddress;
  }

  setupKafkaUI({ dockerNetwork: network, stage }: StreamingStackProps) {
    const image = new Image(this, "kafkaui-image", {
      name: "provectuslabs/kafka-ui",
    });
    const dockerContainer = new Container(this, "kafka-ui", {
      image: image.imageId,
      name: nstg("kafka-ui", stage),
      env: [
        "DYNAMIC_CONFIG_ENABLED=true",
        `KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=${nstg("kafka", stage)}:${
          this.kafkaPort
        }`,
      ],
      networksAdvanced: [
        {
          name: network.name,
        },
      ],
    });

    return `${dockerContainer.networkData.get(0).ipAddress}:8080`;
  }
}
