from enum import StrEnum
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class AgentRole(StrEnum):
    PLANNER = "workflow.planner"
    ANALYST = "repository.analyst"
    CODE_AUTHOR = "code.author"
    VALIDATOR = "quality.validator"
    SECURITY = "security.reviewer"
    DOCUMENTATION = "documentation.writer"
    HUMAN = "human.approver"


class ToolName(StrEnum):
    STANDARDS_SEARCH = "standards.search"
    REPOSITORY_READ = "repository.read"
    PROPOSE_PATCH = "workspace.propose_patch"
    TEST_RUN = "test.run"
    POLICY_EVALUATE = "policy.evaluate"
    ARTIFACT_WRITE = "artifact.write"
    CREATE_DRAFT_PR = "github.create_draft_pr"
    PRODUCTION_DEPLOY = "deployment.production"
    SECRETS_READ = "secrets.read"


class DecisionResult(StrEnum):
    ALLOWED = "allowed"
    APPROVAL_REQUIRED = "approval_required"
    BLOCKED = "blocked"


class RepositoryReadArgs(StrictModel):
    scope: Literal["samples/payment-service"]
    path: str = Field(min_length=1, max_length=180)

    @field_validator("path")
    @classmethod
    def reject_traversal(cls, value: str) -> str:
        normalized = value.replace("\\", "/")
        if ".." in normalized.split("/") or normalized.startswith("/"):
            raise ValueError("path must remain inside the approved repository scope")
        return value


class TestRunArgs(StrictModel):
    suite: Literal["unit"]
    timeout_seconds: int = Field(ge=1, le=180)


class CreateDraftPrArgs(StrictModel):
    title: str = Field(min_length=8, max_length=120)
    branch: str = Field(pattern=r"^demo/[a-z0-9][a-z0-9-]+$")
    base: Literal["main"]
    draft: Literal[True]
    files: list[str] = Field(min_length=1, max_length=12)


class ProductionDeployArgs(StrictModel):
    service: str = Field(min_length=1, max_length=80)
    version: str = Field(min_length=1, max_length=80)


class SecretsReadArgs(StrictModel):
    name: str = Field(min_length=1, max_length=80)


class GenericToolArgs(StrictModel):
    operation: str = Field(min_length=1, max_length=120)


class ToolRequest(StrictModel):
    agent_id: str = Field(min_length=3, max_length=80)
    agent_role: AgentRole
    tool_name: ToolName
    environment: Literal["demo", "development"] = "demo"
    arguments: dict[str, Any]
    correlation_id: str = Field(min_length=6, max_length=80)


class PolicyDecisionResponse(StrictModel):
    event_id: str
    result: DecisionResult
    reason: str
    approval_required: bool
    validated_arguments: dict[str, Any]


class ApprovalDecision(StrictModel):
    actor: Literal["demo-visitor"] = "demo-visitor"
    acknowledge_simulation: Literal[True]


class HealthResponse(StrictModel):
    status: Literal["ok"]
    mode: Literal["deterministic-demo"]
    version: str

