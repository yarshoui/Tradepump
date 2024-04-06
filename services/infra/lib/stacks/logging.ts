import { Container } from "@cdktf/provider-docker/lib/container";
import { Image } from "@cdktf/provider-docker/lib/image";
import { Network } from "@cdktf/provider-docker/lib/network";
import { DockerProvider } from "@cdktf/provider-docker/lib/provider";
import { LocalProvider } from "@cdktf/provider-local/lib/provider";
import { SensitiveFile } from "@cdktf/provider-local/lib/sensitive-file";
import { NullProvider } from "@cdktf/provider-null/lib/provider";
import { Resource } from "@cdktf/provider-null/lib/resource";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { resolve } from "path";
import { DEPLOY_HOST1 } from "../consts";
import { StackBaseProps } from "../types/stacks";
import { nstg, shaFile } from "../utils/common-utils";
import { connectionWithPrivateKey } from "../utils/tf-utils";

interface LoggingStackProps extends StackBaseProps {
  sshPrivateKey: SensitiveFile;
  dockerNetwork: Network;
}

/**
 * Logging stack deploys Grafana Loki for logs.
 * Doing it in a separate stack as it must be in place before running other docker containers
 */
export class LoggingStack extends TerraformStack {
  public logUrl?: string;

  constructor(scope: Construct, props: LoggingStackProps) {
    super(scope, nstg("logging", props.stage));
    const isDev = props.stage === "Dev";

    if (isDev) {
      console.log("Skipping logging setup for dev");
      return;
    }

    new NullProvider(this, "null");
    new LocalProvider(this, "local");
    new DockerProvider(this, "docker", {
      host: isDev ? undefined : `ssh://root@${DEPLOY_HOST1}`,
      sshOpts: isDev ? undefined : ["-i", props.sshPrivateKey.filename],
    });

    // TODO: Figure out how can we reference it if we would deploy it in the separate machine (IP)
    let host = `${nstg("loki", props.stage)}:3100`;

    this.uploadLokiConfigFile(props);
    const image = new Image(this, "loki-image", {
      name: "grafana/loki:2.9.2",
    });
    if (props.stage === "Test") {
      this.runLokiTest(image, props);
    } else if (props.stage === "Prod") {
      // TODO:
      // this.runLokiProd(props);
      console.log(`${props.stage} is not supported yet`);
      this.runLokiTest(image, props);
    }
    this.logUrl = `http://${host}`;
  }

  uploadLokiConfigFile({ stage, config, sshPrivateKey }: LoggingStackProps) {
    const configFileName = `${nstg("loki-config", stage)}.yaml`;
    const source = resolve(__dirname, "../config", configFileName);
    const privateKey = connectionWithPrivateKey(this, sshPrivateKey.filename);
    new Resource(this, "loki-config", {
      triggers: {
        hash: shaFile(source),
      },
      connection: {
        type: "ssh",
        host: config.host,
        user: config.user,
        privateKey: privateKey.content,
      },
      provisioners: [
        {
          type: "remote-exec",
          inline: ["mkdir -p /etc/tradepump"],
        },
        {
          type: "file",
          source,
          destination: `/etc/tradepump/${configFileName}`,
        },
      ],
    });
  }

  /**
   * Test loki will be of one instance and no read/write segregation
   */
  runLokiTest(image: Image, { dockerNetwork, stage }: LoggingStackProps) {
    const dockerContainer = new Container(this, "loki", {
      image: image.imageId,
      name: nstg("loki", stage),
      command: ["-config.file=/etc/loki/config.yaml"],
      volumes: [
        {
          volumeName: nstg("loki-storage", stage),
          containerPath: "/loki",
        },
        {
          hostPath: `/etc/tradepump/${nstg("loki-config", stage)}.yaml`,
          containerPath: "/etc/loki/config.yaml",
        },
      ],
      env: [],
      networksAdvanced: [
        {
          name: dockerNetwork.name,
        },
      ],
    });
    return `${dockerContainer.networkData.get(0).ipAddress}:3100`;
  }
}
