# Financial Control

A personal finance management app built with **NestJS + Prisma** on the backend and **Angular 20** on the frontend.

## Prerequisites

| Tool | Min version | Install |
|---|---|---|
| [Node.js](https://nodejs.org) | 20+ | `brew install node` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | any | official site |

> Docker is used only for PostgreSQL. The API and frontend run directly on your local Node.

---

## Quick start

```bash
# 1. Clone the repository (--recurse-submodules pulls api + web)
git clone --recurse-submodules <repo-url>
cd financial-control

# 2. Install everything and set up the database (run once)
make setup

# 3. Start the development server
make dev
```

Once `make dev` is running:

| Service | URL |
|---|---|
| Frontend (Angular) | http://localhost:4200 |
| API (NestJS) | http://localhost:3002 |
| API docs (Swagger) | http://localhost:3002/api |

---

## Commands

```bash
make setup   # install deps, start DB, run migrations and seed
make dev     # start DB + API + Web in parallel (with hot reload)
make stop    # stop Docker containers
make reset   # wipe the database and run setup from scratch
```

---

## Project structure

```
financial-control/
├── api/                    # Backend — NestJS + Prisma + PostgreSQL
│   ├── prisma/             # Schema, migrations and seed
│   └── src/
│       ├── modules/        # Feature modules (accounts, transactions, etc.)
│       └── common/         # Shared filters, pipes, decorators
├── web/                    # Frontend — Angular 20 (standalone components)
│   └── src/
│       ├── app/features/   # Pages (dashboard, transactions, transfers, etc.)
│       ├── app/core/       # Services, models, interceptors
│       └── app/shared/     # Reusable components and pipes
└── docker-compose.yml      # Database only
```

---

## Environment variables

`make setup` automatically copies `api/.env.example` → `api/.env`. To customise:

```bash
# api/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/financial_control?schema=public"
PORT=3002
NODE_ENV=development
```

---

## Troubleshooting

**Cannot connect to the database after `make dev`**
```bash
docker compose ps        # check if the container is running
docker compose logs db   # view database logs
```

**Port 5435 already in use**  
Change the host port in `docker-compose.yml` (`5436:5432`) and update `DATABASE_URL` in `api/.env` accordingly.

**Full reset**
```bash
make reset   # drops Docker volumes and runs setup again
```
