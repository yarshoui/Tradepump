# TradePump

Pump your trading experience.
This repository represents monorepo-like architecture.
Currently it consists of following `services`:
- **client** - Basically UI interface. Client facing web-portal. Make sure it looks beautiful
- **server** - This is an API for UI part. Gives back data that is needed for client. Make sure it's always does that.
- **database** - Represents PostgreSQL database. Store and serve data for API server. Make sure it's efficient and scaleable.
- **harvester** - Gathers and distributes trading data to _database_ and _API server_. Make sure it's [CAP](https://en.wikipedia.org/wiki/CAP_theorem).
- **types** - this is just common folder with data types for all services. Imports common data types and models.

## How to contribute

### Server

API Server is located under `/server` folder.

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
