import { writeFileSync, readFileSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import { Console } from "console";
import { parseSchema } from "../lib/pbjs";

const log = new Console(process.stdout, process.stderr);

const protoPathResolve = fileName => resolve(__dirname, '..', 'protobuf', fileName);
const srcPathResolve = fileName => resolve(__dirname, '..', 'src', fileName.replace(".proto", ".ts"));

try {
  readdirSync(resolve(__dirname, '..', 'protobuf')).forEach(fileName => {
    const protofile = protoPathResolve(fileName);
    const stat = statSync(protofile);

    if (!stat.isFile()) {
      log.debug(`Entity '${fileName}' is not a file, skipping`);
      return;
    }
    // Skip non-proto files and shared files
    if (!fileName.endsWith(".proto") || fileName.endsWith(".import.proto")) {
      log.debug(`File '${fileName}' is not proto file or import file, skipping`);
      return;
    }
    const tsfile = srcPathResolve(fileName);
    log.info(`Parsing file '${fileName}' to ${tsfile}`);
    const contents = readFileSync(protofile, "utf8");
    const schema = parseSchema(contents);

    writeFileSync(tsfile, schema.toTypeScript({
      "./types.proto": "./types",
    }));
    log.info(`Done generating ts file for '${fileName}'`);
  });
} catch (err) {
  log.error(err);
}
