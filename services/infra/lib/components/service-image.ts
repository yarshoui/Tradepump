import { Image } from "@cdktf/provider-docker/lib/image";
import { Construct } from "constructs";
import { resolve } from "path";
import { Stage } from "../config/stages";
import { existsSync } from "fs";
import { RegistryImage } from "@cdktf/provider-docker/lib/registry-image";
import { directoryHash } from "../utils/file-utils";

interface ServiceImageProps {
    serviceName: "harvester" | "server" | "client";
    stage: Stage;
    /**
     * @default linux/amd64
     */
    platform?: string;
}

export class ServiceImage extends Construct {
    public image: Image;

    constructor(scope: Construct, id: string, props: ServiceImageProps) {
        super(scope, id);

        const { serviceName, stage, platform = "linux/amd64" } = props;
        const folder = resolve(__dirname, "../../../", serviceName);
        const tag = stage.toLowerCase();

        if (!existsSync(resolve(folder, "build"))) {
            throw new Error(`Build ${serviceName} first`);
        }

        this.image = new Image(this, `${serviceName}-image`, {
            name: serviceName,
            buildAttribute: {
                context: folder,
                platform,
                tag: [`registry.gitlab.com/tradepump/${serviceName}:${tag}`],
            },
            triggers: {
                artifactHash: directoryHash(resolve(folder, "build")),
            },
        });

        new RegistryImage(this, `${serviceName}-registry-image`, {
            name: `registry.gitlab.com/tradepump/${serviceName}:${tag}`,
            triggers: {
                imageHash: this.image.imageId,
            },
            keepRemotely: true,
        });
    }
}