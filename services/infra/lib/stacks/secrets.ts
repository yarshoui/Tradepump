import { DataHcpVaultSecretsSecret } from "@cdktf/provider-hcp/lib/data-hcp-vault-secrets-secret";
import { HcpProvider } from "@cdktf/provider-hcp/lib/provider";
import { LocalProvider } from "@cdktf/provider-local/lib/provider";
import { SensitiveFile } from "@cdktf/provider-local/lib/sensitive-file";
import { NullProvider } from "@cdktf/provider-null/lib/provider";
import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { tmpdir } from "os";
import { join } from "path";
import { Stage } from "../config/stages";
import { StackBaseProps } from "../types/stacks";
import { nstg } from "../utils/common-utils";

interface SecretsStackProps extends StackBaseProps {}

/**
 * This stack should go first as it sets up all necessary keys and secrets
 * that will be resolved by terraform once stack is deployed.
 */
export class SecretsStack extends TerraformStack {
  public sshPrivateKey?: SensitiveFile;

  constructor(scope: Construct, props: SecretsStackProps) {
    super(scope, nstg("secrets", props.stage));

    new NullProvider(this, "null");
    new LocalProvider(this, "local");

    // Setup SSH
    this.sshPrivateKey = this.setupSSHKeyAndHost(props.stage);
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

    const filename = join(tmpdir(), "server.key");

    return new SensitiveFile(this, "ssh-key", {
      filename,
      contentBase64: pvtkey.secretValue,
      filePermission: "0600",
    });
  }
}
