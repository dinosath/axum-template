# axum-template

This is a [baker](https://github.com/aliev/baker) template for quickly scaffolding a Rust backend powered by [axum](https://github.com/tokio-rs/axum).

## What does this template do?

- **Simple project:** If you just want a basic project structure, you can generate a minimal backend (with or without a frontend) using springrs.
- **Full CRUD application:** If you define your entities in the baker prompts, this template will generate a complete CRUD backend with sea-orm models, controllers created by [crudcrate](https://github.com/evanjt/crudcrate), migrations and a matching frontend for managing your data.

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
- `db_schema`: PostgreSQL schema where all generated tables will be created. Defaults to `public`. If you set a different value (e.g. `app`), the migration template will create it if it does not already exist and all tables/foreign keys will be namespaced under that schema.
- `features`: Optional extra features (e.g. `open-telemetry`)
- `protocol`: `rest` or `grpc`
- `crudcrate`: Whether to use crudcrate-generated controllers (only asked when protocol is `rest`)
- `entities`: JSON schema describing your domain entities

## Schema Usage in Migrations

The migration template (`migrations/00001_init_db.sql.baker.j2`) now uses the `db_schema` answer instead of deriving a schema name from the project name. It will:

1. Always enable the `pgcrypto` extension.
2. Conditionally create the schema if it is not `public`.
3. Qualify all table and foreign key references with the chosen schema.

Example (with `db_schema = app`):

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS app;
CREATE TABLE IF NOT EXISTS app.users (...);
```

If you leave it as `public`, the schema creation line is omitted but tables are still created under `public`.

## Why Are Some Structs Red in the IDE?

Many files in this repository end with `.baker.j2` and contain Jinja template syntax (`{{ ... }}`, `{% ... %}`) that is not valid Rust until Baker renders them. Your IDE (e.g. RustRover) tries to parse these template files as pure Rust and highlights placeholders or partially generated structs as errors (red). This is expected and harmless.

When you actually generate a project (`baker <template> <dest>`), the rendered output will be plain `.rs` files without template markers, and `cargo build` will succeed normally. So:

- Red highlights in template files ≠ real compile errors.
- Trust `cargo build` in the generated project for actual Rust correctness.

## Features
- Rust backend powered by axum
- Database support for postgres via sea-orm
- Docker and docker-compose support
- Flexible code generation via baker
- Generate either a minimal project or a full CRUD app based on your entity definitions

## License
MIT