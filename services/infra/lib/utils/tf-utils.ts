import { DataLocalSensitiveFile } from "@cdktf/provider-local/lib/data-local-sensitive-file";
import {
  TerraformOutput,
  TerraformVariable,
  TerraformVariableConfig,
} from "cdktf";
import { Construct } from "constructs";
import { basename } from "path";

export const crossStackVariables = {
  sshPrivateKeyPath: {
    name: "ssh-key-filename",
    config: {
      type: "string",
      description: "Deployment server SSH private key",
    } satisfies TerraformVariableConfig,
  },
} as const;
export type CrossStackVariable = keyof typeof crossStackVariables;

export const exportCrossStackVar = (
  scope: Construct,
  name: CrossStackVariable,
  value: any
) =>
  new TerraformOutput(scope, crossStackVariables[name].name, {
    value,
  });

export const getCrossStackVar = (scope: Construct, name: CrossStackVariable) =>
  new TerraformVariable(
    scope,
    crossStackVariables[name].name,
    crossStackVariables[name].config
  );

export const connectionWithPrivateKey = (scope: Construct, sshKeyFilename: string) => new DataLocalSensitiveFile(scope, basename(sshKeyFilename).replace(/[^\w]+/g, ""), {
  filename: sshKeyFilename,
});
