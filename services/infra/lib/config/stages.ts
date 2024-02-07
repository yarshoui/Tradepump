import { DEPLOY_HOST1 } from "../consts";

export type Stage = "Dev" | "Test" | "Prod";

export interface StageConfig {
    host: string;
    user: string;
}

export const stages: { [key in Stage]?: StageConfig } = {
    Dev: {
        // Just a stub. no connection required locally
        host: "127.0.0.1",
        user: process.env.USER ?? "root",
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
