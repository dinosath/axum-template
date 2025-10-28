# axum-template

This is a [baker](https://github.com/aliev/baker) template for quickly scaffolding a Rust backend powered by [axum](https://github.com/tokio-rs/axum).

## What does this template do?

- **Simple project:** If you just want a basic project structure, you can generate a minimal backend using axum.
- **Full CRUD application:** If you define your entities in the baker prompts, this template will generate a complete CRUD backend with sea-orm models, controllers, and migrations.

## Getting Started

### 1. Install Baker

Follow the [installation instructions for baker](https://github.com/aliev/baker?tab=readme-ov-file#installation).

### 2. Generate a New Project Using This Template

```sh
baker https://github.com/dinosath/axum-template path-to-dir
```

This will prompt you for configuration options and generate a new project in the specified directory.

## Baker Questions

Below are the configurable questions exposed by `baker.yaml`:

- `project_name`: Name of your application (used for crate name and other identifiers)
- `project_author`: Author metadata
- `project_version`: Initial version
- `project_edition`: Rust edition (default 2021)
- `authentication`: Select auth mechanism (`oauth2` or `none`)
- `database`: Currently only `postgres`
- `db_schema`: PostgreSQL schema where all generated tables will be created. Defaults to `public`.
- `id_type`: Type used for primary keys & foreign keys. Choices:
  - `integer` (default): `SERIAL` PK in SQL, Rust type `i32`
  - `big_integer`: `BIGSERIAL` PK, Rust type `i64`
  - `uuid`: `UUID DEFAULT gen_random_uuid()` PK, Rust type `Uuid`
- `features`: Optional extra features (e.g. `open-telemetry`)
- `protocol`: `rest` or `grpc`
- `crudcrate`: Whether to use crudcrate-generated controllers (only asked when protocol is `rest`)
- `entities`: JSON schema describing your domain entities

## Schema Usage in Migrations

The migration template (`migrations/00001_init_db.sql.baker.j2`) uses `db_schema` and `id_type`:

- Creates schema only if not `public`.
- Chooses PK column form based on `id_type`.
- Foreign keys inherit the chosen PK base type.

Example with `db_schema = app` and `id_type = uuid`:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS app;
CREATE TABLE IF NOT EXISTS app.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
  -- other columns
);
```

Example with `id_type = big_integer`:
```sql
id BIGSERIAL PRIMARY KEY
```
Example with `id_type = integer`:
```sql
id SERIAL PRIMARY KEY
```

Many‑to‑many join tables and many‑to‑one foreign keys adopt the same underlying type (`UUID`, `BIGINT`, or `INTEGER`).

## Primary Key / Foreign Key Helper Macros

Macros added in `macros.jinja`:
- `pk_rust_type(id_type)` → `Uuid | i64 | i32`
- `pk_sql_type(id_type)` → `UUID | BIGINT | INTEGER`
- `pk_column_definition(id_type)` → Full SQL PK declaration.

(If you extend model/controller templates, reuse these macros for consistency.)

## Why Are Some Structs Red in the IDE?

Many files end with `.baker.j2` and contain Jinja template syntax (`{{ ... }}`, `{% ... %}`) that is not valid Rust until Baker renders them. IDE errors here are expected and harmless; the generated project after running Baker will compile with Cargo.

## Features
- Rust backend powered by axum
- Database support for postgres via sea-orm
- Docker and docker-compose support
- Flexible code generation via baker
- Generate either a minimal project or a full CRUD app based on your entity definitions

## License
MIT