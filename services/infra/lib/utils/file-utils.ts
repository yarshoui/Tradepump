import { createHash } from "crypto";
import { join } from "path";
import { readFileSync, readdirSync } from "fs";

export function* iterateDirectory(folder: string): Generator<string> {
  const files = readdirSync(folder, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* iterateDirectory(join(folder, file.name));
    } else {
      yield join(folder, file.name);
    }
  }
}

export const directoryHash = (folder: string, algorithm = "sha256"): string => {
    const hash = createHash(algorithm);

    for (const file of iterateDirectory(folder)) {
        hash.update(readFileSync(file));
    }

    return hash.digest("hex");
};
