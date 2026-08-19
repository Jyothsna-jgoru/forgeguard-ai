import pytest

from forgeguard.schemas import AgentRole, DecisionResult, ToolName, ToolRequest
from forgeguard.services.policy import InvalidToolArguments, PolicyEngine


def request(role: AgentRole, tool: ToolName, arguments: dict) -> ToolRequest:
    return ToolRequest(agent_id="agent-test", agent_role=role, tool_name=tool, environment="demo", arguments=arguments, correlation_id="test-correlation")


def test_repository_read_is_allowed_for_analyst() -> None:
    decision = PolicyEngine().evaluate(request(AgentRole.ANALYST, ToolName.REPOSITORY_READ, {"scope": "samples/payment-service", "path": "src/main"}))
    assert decision.result == DecisionResult.ALLOWED
    assert decision.approval_required is False


def test_unit_test_run_is_allowed_with_bounded_timeout() -> None:
    decision = PolicyEngine().evaluate(request(AgentRole.VALIDATOR, ToolName.TEST_RUN, {"suite": "unit", "timeout_seconds": 120}))
    assert decision.result == DecisionResult.ALLOWED


def test_draft_pr_requires_human_approval() -> None:
    decision = PolicyEngine().evaluate(request(AgentRole.DOCUMENTATION, ToolName.CREATE_DRAFT_PR, {"title": "feat: validate payment retries", "branch": "demo/pay-1842-idempotency", "base": "main", "draft": True, "files": ["PaymentService.java"]}))
    assert decision.result == DecisionResult.APPROVAL_REQUIRED
    assert decision.approval_required is True


@pytest.mark.parametrize("tool,arguments", [(ToolName.PRODUCTION_DEPLOY, {"service": "payment-service", "version": "candidate"}), (ToolName.SECRETS_READ, {"name": "provider_token"})])
def test_high_risk_capabilities_are_unconditionally_blocked(tool: ToolName, arguments: dict) -> None:
    decision = PolicyEngine().evaluate(request(AgentRole.CODE_AUTHOR, tool, arguments))
    assert decision.result == DecisionResult.BLOCKED


def test_path_traversal_fails_schema_validation() -> None:
    with pytest.raises(InvalidToolArguments):
        PolicyEngine().evaluate(request(AgentRole.ANALYST, ToolName.REPOSITORY_READ, {"scope": "samples/payment-service", "path": "../../secrets"}))


def test_role_cannot_borrow_another_roles_capability() -> None:
    decision = PolicyEngine().evaluate(request(AgentRole.PLANNER, ToolName.TEST_RUN, {"suite": "unit", "timeout_seconds": 30}))
    assert decision.result == DecisionResult.BLOCKED

