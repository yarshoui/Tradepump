# Harvester

Service that grabs third party trade information and pushes it to database and streams it to queue service

## Environment variables

| Name | Description | Default value |
| ---- | ----------- | ------------- |
| LOG_LEVEL | log4js logging level. Can be one of: `all, trace, debug, info, warn, error, fatal, mark, off` | `info` |
| RABBITMQ_URL | URL to queue service | `rabbitmq://guest:guest@localhost` |
| TRADING_PAIRS | Comma separated list of trading pairs. Full list in `./lib/common/CurrencyPair.ts` file | `BTC/EUR,BTC/USD,BTC/USDT` |
