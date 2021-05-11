
const fs = require('fs');
const path = require('path');
const { generateKeyPairSync } = require('crypto');

const jwtKeysFolder = process.env.JWT_KEYS_FOLDER || path.resolve(__dirname, '../../keys');
const jwtPrivateKeyPath = path.resolve(jwtKeysFolder, 'jwt.key');
const jwtPublicKeyPath = path.resolve(jwtKeysFolder, 'jwt.pem');

const getJWTKeys = () => {
  // If physical keys not found generate ephimeral
  if (!fs.existsSync(jwtPrivateKeyPath) || !fs.existsSync(jwtPublicKeyPath)) {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });

    return [privateKey, publicKey];
  }
  return [fs.readFileSync(jwtPrivateKeyPath), fs.readFileSync(jwtPublicKeyPath)];
};

module.exports = getJWTKeys;
