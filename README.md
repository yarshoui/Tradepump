# TradePump

Pump your trading experience.

## How to contribute

### Server

API Server is located under `/server` folder.

#### Json web token auth

Server uses [jwt](https://jwt.io/) authentication with RSA256 algorithm with 2048 key length.<br>
Each time you start a server a new key pair will be generated with help of [crypto.generateKeyPairSync](https://nodejs.org/api/crypto.html#crypto_crypto_generatekeypairsync_type_options) method. This means each time you restart a server, all sessions will be invalidated.<br>
If you want to generate static keypair, use openssl.
```sh
openssl genrsa -out jwt.key 2048
openssl rsa -in jwt.key -pubout -out jwt.pem
```
Once generated, create `keys` folder under your project root, if doesn't exists yet, and put keys inside this folder.
Keys names must persist.

#### Environment variables

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

#### Running docker container using static JWT keys

1. Generate the keys as described in [Json web token auth](#json-web-token-auth) section.
2. Create `keys` folder. `mkdir keys`
3. Run docker container with ``docker run --rm -d -p 8080:8080 -v `pwd`/keys:/app/keys tradepump``

### Database

Database located under `/database` folder.<br>
The structure of the project is
```
|- docker-entripoint-initdb.d/ # Folder with sql files to apply
|- pgadmin4\ # PGAdmin4 related folder for local development
|  |- config # pgadmin4 configuration files
|  |- storage # Folder to mount with container for pgadmin save data
|- docker-compose.yml # Docker compose file for local development
```

### Harvester

This service goal is to connect to third party services like Kraken, Bitfinex, collect trading information, store it into the database for historical data and stream online data to website.

Idea of trading stream and historical data is described in the followind diagram.
We use RabbitMQ as a message queue service.

![Trading Data](./docs/trading_stream.png)
