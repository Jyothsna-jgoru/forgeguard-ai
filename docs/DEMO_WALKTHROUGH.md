# Demo Walkthrough

## Audience

This path is designed for a 6–10 minute engineering or recruiting review. It starts with product intent, follows the evidence chain, and ends at the human authority boundary.

## 1. Establish the product boundary

Open `/`. Point out the headline, the six specialized agents, and the gateway preview. The hero notes make the public posture explicit: no sign-in, ready-made safe scenarios, optional local-only input, and no repository access.

## 2. Choose a safe demo ticket

Open `/intake` and select any ready-made ticket. No visitor data is required:

- `PAY-1842` includes the complete Spring Boot sample and unified Java diff.
- `IAM-2317` explores account-recovery abuse controls.
- `NTF-3081` explores safe webhook retry behavior.
- `ORD-4276` explores authorization and data-minimization controls.

Each card launches the same deterministic workflow with scenario-specific criteria, risk, service scope, planning, and review evidence.

## 3. Optionally try a custom scenario

Use the form below the ticket catalog only with made-up or sanitized content, then select **Run custom workflow**.

- Confirm that the generated `DEMO-####` ticket appears throughout the workflow.
- Note that planning, validation, policy, and approval outputs adapt deterministically.
- Open **Changes** and confirm that ForgeGuard proposes implementation areas rather than fabricating repository-specific code.
- Use **Restore PAY-1842 reference** at any time to restore the complete Java sample.

## 4. Replay the workflow

Open `/workflow` and select **Replay**.

- Pause at the Planner to inspect its inputs, reasoning summary, outputs, tool request, and gateway result.
- Advance through the Repository Analyst and Code Agent to show scoped repository understanding before patch generation.
- At the Test Agent, note the 12 passing checks and the processor-once retry invariant.
- At Security Review, note the residual concurrency limitation and approval requirement.
- Finish at the gate where `github.create_draft_pr` remains pending.

## 5. Inspect source context

Open `/ticket`.

- Review the five acceptance criteria.
- Explain why risk is medium: payment execution is sensitive, while the proposal remains isolated and review-only.
- Inspect the retrieved engineering context and its transparent local match scores.

## 6. Review the change

Open `/changes`.

- Confirm the banner says the diff is a proposal, not a repository mutation.
- Review the `PaymentService` retry path and focused test additions.
- Use **Copy diff** to verify that the visible control works.
- Discuss the documented limitation: production storage would require atomic durable semantics.

## 7. Inspect governance

Open `/governance` and expand representative decisions:

- `repository.read` — allowed for the repository analyst within sample scope.
- `test.run` — allowed for the validator with a bounded unit suite.
- `github.create_draft_pr` — approval required because it represents external state change.
- `deployment.production` — blocked and not eligible for approval.
- `secrets.read` — blocked with no adapter registered.

Connect these outcomes to deny-by-default policy, identity, schemas, least privilege, approval gates, and audit evidence.

## 8. Exercise human approval

Open `/approval`, review the plan, files, checks, and risks, then select **Approve Draft PR**.

The resulting artifact shows title, branch, base, changed files, checks, reviewer focus, and approval ID. Confirm the page explicitly states that no GitHub mutation occurred. Use **Reset checkpoint** to restore the scenario.

## 9. Close with architecture

Open `/architecture` and trace:

1. React static demo to optional FastAPI.
2. FastAPI to LangGraph and local retrieval.
3. Harness to the MCP gateway.
4. Gateway to isolated adapters or approval.
5. Control plane to PostgreSQL and hash-linked audit records.

Emphasize the trust boundaries and safety invariants rather than claims about production adoption.
