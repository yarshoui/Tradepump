
import fs from 'fs';
import path from 'path';
import { generateKeyPairSync, KeyExportOptions } from 'crypto';

const jwtKeysFolder = process.env.JWT_KEYS_FOLDER || path.resolve(__dirname, '../../keys');
const jwtPrivateKeyPath = path.resolve(jwtKeysFolder, 'jwt.key');
const jwtPublicKeyPath = path.resolve(jwtKeysFolder, 'jwt.pem');

export const getJWTKeys = () => {
  // If physical keys not found generate ephimeral
  if (!fs.existsSync(jwtPrivateKeyPath) || !fs.existsSync(jwtPublicKeyPath)) {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const ops: KeyExportOptions<"der"> = {
      format: "der",
      type: "pkcs1",
    };

    return [privateKey.export(ops), publicKey.export(ops)];
  }
  return [fs.readFileSync(jwtPrivateKeyPath), fs.readFileSync(jwtPublicKeyPath)];
};
