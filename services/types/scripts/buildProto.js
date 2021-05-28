const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const resolveNPMBin = execFile => path.resolve(__dirname, '..', 'node_modules', '.bin', execFile);
const protoPath = fileName => path.resolve(__dirname, '..', 'protobuf', fileName);
const srcPath = fileName => path.resolve(__dirname, '..', 'src', fileName);

try {
  fs.readdirSync(path.resolve(__dirname, '..', 'protobuf')).forEach(fileName => {
    const cmd = [
      resolveNPMBin('pbjs'),
      '--ts',
      srcPath(path.basename(fileName, '.proto') + '.ts'),
      protoPath(fileName),
    ];
    execSync(cmd.join(' '));
  });
} catch (err) {
  if (err.signal) {
    console.error(err.stdout.toString());
    console.error(err.stderr.toString());
  } else {
    console.error(err);
  } 
}
