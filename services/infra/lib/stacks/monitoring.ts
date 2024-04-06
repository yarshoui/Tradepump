import { Image } from "@cdktf/provider-docker/lib/image";
import { Network } from "@cdktf/provider-docker/lib/network";
import { DockerProvider } from "@cdktf/provider-docker/lib/provider";
import { File } from "@cdktf/provider-local/lib/file";
import { LocalProvider } from "@cdktf/provider-local/lib/provider";
import { SensitiveFile } from "@cdktf/provider-local/lib/sensitive-file";
import { NullProvider } from "@cdktf/provider-null/lib/provider";
import { Resource } from "@cdktf/provider-null/lib/resource";
import { Fn, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { tmpdir } from "os";
import { resolve } from "path";
import { GrafanaProvider } from "../../.gen/providers/grafana/provider";
import { DockerContainer } from "../components/docker-container";
import { DEPLOY_HOST1 } from "../consts";
import { StackBaseProps } from "../types/stacks";
import { nstg } from "../utils/common-utils";
import { connectionWithPrivateKey } from "../utils/tf-utils";

interface MonitoringStackProps extends StackBaseProps {
  sshPrivateKey: SensitiveFile;
  network: Network;
  logUrl?: string;
}

/**
 * Monitoring stack deploys means to track application activity and alarm on issues.
 */
export class MonitoringStack extends TerraformStack {
  constructor(scope: Construct, props: MonitoringStackProps) {
    super(scope, nstg("monitoring", props.stage));
    const isDev = props.stage === "Dev";

    new GrafanaProvider(this, "grafana");
    new LocalProvider(this, "local");
    new NullProvider(this, "null");
    new DockerProvider(this, "docker", {
      host: isDev ? undefined : `ssh://root@${DEPLOY_HOST1}`,
      sshOpts: isDev ? undefined : ["-i", props.sshPrivateKey.filename],
    });

    const configSha = this.uploadGrafanaConfigs(props);
    this.runGrafana(props, configSha);
  }

  uploadGrafanaConfigs({
    stage,
    config,
    sshPrivateKey,
    logUrl,
  }: MonitoringStackProps) {
    if (stage === "Dev") {
      console.log("TODO: Implement dev stage config");
      return "";
    }
    const datasourcesFile = `${nstg("datasources", stage)}.yaml`;
    const source = resolve(__dirname, "../config/grafana", datasourcesFile);
    const privateKey = connectionWithPrivateKey(this, sshPrivateKey.filename);

    const dsfile = new File(this, "grafana-datasource-local", {
      filename: resolve(tmpdir(), `${nstg("grafana-config", stage)}.yaml`),
      content: Fn.templatefile(source, { logUrl }),
    });

    new Resource(this, "grafana-datasources", {
      triggers: {
        hash: dsfile.contentBase64Sha256,
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
          inline: ["mkdir -p /etc/tradepump/grafana/provisioning/datasources"],
        },
        {
          type: "file",
          source: dsfile.filename,
          destination: `/etc/tradepump/grafana/provisioning/datasources/${datasourcesFile}`,
        },
      ],
    });

    return dsfile.contentSha512;
  }

  runGrafana({ network, stage, logUrl }: MonitoringStackProps, configSha: string) {
    const image = new Image(this, "grafana-image", {
      name: "grafana/grafana-oss",
      triggers: {
        configSha,
      },
    });
    const env: string[] =
      stage === "Test"
        ? ["GF_AUTH_ANONYMOUS_ENABLED=true", "GF_AUTH_ANONYMOUS_ORG_ROLE=Admin"]
        : [];
    const dockerContainer = new DockerContainer(this, "grafana-container", {
      stage,
      network,
      logUrl,
      image: image.imageId,
      name: nstg("grafana", stage),
      volumes: [
        {
          volumeName: nstg("grafana-data", stage),
          containerPath: "/var/lib/grafana",
        },
        {
          hostPath: `/etc/tradepump/grafana/provisioning/datasources/${nstg(
            "datasources",
            stage
          )}.yaml`,
          containerPath: "/etc/grafana/provisioning/datasources/ds.yaml",
        },
      ],
      env,
    });
    return `${dockerContainer.networkData.get(0).ipAddress}:3000`;
  }
}
