# Architecture Decisions

## ADR-001: Static-first public experience

**Decision:** bundle the complete scenario in the frontend and treat the backend as an optional local evaluation surface.

**Why:** a portfolio visitor should not encounter sign-in, service cold starts, missing credentials, or a broken workflow when the API is not hosted.

**Tradeoff:** frontend and backend scenario records must stay aligned. Shared generation could be introduced later if divergence becomes costly.

## ADR-002: Deterministic orchestration as the default

**Decision:** compile a real LangGraph state machine whose nodes produce stable typed outputs without a model provider.

**Why:** reliability, testability, and inspectability matter more than variable prose in a public demonstration. It also makes the security controls independently evaluable.

**Tradeoff:** the workflow demonstrates orchestration and governance rather than open-ended reasoning quality. `ProviderInterface` reserves a clean extension point.

## ADR-003: Equivalent local retrieval store

**Decision:** implement a compact sparse-vector store with local token vectors and cosine similarity instead of adding a persistent vector service.

**Why:** the seeded corpus is small, deterministic, transparent, and requires no separate lifecycle. It still demonstrates indexing, ranking, source attribution, and context injection.

**Tradeoff:** semantic recall is intentionally limited. A larger corpus would justify a dedicated local vector backend.

## ADR-004: Gateway-owned policy

**Decision:** agents cannot receive adapter objects. They emit typed intent to a central gateway that owns argument schemas, role policy, and auditing.

**Why:** capability must not be inferred from model text. A single control plane makes authorization and evidence consistent.

**Tradeoff:** every new capability requires coordinated schema, matrix, adapter, tests, and documentation updates. That friction is desirable for privileged operations.

## ADR-005: Three-valued policy outcomes

**Decision:** return `allowed`, `approval_required`, or `blocked`.

**Why:** approval is neither success nor denial. Modeling it explicitly prevents workflows from treating a pending human decision as an error or implicit permission.

**Tradeoff:** orchestrators must persist and resume checkpoint state.

## ADR-006: Unconditional high-risk blocks

**Decision:** `deployment.production` and `secrets.read` are blocked before role evaluation and are not eligible for approval.

**Why:** these capabilities are unnecessary for the product boundary. Omitting their adapters and making the block explicit reduces ambiguity.

## ADR-007: Hash-linked audit events

**Decision:** include the prior event hash in the canonical input for each new event hash.

**Why:** this demonstrates ordered evidence and makes accidental history changes visible without an external service.

**Tradeoff:** it does not prevent a privileged database operator from rebuilding the chain. The project makes no immutability or external-notarization claim.

## ADR-008: PostgreSQL in Compose, SQLite for native convenience

**Decision:** Docker Compose uses PostgreSQL while the API default uses a local SQLite file when `DATABASE_URL` is absent.

**Why:** PostgreSQL reflects the intended relational design; SQLite keeps native setup focused on code evaluation.

**Tradeoff:** dialect-specific behavior needs testing before a production profile could be considered.

## ADR-009: In-memory idempotency sample

**Decision:** keep the sample implementation deliberately replaceable and in memory.

**Why:** the demo is about reviewing retry semantics and the agent evidence chain, not operating a payment system.

**Tradeoff:** the sample does not claim durable or cross-instance atomic behavior. That limitation is visible in the UI and documentation.

