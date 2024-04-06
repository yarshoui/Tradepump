import { DEPLOY_HOST1 } from "../consts";

export type Stage = "Dev" | "Test" | "Prod";

export interface StageConfig {
    host: string;
    user: string;
    skip?: boolean;
}

export const stages: { [key in Stage]?: StageConfig } = {
    Dev: {
        // Just a stub. no connection required locally
        host: "127.0.0.1",
        user: process.env.USER ?? "root",
        // Let is skip for now, and decide on how to test tf locally after
        skip: true,
    },
    Test: {
        host: DEPLOY_HOST1,
        user: "root",
    },
    Prod: {
        host: DEPLOY_HOST1,
        user: "root",
    },
}
