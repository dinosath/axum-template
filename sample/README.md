# Sample Project Generator

This directory contains the configuration to generate a sample project from the axum-template for testing purposes.

## Overview

The `answers.yaml` file contains all the configuration needed to generate a complete project with:

- Multiple entities (Profile, Author, Category, Tag, Article, Comment)
- All relation types demonstrated:
  - **oneToOne**: Author ↔ Profile
  - **oneToMany**: Category → Articles
  - **manyToOne**: Article → Category, Article → Author, Comment → Article
  - **manyToMany**: Article ↔ Tag (via junction table)
- PostgreSQL database with SeaORM
- REST API with auto-generated controllers
- OpenAPI documentation

## Prerequisites

- [Rust](https://rustup.rs/) 1.75+ (2024 edition support)
- [Baker](https://github.com/rogueai/baker) - Template generator

Install baker:

```bash
cargo install baker --locked
```

## Usage

### Generate the Sample Project

Using the helper script:

```bash
chmod +x generate.sh
./generate.sh
```

Or manually with baker:

```bash
baker `.. ./generated --answers answers.yaml
```

### Build and Test

```bash
cd generated
cargo build
cargo test
```

### Run the Application

First, start a PostgreSQL database:

```bash
docker run -d \
  --name sample-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=sample_app \
  -p 5432:5432 \
  postgres:16-alpine
```

Then run the application:

```bash
cd generated
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/sample_app
cargo run
```

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐
│   Profile    │◄─────►│    Author    │
└──────────────┘  1:1  └──────────────┘
                              │
                              │ 1:N
                              ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Category   │──────►│   Article    │◄─────►│     Tag      │
└──────────────┘  1:N  └──────────────┘  M:N  └──────────────┘
                              │
                              │ 1:N
                              ▼
                       ┌──────────────┐
                       │   Comment    │
                       └──────────────┘
```

## Configuration Options

The `answers.yaml` file can be customized to test different template configurations:

| Option | Values | Description |
|--------|--------|-------------|
| `authentication` | `none`, `oidc` | Authentication method |
| `database` | `postgres` | Database type |
| `use_sqlx_migrations` | `true`, `false` | Use sqlx for migrations |
| `id_type` | `integer`, `uuid`, `big_integer` | Primary key type |
| `protocol` | `rest`, `grpc` | API protocol |
| `features` | `open-telemetry`, `helm` | Optional features |

## CI/CD Integration

This sample is used in the GitHub Actions workflow (`.github/workflows/test.yml`) to:

1. Generate a project from the template
2. Verify the generated code compiles
3. Run clippy linting
4. Execute tests

## License

This sample configuration is part of the axum-template project.
