# Financial Control

A personal finance management app built with **NestJS + Prisma** on the backend and **Angular 20** on the frontend.

## Prerequisites

| Tool | Min version | Install |
|---|---|---|
| [Node.js](https://nodejs.org) | 20+ | `brew install node` / [nodejs.org](https://nodejs.org) |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | any | official site |

> Docker is used only for PostgreSQL. The API and frontend run directly on your local Node.

---

## Quick start

```bash
# 1. Clone the repository (--recurse-submodules pulls api + web)
git clone --recurse-submodules https://github.com/Jerferson/financial-control.git
cd financial-control

# 2. Install everything and set up the database (run once)
make setup          # macOS / Linux
npm run setup       # Windows (PowerShell / CMD)

# 3. Start the development server
make dev            # macOS / Linux
npm run dev         # Windows
```

Once running:

| Service | URL |
|---|---|
| Frontend (Angular) | http://localhost:4200 |
| API (NestJS) | http://localhost:3002 |
| API docs (Swagger) | http://localhost:3002/api |

---

## Commands

| Action | macOS / Linux | Windows |
|---|---|---|
| First-time setup | `make setup` | `npm run setup` |
| Start dev servers | `make dev` | `npm run dev` |
| Stop database | `make stop` | `npm run stop` |
| Full reset | `make reset` | `npm run stop && npm run setup` |

---

## Project structure

```
financial-control/
├── api/                    # Backend — NestJS + Prisma + PostgreSQL (submodule)
│   ├── prisma/             # Schema, migrations and seed
│   └── src/
│       ├── modules/        # Feature modules (accounts, transactions, etc.)
│       └── common/         # Shared filters, pipes, decorators
├── web/                    # Frontend — Angular 20 (submodule)
│   └── src/
│       ├── app/features/   # Pages (dashboard, transactions, transfers, etc.)
│       ├── app/core/       # Services, models, interceptors
│       └── app/shared/     # Reusable components and pipes
├── scripts/setup.js        # Cross-platform setup script
└── docker-compose.yml      # Database only
```

---

## Environment variables

Setup automatically copies `api/.env.example` → `api/.env`. The default values work out of the box with the provided `docker-compose.yml`.

To customise, edit `api/.env` after setup:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/financial_control?schema=public"
PORT=3002
NODE_ENV=development
```

---

## Troubleshooting

**`make` not found (Windows)**  
Use the `npm run` equivalents shown in the commands table above, or install `make` via [Chocolatey](https://chocolatey.org): `choco install make`.

**Cannot connect to the database**
```bash
docker compose ps        # check if the container is running
docker compose logs db   # view database logs
```

**Port 5435 already in use**  
Change the host port in `docker-compose.yml` (`5436:5432`) and update `DATABASE_URL` in `api/.env` accordingly.

**Submodules are empty after cloning**
```bash
git submodule update --init --recursive
```

**Full reset**
```bash
make reset          # macOS / Linux
npm run stop && npm run setup   # Windows
```
