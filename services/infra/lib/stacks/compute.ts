import { Network } from "@cdktf/provider-docker/lib/network";
import { DockerProvider } from "@cdktf/provider-docker/lib/provider";
import { LocalProvider } from "@cdktf/provider-local/lib/provider";
import { SensitiveFile } from "@cdktf/provider-local/lib/sensitive-file";
import { NullProvider } from "@cdktf/provider-null/lib/provider";
import { HcpProvider } from "@cdktf/provider-hcp/lib/provider";
import { DataHcpVaultSecretsSecret } from "@cdktf/provider-hcp/lib/data-hcp-vault-secrets-secret";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { tmpdir } from "os";
import { join } from "path";
import { DockerSetup } from "../components/docker-setup";
import { DEPLOY_HOST1 } from "../consts";
import { StackBaseProps } from "../types/stacks";
import { nstg } from "../utils/common-utils";
import { Stage } from "../config/stages";

interface ComputeStackProps extends StackBaseProps {}

/**
 * ComputeStack essentially sets up Tradepump infrastructure with ssh and docker.
 * Can be used with other VMs that has ssh configured.
 *
 * Following dependencies are required to be installed on the machine for the stack to work.
 * Prerequisites:
 * - docker
 * - nginx
 */
export class ComputeStack extends TerraformStack {
  sshPrivateKey?: SensitiveFile;
  dockerNetwork: Network;

  constructor(scope: Construct, props: ComputeStackProps) {
    super(scope, nstg("compute", props.stage));
    const isDev = props.stage === "Dev";

    new NullProvider(this, "null");
    new LocalProvider(this, "local");

    // Setup SSH
    this.sshPrivateKey = this.setupSSHKeyAndHost(props.stage);

    new DockerProvider(this, "docker", {
      host: isDev ? undefined : `ssh://root@${DEPLOY_HOST1}`,
      sshOpts: isDev ? undefined : [`-i "${this.sshPrivateKey!.filename}"`],
    });

    // Install docker
    if (isDev) {
      console.log("Skipping installing docker locally (Dev stage)");
    } else {
      new DockerSetup(this, "install-docker", {
        connection: {
          type: "ssh",
          host: props.config.host,
          user: props.config.user,
          privateKey: this.sshPrivateKey!.filename,
        },
      });
    }
    this.dockerNetwork = new Network(this, "tradepump-network", {
      name: nstg("tradepump-network", props.stage),
    });
  }

  setupSSHKeyAndHost(stage: Stage) {
    if (stage === "Dev") {
      return undefined;
    }
    if (!process.env.HCP_CLIENT_ID || !process.env.HCP_PROJECT_ID) {
      throw new Error(`HCP environment variables are not defined`);
    }
    new HcpProvider(this, "hcp", {
      clientId: process.env.HCP_CLIENT_ID,
      clientSecret: process.env.HCP_CLIENT_SECRET,
      projectId: process.env.HCP_PROJECT_ID,
    });
    const pvtkey = new DataHcpVaultSecretsSecret(this, "ssh-key-base64", {
      appName: "infrastructure",
      secretName: "ssh_private_key_b64",
    });
    // const keyValue = Buffer.from(pvtkey.secretValue, "base64").toString("utf8");

    // if (!keyValue.includes("BEGIN OPENSSH PRIVATE KEY")) {
    //   console.error(keyValue);
    //   throw new Error("Secret ssh_private_key_b64 does not contain private key");
    // }
    return new SensitiveFile(this, "ssh-key", {
      filename: join(tmpdir(), "hetzner.key"),
      contentBase64: pvtkey.secretValue,
      filePermission: "0600",
    });
  }
}
