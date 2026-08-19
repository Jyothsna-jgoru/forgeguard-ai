# Testing Strategy

## Principles

- Test policy boundaries more heavily than display-only content.
- Keep the deterministic graph repeatable.
- Verify the static experience without mocking an API.
- Treat production builds and container health as product checks.
- Keep external mutations impossible in both implementation and tests.

## Backend tests

`apps/api/tests/test_policy.py` covers:

- Analyst repository reads within the fixed sample scope.
- Validator unit-test requests with bounded timeout.
- Draft pull-request intent returning `approval_required`.
- Unconditional blocks for production deployment and secret retrieval.
- Path traversal rejection before authorization.
- Deny-by-default behavior when a role borrows another role's capability.

`apps/api/tests/test_workflow.py` covers:

- Six deterministic LangGraph executions.
- Stable output across repeated runs.
- Stop state at `awaiting_human_approval`.
- Three retrieved local context records.
- Simulated review-package marker.

`apps/api/tests/test_api.py` covers:

- Health contract.
- Automatic ticket seeding and retrieval context.
- Workflow execution with zero external mutations.
- Approval generating only a simulated artifact.
- Not-found behavior.

Tests use a disposable SQLite database. Docker Compose exercises the PostgreSQL profile.

## Frontend tests

Vitest and React Testing Library cover:

- Landing-page product message and workflow navigation.
- Static ticket content without an API.
- Unknown-route recovery.
- Workflow replay reset and staged advancement.
- Human approval transition, artifact rendering, and reset control.

## Sample service tests

JUnit and Mockito validate:

- First request invokes the payment processor.
- Equivalent retry returns the same result and invokes the processor once.
- Conflicting key reuse throws `IdempotencyConflictException` without a second processor call.

## CI matrix

The `CI` workflow runs three independent jobs:

1. Frontend typecheck, lint, Vitest, and production build.
2. Backend Ruff checks, Pytest, and coverage output.
3. Maven tests for the payment-service sample on Java 21.

The Pages workflow performs an independent production frontend build with repository-aware asset paths before deployment.

## Commands

```bash
npm run typecheck --prefix apps/web
npm run lint --prefix apps/web
npm test --prefix apps/web
npm run build --prefix apps/web
```

```bash
cd apps/api
ruff check forgeguard tests
pytest --cov=forgeguard --cov-report=term-missing
```

```bash
cd samples/payment-service
mvn test
```

```bash
docker compose up --build -d
docker compose ps
curl http://localhost:8000/api/v1/health
curl http://localhost:8080/
docker compose down
```

