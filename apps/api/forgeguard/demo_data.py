from typing import Any

TICKET: dict[str, Any] = {
    "id": "PAY-1842",
    "title": "Add idempotency validation to the payment-processing API and cover retry behavior with unit tests.",
    "description": "Prevent duplicate payment processing when clients retry POST /api/payments. Accept an Idempotency-Key, replay matching retries, and reject conflicting payloads.",
    "risk_level": "medium",
    "service": "payment-service",
    "acceptance_criteria": [
        "Require an Idempotency-Key header for payment creation requests.",
        "Return the original response when the same key and payload are retried.",
        "Return HTTP 409 when a key is reused with a different payload.",
        "Cover new, repeated, and conflicting request paths with unit tests.",
        "Avoid logging payment details or exposing key values in error responses.",
    ],
    "implementation_plan": [
        "Require the retry key and map conflicts at the controller boundary.",
        "Store request fingerprints and original results behind an interface.",
        "Resolve replay state before invoking the payment processor.",
        "Verify first, equivalent retry, and conflicting retry behavior.",
    ],
    "impacted_files": [
        "src/main/java/com/forgeguard/payments/api/PaymentController.java",
        "src/main/java/com/forgeguard/payments/service/PaymentService.java",
        "src/main/java/com/forgeguard/payments/idempotency/IdempotencyStore.java",
        "src/test/java/com/forgeguard/payments/service/PaymentServiceTest.java",
    ],
}

RAG_DOCUMENTS = [
    {"id": "api-reliability-4-2", "source": "API Reliability Standard §4.2", "text": "Mutation endpoints that support retries must bind an idempotency key to a canonical request fingerprint and original result."},
    {"id": "secure-logging-3-1", "source": "Secure Logging Policy §3.1", "text": "Identifiers used for replay protection may be correlated internally but must not be written verbatim to application logs."},
    {"id": "payment-guide-2-6", "source": "Payment Service Guide §2.6", "text": "Controller tests verify HTTP semantics; service tests verify the processor is invoked at most once per logical request."},
    {"id": "tool-policy-5-4", "source": "Agent Tool Policy §5.4", "text": "External state changes require an explicit approval record tied to the exact proposed artifact."},
]

AGENT_EXECUTIONS = [
    {"name": "Planner Agent", "role": "workflow.planner", "elapsed_ms": 800, "tool": "standards.search", "output": ["4-step plan", "Medium-risk classification"]},
    {"name": "Repository Analyst Agent", "role": "repository.analyst", "elapsed_ms": 1100, "tool": "repository.read", "output": ["4 impacted files", "Spring Boot conventions"]},
    {"name": "Code Agent", "role": "code.author", "elapsed_ms": 1700, "tool": "workspace.propose_patch", "output": ["Reviewable unified diff", "+74 / -6 lines"]},
    {"name": "Test Agent", "role": "quality.validator", "elapsed_ms": 2400, "tool": "test.run", "output": ["12 checks passed", "3 retry tests added"]},
    {"name": "Security & Policy Review Agent", "role": "security.reviewer", "elapsed_ms": 1000, "tool": "policy.evaluate", "output": ["No critical findings", "Approval required"]},
    {"name": "Documentation Agent", "role": "documentation.writer", "elapsed_ms": 700, "tool": "artifact.write", "output": ["Engineering summary", "Draft PR description"]},
]

PR_ARTIFACT = {
    "simulated": True,
    "title": "feat(payments): validate idempotency keys for payment retries",
    "branch": "demo/pay-1842-idempotency-validation",
    "base": "main",
    "draft": True,
    "changed_files": TICKET["impacted_files"],
    "checks": ["12 unit checks passed", "Policy review passed", "Sensitive logging check passed", "Human approval recorded"],
    "summary": "Equivalent retries replay the original result without invoking the processor again. Conflicting payloads return HTTP 409.",
}
