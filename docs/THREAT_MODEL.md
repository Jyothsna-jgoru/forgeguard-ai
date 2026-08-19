# Threat Model

## Scope

This model covers the ForgeGuard public static experience and the local Docker Compose evaluation profile. It focuses on misuse of agent context, tool authorization, repository scope, approval state, and audit evidence.

External GitHub, CI/CD, deployment, payment processing, and secret systems are outside the trust boundary because no live connector is implemented.

## Assets

- Integrity of the proposed patch and review package.
- Integrity and traceability of policy decisions and approvals.
- Repository scope and test-runner isolation.
- Availability of the static demonstration.
- Confidentiality of local environment data.

## Trust assumptions

- Agent-generated text is untrusted and cannot grant authority.
- Ticket content and repository content may contain adversarial instructions.
- The local operator controls Docker and the host filesystem.
- Browser visitors have no privileged identity.
- Demo adapters do not contain credentials or production network routes.

## Threats and controls

| Threat | Example | Primary controls | Residual risk |
|---|---|---|---|
| Prompt injection | Repository comment asks the analyst to read secrets | Agent text is separated from typed tool intent; `secrets.read` is unconditionally blocked | An agent may still produce poor prose, requiring review |
| Privilege escalation | Planner requests the test runner | Explicit role/tool matrix; deny by default | Matrix configuration needs normal code review |
| Path traversal | `repository.read` requests `../../` | Pydantic path validation and fixed sample scope | Symlink handling would need stronger filesystem controls in a real adapter |
| Argument smuggling | Extra tool fields change adapter behavior | `extra="forbid"`; tool-specific schemas; bounded values | Schema and adapter must evolve together |
| Approval bypass | Agent claims the PR was approved | Approval is a distinct entity and human role; graph stops before transition | Local browser state is illustrative, not an identity proof |
| Sensitive logging | Retry key or payment data appears in audit | Audit payloads use decision metadata; sample avoids logging key values | Operational logging would require independent review |
| Audit tampering | Earlier decision is edited | Append-oriented storage and previous-hash chaining | A database administrator can rewrite the entire chain; no external anchor is claimed |
| Resource exhaustion | Test request uses an unbounded timeout | Only allowlisted unit suite; maximum 180 seconds | Container-level CPU and memory limits would be added for a hardened runtime |
| Production mutation | Agent requests deployment | Capability is unconditionally blocked and no adapter exists | None within the demonstrated integration boundary |
| Credential extraction | Agent requests a provider token | Capability is blocked; no secret source or setting exists | Host-level compromise is outside application scope |

## Security invariants

1. No agent directly invokes a tool adapter.
2. Every tool request is parsed and schema-validated before authorization.
3. Unknown role/tool combinations fail closed.
4. Production deployment and secret retrieval are never approvable.
5. Draft PR intent requires a human approval record tied to the review package.
6. Public deployment requires no credential and performs no external mutation.
7. Audit records never intentionally contain a secret value.

## Data classification

All seeded tickets, source code, standards, test results, and audit events are demonstration data. The project does not accept or require personal, financial, credential, or production repository data.

## Residual risks

- The sample in-memory idempotency store does not provide durable cross-instance atomicity.
- Hash chaining detects inconsistent history but does not prevent a privileged database operator from rebuilding history.
- CSP headers are present in the local Nginx profile; Pages header behavior is controlled by the hosting platform.
- Dependency vulnerabilities remain an ongoing maintenance concern and are checked through normal update review and CI.
- A future live adapter would materially change this threat model and require authentication, authorization, network isolation, credential management, and incident controls not shown here.

## Out of scope

- Certification or compliance claims.
- Multi-tenant identity and billing.
- Live payment-provider integration.
- Live GitHub, deployment, CI/CD, or secret-manager mutation.
- Production incident response and disaster recovery.

