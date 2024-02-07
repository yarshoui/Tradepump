import { Resource } from "@cdktf/provider-null/lib/resource";
import { Construct } from "constructs";
import { SSHConnection } from "../types/terraform";

export interface DockerSetupProps {
  connection: SSHConnection;
}

/**
 * Installs docker to remote host following official guide here:
 * @see https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository
 */
export class DockerSetup extends Construct {
  constructor(scope: Construct, id: string, props: DockerSetupProps) {
    super(scope, id);

    new Resource(this, "docker-setup", {
      connection: props.connection,
      provisioners: [
        {
          type: "remote-exec",
          inline: [
            "sudo apt-get update -y",
            "sudo apt-get install -y ca-certificates curl",
            "sudo install -m 0755 -d /etc/apt/keyrings",
            "sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc",
            "sudo chmod a+r /etc/apt/keyrings/docker.asc",
            `echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`,
            "sudo apt-get update -y",
            "sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin",
          ],
        },
      ],
    });
  }
}
