# Payment Service Sample

This directory is a self-contained Spring Boot-style sample repository used by the ForgeGuard AI demonstration. It models a small payment creation endpoint and the proposed idempotency behavior for ticket `PAY-1842`.

The code is intentionally compact and uses an in-memory idempotency store so reviewers can understand the workflow without infrastructure or secrets. It is not connected to a payment provider, production system, or external repository.

## Behavior

- `POST /api/payments` requires an `Idempotency-Key` header.
- The first request executes the simulated payment processor and stores its result.
- A retry with the same key and request fingerprint returns the original result.
- Reusing the key with a different request raises an idempotency conflict mapped to HTTP 409.
- Unit tests prove that equivalent retries invoke the processor exactly once.

The review-ready unified diff is available in [`proposed-change.diff`](./proposed-change.diff). The checked-in source reflects the proposed end state so the sample can be inspected and tested independently.

```bash
mvn test
```

For an actual service, replace the in-memory store with a durable atomic implementation and define retention, concurrency, and recovery behavior explicitly.

