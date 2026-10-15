# PG Finder Authentication and Access Control API

This standalone API demonstrates registration, login, JWT authentication, and role-based access control for the PG Finder application design from Practical 7. It is intentionally not connected to the Vue frontend.

## Setup

```bash
npm install
docker compose -f ../prac8/docker-compose.yml up -d mongodb
npm start
```

The API runs at `http://localhost:3010`.

Environment variables:

- `MONGODB_URI`: MongoDB connection string.
- `MONGODB_DATABASE`: database name, default `pg_finder_auth`.
- `JWT_SECRET`: secret used to sign login tokens.
- `OWNER_REGISTRATION_KEY`: key required to create an owner account, default `owner-demo-key`.

## Endpoints

### Register as viewer

```http
POST /api/auth/register
Content-Type: application/json

{"name":"Asha Viewer","email":"asha@example.com","password":"secret123"}
```

### Register as owner

Use the same JSON body with `POST /api/auth/register-owner` and the header `x-owner-registration-key: owner-demo-key`.

### Login

```http
POST /api/auth/login
Content-Type: application/json

{"email":"asha@example.com","password":"secret123"}
```

Copy the returned token into `Authorization: Bearer <token>`.

### Add a property

```http
POST /api/properties
Authorization: Bearer <owner-token>
Content-Type: application/json

{"propertyName":"Green Valley PG","city":"Ahmedabad","monthlyRent":8500,"description":"Wi-Fi and meals","facilities":["wifi","meals"]}
```

The endpoint returns `401` for missing or invalid tokens and `403` for an authenticated viewer. Only an authenticated owner receives `201 Created`.
