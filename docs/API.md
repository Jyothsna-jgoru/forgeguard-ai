# API Reference

## Conventions

- Base URL: `http://localhost:8000/api/v1`
- Content type: `application/json`
- API mode: deterministic local demonstration
- Interactive schema: `http://localhost:8000/docs`
- Errors use FastAPI's `{"detail": ...}` shape.

The public Pages site does not call these endpoints. They are available for local technical evaluation.

## Health

### `GET /health`

```json
{
  "status": "ok",
  "mode": "deterministic-demo",
  "version": "1.0.0"
}
```

## Tickets

### `GET /tickets/PAY-1842`

Returns the seeded ticket, description, risk, service, acceptance criteria, implementation plan, impacted files, and top three locally retrieved context records.

`404` is returned for an unknown ticket ID.

## Workflows

### `GET /workflows/demo`

Returns persisted metadata for `RUN-2026-0818-0042`, including the six seeded executions and pending review package.

### `POST /workflows/demo/run`

Executes the deterministic LangGraph state machine in process. No request body is required.

The response includes:

- `stage`: `awaiting_human_approval`
- `executions`: six ordered deterministic stage results
- `retrieved_context`: three locally ranked records
- `review_package`: proposed draft artifact with `approval_status: pending`
- `external_mutations`: `0`

## Governance

### `GET /governance/decisions`

Lists the seeded policy examples plus decisions evaluated during the current local database lifecycle.

### `POST /governance/evaluate`

Example allowed repository read:

```json
{
  "agent_id": "repository-analyst-01",
  "agent_role": "repository.analyst",
  "tool_name": "repository.read",
  "environment": "demo",
  "arguments": {
    "scope": "samples/payment-service",
    "path": "src/main"
  },
  "correlation_id": "RUN-2026-0818-0042"
}
```

Response:

```json
{
  "event_id": "pol_<generated-id>",
  "result": "allowed",
  "reason": "Role, tool, environment, scope, and typed arguments satisfy the policy matrix.",
  "approval_required": false,
  "validated_arguments": {
    "scope": "samples/payment-service",
    "path": "src/main"
  }
}
```

Possible results are `allowed`, `approval_required`, and `blocked`.

Validation failures return `422`. A syntactically valid but unauthorized role/tool pair returns `200` with `result: blocked` so the decision can be audited as a normal policy outcome.

## Approvals

### `GET /approvals/APV-0042`

Returns the pending or approved status and exact simulated artifact under review.

### `POST /approvals/APV-0042/approve`

```json
{
  "actor": "demo-visitor",
  "acknowledge_simulation": true
}
```

The literal acknowledgement prevents an ambiguous client call. The response includes the approved draft artifact and:

```json
{
  "external_mutation_performed": false
}
```

This endpoint updates only the local database and append-oriented audit chain.

## Tool argument schemas

| Tool | Required arguments | Important validation |
|---|---|---|
| `repository.read` | `scope`, `path` | Fixed sample scope; absolute and traversal paths rejected |
| `test.run` | `suite`, `timeout_seconds` | Unit suite only; 1–180 seconds |
| `github.create_draft_pr` | `title`, `branch`, `base`, `draft`, `files` | Demo branch pattern; `main` base; draft must be true |
| `deployment.production` | `service`, `version` | Schema validates, then policy always blocks |
| `secrets.read` | `name` | Schema validates, then policy always blocks |

Unknown fields are rejected for every request model.

