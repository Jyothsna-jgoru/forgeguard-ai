# Infrastructure

ForgeGuard uses a deliberately small local topology:

- `web`: an immutable Nginx image containing the Vite production build.
- `api`: a non-root FastAPI image running deterministic demo services.
- `db`: PostgreSQL for workflow, approval, policy, and audit records.

Run the stack from the repository root with `docker compose up --build`. See [`docs/LOCAL_SETUP.md`](../docs/LOCAL_SETUP.md) for health checks, troubleshooting, and teardown.

