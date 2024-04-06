import { createHash } from "crypto";
import { readFileSync } from "fs";
import { Stage } from "../config/stages";

export const getEnvVarOrDie = (key: string): string => {
  const val = process.env[key];
  if (val !== undefined) {
    return val;
  }
  throw new Error(`Environment variable '${key}' is not defined`);
};

export const assertStage = (stage: string): Stage => {
  if (!stage) {
    throw new Error("Stage is not defined");
  }
  const validStages: Stage[] = ["Dev", "Test", "Prod"];

  if (!validStages.includes(stage as any)) {
    throw new Error(
      `Stage '${stage}' is not valid stage. Should be one of: ${validStages.join(
        ", "
      )}`
    );
  }

  return stage as Stage;
};

export const nstg = (name: string, stage: Stage): string =>
  `${name}-${stage}`.toLowerCase();

export const shaString = (str: string): string =>
  createHash("sha256").update(str).digest("hex");

export const shaFile = (filename: string): string =>
  shaString(readFileSync(filename, "utf8"));
