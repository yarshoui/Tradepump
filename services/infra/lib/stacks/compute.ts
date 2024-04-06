import { Network } from "@cdktf/provider-docker/lib/network";
import { DockerProvider } from "@cdktf/provider-docker/lib/provider";
import { LocalProvider } from "@cdktf/provider-local/lib/provider";
import { SensitiveFile } from "@cdktf/provider-local/lib/sensitive-file";
import { NullProvider } from "@cdktf/provider-null/lib/provider";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { DockerSetup } from "../components/docker-setup";
import { DEPLOY_HOST1 } from "../consts";
import { StackBaseProps } from "../types/stacks";
import { nstg } from "../utils/common-utils";
import { connectionWithPrivateKey } from "../utils/tf-utils";

interface ComputeStackProps extends StackBaseProps {
  sshPrivateKey?: SensitiveFile;
}

/**
 * ComputeStack essentially sets up Tradepump infrastructure with ssh and docker.
 * Can be used with other VMs that has ssh configured.
 */
export class ComputeStack extends TerraformStack {
  dockerNetwork: Network;

  constructor(scope: Construct, props: ComputeStackProps) {
    super(scope, nstg("compute", props.stage));
    const isDev = props.stage === "Dev";

    new NullProvider(this, "null");
    new LocalProvider(this, "local");
    new DockerProvider(this, "docker", {
      host: isDev ? undefined : `ssh://root@${DEPLOY_HOST1}`,
      sshOpts: isDev ? undefined : ["-i", props.sshPrivateKey!.filename],
    });

    // Install docker
    if (isDev) {
      console.log("Skipping installing docker locally (Dev stage)");
    } else {
      if (!props.sshPrivateKey) {
        throw new Error(
          `SSH Private key was not provided: '${props.sshPrivateKey}'`
        );
      }
      const privateKey = connectionWithPrivateKey(this, props.sshPrivateKey.filename);
      new DockerSetup(this, "install-docker", {
        connection: {
          type: "ssh",
          host: props.config.host,
          user: props.config.user,
          privateKey: privateKey.content,
        },
      });
    }
    this.dockerNetwork = new Network(this, "tradepump-network", {
      name: nstg("tradepump-network", props.stage),
    });
  }
}
