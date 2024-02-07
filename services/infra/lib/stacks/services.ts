import { Network } from "@cdktf/provider-docker/lib/network";
import { DockerProvider } from "@cdktf/provider-docker/lib/provider";
import { SensitiveFile } from "@cdktf/provider-local/lib/sensitive-file";
import { Container } from "@cdktf/provider-docker/lib/container";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { StackBaseProps } from "../types/stacks";
import { getEnvVarOrDie, nstg } from "../utils/common-utils";
import { ServiceImage } from "../components/service-image";

interface ServicesStackProps extends StackBaseProps {
  sshKey: SensitiveFile;
  dockerNetwork: Network;
  kafkaHost: string;
  databaseUrl: string;
}

export class ServicesStack extends TerraformStack {
  constructor(scope: Construct, props: ServicesStackProps) {
    super(scope, nstg("services", props.stage));

    new DockerProvider(this, "docker", {
      host:
        props.stage === "Dev"
          ? undefined
          : `ssh://${props.config.user}@${props.config.host}`,
      sshOpts:
        props.stage === "Dev" ? undefined : [`-i "${props.sshKey.filename}"`],
      registryAuth: [
        {
          address: "registry.gitlab.com",
          username: "infra", // gitlab+deploy-token-{n}
          password: getEnvVarOrDie("TRADEPUMP_DEPLOY_TOKEN"),
        },
      ],
    });
    this.setupHarvester(props);
    this.setupServer(props);
    this.setupClient(props);
  }

  setupHarvester({ dockerNetwork: network, stage }: ServicesStackProps) {
    // Defined in the streaming stack. Assuming containers are running under the same network
    const kafkaHost = nstg("kafka", stage);
    const harvesterImage = new ServiceImage(this, "harvester-image", {
      serviceName: "harvester",
      stage,
    });

    new Container(this, "harvester", {
      image: harvesterImage.image.imageId,
      name: nstg("harvester", stage),
      env: [`MESSAGE_QUEUE_URL=${kafkaHost}:9092`, "LOG_LEVEL=INFO"],
      networksAdvanced: [
        {
          name: network.name,
        },
      ],
    });
  }

  setupServer({ dockerNetwork: network, stage }: ServicesStackProps) {
    // Defined in the streaming stack. Assuming containers are running under the same network
    const kafkaHost = nstg("kafka", stage);
    const serverImage = new ServiceImage(this, "server-image", {
      serviceName: "server",
      stage,
    });

    new Container(this, "server", {
      image: serverImage.image.imageId,
      name: nstg("server", stage),
      env: [
        "IP=0.0.0.0",
        "PORT=8080",
        // Database is required for the server for now, but let if fail for now, as we do not deploy postgres.
        // It is not a good security to pass password for the database in the env variable.
        // We can use Hashicorp Vault Secrets for that to store passwords. It allows up to 50 free secrets. (1 we use for private key)
        "DATABASE_URL=postgres://master:admin@database:5432/tradepump",
        `KAFKA_URL=${kafkaHost}:9092`,
        "LOG_LEVEL=debug",
      ],
      networksAdvanced: [
        {
          name: network.name,
        },
      ],
    });
  }

  setupClient({ dockerNetwork: network, stage }: ServicesStackProps) {
    // Defined in the streaming stack. Assuming containers are running under the same network
    const serverHost = nstg("server", stage);
    const serverImage = new ServiceImage(this, "client-image", {
      serviceName: "client",
      stage,
    });

    new Container(this, "client", {
      image: serverImage.image.imageId,
      name: nstg("client", stage),
      env: [
        `SERVER_URL: http://${serverHost}:8080`,
      ],
      networksAdvanced: [
        {
          name: network.name,
        },
      ],
    });
  }
}
