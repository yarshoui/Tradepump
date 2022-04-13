
import fs from 'fs';
import path from 'path';
import { generateKeyPairSync } from 'crypto';

const jwtKeysFolder = process.env.JWT_KEYS_FOLDER || path.resolve(__dirname, '../../keys');
const jwtPrivateKeyPath = path.resolve(jwtKeysFolder, 'jwt.key');
const jwtPublicKeyPath = path.resolve(jwtKeysFolder, 'jwt.pem');

export const getJWTKeys = (): [Buffer, Buffer] => {
  // If physical keys not found generate ephimeral
  if (!fs.existsSync(jwtPrivateKeyPath) || !fs.existsSync(jwtPublicKeyPath)) {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });

    return [privateKey.export(), publicKey.export()];
  }
  return [fs.readFileSync(jwtPrivateKeyPath), fs.readFileSync(jwtPublicKeyPath)];
};
