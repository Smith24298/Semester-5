# FSD Practical 8: MySQL and MongoDB

This practical demonstrates the same PG Finder property record in two database systems:

- `mysql/app.js` uses `mysql2` to create a relational `properties` table, insert a sample record when needed, and query rows.
- `mongodb/app.js` uses the MongoDB driver to upsert a sample document and query Ahmedabad properties sorted by rent.

## Requirements

- Node.js 18+
- Docker Desktop or Docker Engine

## Install

```bash
npm install
```

## Start databases

The existing Compose file starts MySQL and phpMyAdmin. MongoDB can be started alongside them with:

```bash
docker compose up -d mysql mongodb phpmyadmin
```

## Run examples

```bash
npm run mysql
npm run mongodb
```

phpMyAdmin is available at `http://localhost:8080`.

## Default connections

MySQL uses the Compose credentials: database `myapp`, user `appuser`, password `apppassword`, port `3306`.

MongoDB uses `mongodb://127.0.0.1:27017` and database `pg_finder`.

Both examples support environment variables for changing connection details.
