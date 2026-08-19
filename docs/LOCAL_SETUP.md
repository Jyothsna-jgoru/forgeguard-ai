# Local Setup

## Docker Compose profile

### Requirements

- Docker Engine
- Docker Compose v2
- Ports 8080 and 8000 available

### Start

```bash
cp .env.example .env
docker compose up --build
```

Expected services:

| Service | Address | Health behavior |
|---|---|---|
| Web | `http://localhost:8080` | Nginx serves the Vite bundle and SPA fallback |
| API | `http://localhost:8000` | `/api/v1/health` returns `status: ok` |
| PostgreSQL | internal only | `pg_isready` succeeds before API startup |

The API creates tables and seeds `PAY-1842`, `RUN-2026-0818-0042`, five policy examples, six agent executions, and `APV-0042` on first startup.

### Inspect

```bash
docker compose ps
docker compose logs api
curl http://localhost:8000/api/v1/health
```

### Stop

```bash
docker compose down
```

Use `docker compose down -v` only when you intentionally want to delete the local database volume and restore seed state on the next launch.

## Native frontend

```bash
npm install --prefix apps/web
npm run dev --prefix apps/web
```

Vite serves the site at `http://localhost:5173` by default. The experience is complete without a running API.

## Native API

```bash
python -m venv .venv
```

Activate the environment:

```powershell
# Windows PowerShell
.venv\Scripts\Activate.ps1
```

```bash
# macOS or Linux
source .venv/bin/activate
```

Install and run:

```bash
pip install -r apps/api/requirements-dev.txt
cd apps/api
uvicorn forgeguard.main:app --reload
```

The native default uses `sqlite:///./forgeguard.db`. Set `DATABASE_URL` to use another SQLAlchemy-compatible database.

## Environment variables

| Variable | Purpose | Default behavior |
|---|---|---|
| `DATABASE_URL` | SQLAlchemy connection string | Local SQLite outside Compose |
| `FORGEGUARD_DEMO_MODE` | Keeps runtime in deterministic mode | `true` |
| `FORGEGUARD_CORS_ORIGINS` | Comma-separated browser origins | Vite and local Nginx |
| `POSTGRES_DB` | Compose database name | `forgeguard` |
| `POSTGRES_USER` | Compose database user | `forgeguard` |
| `POSTGRES_PASSWORD` | Compose local database password | Local-only example value |
| `BASE_PATH` | Vite deployment base | `/` locally; repository path in Pages CI |

No model key, GitHub token, payment credential, or secret-manager setting exists.

## Troubleshooting

- **Web starts but nested routes return 404:** use the included Nginx configuration or Vite dev server; both provide SPA fallback.
- **API waits for database:** inspect `docker compose logs db` and confirm the health check passes.
- **Seed state already approved:** remove the local SQLite file or intentionally remove the Compose volume, then restart.
- **Port conflict:** change only the host side of the relevant `ports` mapping.
- **Pages assets are missing:** ensure `BASE_PATH` ends with `/` and matches the repository name.

