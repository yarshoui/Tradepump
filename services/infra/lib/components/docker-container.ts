import {
  Container,
  ContainerConfig,
} from "@cdktf/provider-docker/lib/container";
import { Construct } from "constructs";
import { Stage } from "../config/stages";
import { Network } from "@cdktf/provider-docker/lib/network";

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
interface DockerContainerProps extends ContainerConfig {
  stage: Stage;
  network?: Network;
  logUrl?: string;
}

export class DockerContainer extends Container {
  constructor(scope: Construct, id: string, props: DockerContainerProps) {
    const { stage, network, logUrl, ...config } = props;
    const logging: Pick<
      Writeable<ContainerConfig>,
      "logDriver" | "logOpts"
    > = {};

    if (stage !== "Dev" && logUrl) {
      logging.logDriver = "loki";
      logging.logOpts = {
        "loki-url": `${logUrl}/loki/api/v1/push`,
        "loki-retries": "5",
        "loki-batch-size": "400",
      };
    }

    super(scope, id, {
      networksAdvanced: network
        ? [
            {
              name: network.name,
            },
          ]
        : undefined,
      ...logging,
      ...config,
    });
  }
}
