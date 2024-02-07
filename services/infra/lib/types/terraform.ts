import { ResourceConfig } from "@cdktf/provider-null/lib/resource";

export type SSHConnection = Extract<ResourceConfig["connection"], {type: "ssh"}>;
