# Server

Tradepump API server

## Json web token auth

Server uses [jwt](https://jwt.io/) authentication with RSA256 algorithm with 2048 key length.<br>
Each time you start a server a new key pair will be generated with help of [crypto.generateKeyPairSync](https://nodejs.org/api/crypto.html#crypto_crypto_generatekeypairsync_type_options) method. This means each time you restart a server, all sessions will be invalidated.<br>
If you want to generate static keypair, use openssl.
```sh
openssl genrsa -out jwt.key 2048
openssl rsa -in jwt.key -pubout -out jwt.pem
```
Once generated, create `keys` folder under your project root, if doesn't exists yet, and put keys inside this folder.
Keys names must persist.

## Environment variables

| Name | Description | Default |
| ---- | ----------- | ------- |
| IP | IP or hostname to listen on | 127.0.0.1 |
| PORT | Port to listen on | 8080 |
| JWT_KEYS_FOLDER | Json Web Token keys folder containing `jwt.key` and `jwt.pem`. | `<project root>/keys` |
| DATABASE_URL | Database URL | postgres://master:1234qwert=@localhost:5432/tradepump |
| ADMIN_PASSWORD | Set admin password in database | 1234qwert= |

<br>

### Running in Docker

To build docker image locally, follow those steps:
1. Go to root of the project
2. Build client side statics with `npm run build`
3. Build docker image with `docker build -t tradepump .` (mind the dot in the end)
4. Run docker container with `docker run --rm -d -p 8080:8080 tradepump`
5. Go to http://127.0.0.1:8080/

### Running docker container using static JWT keys

1. Generate the keys as described in [Json web token auth](#json-web-token-auth) section.
2. Create `keys` folder. `mkdir keys`
3. Run docker container with ``docker run --rm -d -p 8080:8080 -v `pwd`/keys:/app/keys tradepump``
