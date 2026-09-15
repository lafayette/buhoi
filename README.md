# buhoi

Because drunk people can create web apps too.

[![main](https://github.com/lafayette/buhoi/actions/workflows/main.yml/badge.svg)](https://github.com/lafayette/buhoi/actions/workflows/main.yml)
[![Coverage Status](https://coveralls.io/repos/github/lafayette/buhoi/badge.svg?branch=master)](https://coveralls.io/github/lafayette/buhoi?branch=master)

Buhoi is an application server allowing you to write robust full-featured web-applications (with background tasks support) within tight timeframes.

[![logo](./pxfuel.jpg)](https://www.pxfuel.com/en/desktop-wallpaper-xquxf)

## env

| name | required | purpose | format | example |
| --- | --- | --- | --- | --- |
| BUHOI_CERTS_PATH | production | path to directory with ssl certificates, make sure you have dhparams there (`openssl dhparam -out dhparam.pem 4096`) | /dir | /var/lib/letsencrypt/my.site.com |
| BUHOI_PORTS | no | overrides web server ports (to listen on 80, 443 you need to `setcap 'cap_net_bind_service=+ep' /path/to/node`) | http;https | 3000;3001 |
| BUHOI_PROXIED | no | serves the application itself when TLS is terminated by a proxy, otherwise outside development and without certificates only the letsencrypt webroot is served | any value | 1 |
| BUHOI_WEBROOT | no | directory served at `/.well-known/acme-challenge` | /dir | /var/www |
| BUHOI_KEEP_ALIVE_TIMEOUT | no | keep-alive timeout of the web server, 0 means none | milliseconds | 65000 |
| BUHOI_DISABLE_WEB | no | does not start the web server | any value | 1 |
| BUHOI_DISABLE_TASKS | no | does not start the task server | any value | 1 |
| BUHOI_DISABLE_COMPRESSION | no | does not use the compression middleware | any value | 1 |
| BUHOI_DISABLE_WEBPACK_DEV_MIDDLEWARE | no | does not mount webpack dev and hot middleware in development | any value | 1 |
| BUHOI_PG | no | PostgreSQL connection string, if provided then a knex instance is created and exposed | connection string | postgres://user:password@host:port/db |
| BUHOI_PG_RO | no | read-only PostgreSQL connection string, exposed as `pg.ro` | connection string | postgres://user:password@host:port/db |
| BUHOI_PG_POOL | no | size of connection pool for PostgreSQL | integer | 100 |
| BUHOI_APP | no | application name, enables `pg.modify` which sets `<name>.current_user_id` for the transaction | name | myapp |
| BUHOI_MQ | no | RabbitMQ connection string, if provided then an mqu instance is created and exposed | connection string | amqp://user:password@host:port/vhost |
| BUHOI_PERSISTENT_EVENTS | no | consumes every task event as persistent, as if each task declared `persistent` | any value | 1 |
| BUHOI_REDIS | no | if provided, caching is enabled | redis://host:port | redis://localhost:6379 |
| BUHOI_AUTH_CACHE_DURATION | no | RPC authentication cache duration | time in human readable format | 1 minute |
| BUHOI_MAX_INPUT_SIZE | no | max size of RPC request | size | 10mb |
| BUHOI_SLACK | no | slack token, channel and icon to post error messages | token;channel;icon | xoxb-...;alerts;:hideyourpain: |
| BUHOI_TELEGRAM | no | telegram bot token and chat id to post error messages | botToken;chatId | 123456:AA...;-1001234567890 |
| BUHOI_MATTERMOST | no | mattermost incoming webhook url to post error messages, with optional channel, username and icon overriding the webhook defaults | url;channel;username;icon | https://chat.example.com/hooks/xxxxxxxx;alerts;buhoi;:robot_face: |
| BUHOI_LOGSTASH | no | logstash socket to send each log message | udp://ip:port or tcp://ip:port | udp://192.168.1.10:5000 |

## branches

- `master` — current Node.js, CI runs on Node 24.
- `legacy` — Node.js 8.

Both pin [totlog](https://github.com/lafayette/totlog) by commit: `master` follows totlog's `master`,
`legacy` follows totlog's `legacy`. See [AGENTS.md](AGENTS.md) before changing either.
