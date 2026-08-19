from collections.abc import Callable
from uuid import uuid4

from pydantic import ValidationError

from forgeguard.schemas import (
    AgentRole,
    CreateDraftPrArgs,
    DecisionResult,
    GenericToolArgs,
    PolicyDecisionResponse,
    ProductionDeployArgs,
    RepositoryReadArgs,
    SecretsReadArgs,
    TestRunArgs,
    ToolName,
    ToolRequest,
)

ArgumentValidator = Callable[..., object]


class InvalidToolArguments(ValueError):
    pass


class PolicyEngine:
    """Deny-by-default authorization for every simulated tool request."""

    unconditional_blocks = {ToolName.PRODUCTION_DEPLOY, ToolName.SECRETS_READ}
    approval_tools = {ToolName.CREATE_DRAFT_PR}
    role_matrix: dict[AgentRole, set[ToolName]] = {
        AgentRole.PLANNER: {ToolName.STANDARDS_SEARCH},
        AgentRole.ANALYST: {ToolName.REPOSITORY_READ},
        AgentRole.CODE_AUTHOR: {ToolName.PROPOSE_PATCH},
        AgentRole.VALIDATOR: {ToolName.TEST_RUN},
        AgentRole.SECURITY: {ToolName.POLICY_EVALUATE},
        AgentRole.DOCUMENTATION: {ToolName.ARTIFACT_WRITE, ToolName.CREATE_DRAFT_PR},
        AgentRole.HUMAN: {ToolName.CREATE_DRAFT_PR},
    }
    argument_models: dict[ToolName, type] = {
        ToolName.REPOSITORY_READ: RepositoryReadArgs,
        ToolName.TEST_RUN: TestRunArgs,
        ToolName.CREATE_DRAFT_PR: CreateDraftPrArgs,
        ToolName.PRODUCTION_DEPLOY: ProductionDeployArgs,
        ToolName.SECRETS_READ: SecretsReadArgs,
        ToolName.STANDARDS_SEARCH: GenericToolArgs,
        ToolName.PROPOSE_PATCH: GenericToolArgs,
        ToolName.POLICY_EVALUATE: GenericToolArgs,
        ToolName.ARTIFACT_WRITE: GenericToolArgs,
    }

    def evaluate(self, request: ToolRequest) -> PolicyDecisionResponse:
        validated = self._validate_arguments(request)
        event_id = f"pol_{uuid4().hex[:12]}"

        if request.tool_name in self.unconditional_blocks:
            return PolicyDecisionResponse(
                event_id=event_id,
                result=DecisionResult.BLOCKED,
                reason="This high-risk capability is prohibited in every demonstration environment.",
                approval_required=False,
                validated_arguments=validated,
            )

        permitted = self.role_matrix.get(request.agent_role, set())
        if request.tool_name not in permitted:
            return PolicyDecisionResponse(
                event_id=event_id,
                result=DecisionResult.BLOCKED,
                reason="Deny-by-default: the requested capability is not granted to this agent role.",
                approval_required=False,
                validated_arguments=validated,
            )

        if request.tool_name in self.approval_tools:
            return PolicyDecisionResponse(
                event_id=event_id,
                result=DecisionResult.APPROVAL_REQUIRED,
                reason="The request would change external state and requires explicit human authorization.",
                approval_required=True,
                validated_arguments=validated,
            )

        return PolicyDecisionResponse(
            event_id=event_id,
            result=DecisionResult.ALLOWED,
            reason="Role, tool, environment, scope, and typed arguments satisfy the policy matrix.",
            approval_required=False,
            validated_arguments=validated,
        )

    def _validate_arguments(self, request: ToolRequest) -> dict[str, object]:
        model = self.argument_models[request.tool_name]
        try:
            return model.model_validate(request.arguments).model_dump()
        except ValidationError as error:
            raise InvalidToolArguments(str(error)) from error

