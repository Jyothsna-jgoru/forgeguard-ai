from typing import Annotated, Any, TypedDict

from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages

from forgeguard.demo_data import AGENT_EXECUTIONS, PR_ARTIFACT, TICKET
from forgeguard.services.rag import LocalVectorStore


class WorkflowState(TypedDict):
    ticket: dict[str, Any]
    stage: str
    executions: list[dict[str, Any]]
    retrieved_context: list[dict[str, Any]]
    review_package: dict[str, Any]
    messages: Annotated[list, add_messages]


def _append_execution(index: int, stage: str):
    def node(state: WorkflowState) -> dict[str, Any]:
        execution = {**AGENT_EXECUTIONS[index], "status": "completed"}
        return {"stage": stage, "executions": [*state["executions"], execution]}

    return node


class DeterministicWorkflow:
    """LangGraph harness that produces stable output without an LLM provider."""

    def __init__(self, vector_store: LocalVectorStore | None = None) -> None:
        self.vector_store = vector_store or LocalVectorStore()
        graph = StateGraph(WorkflowState)
        graph.add_node("planner", self._planner)
        graph.add_node("analyst", _append_execution(1, "repository_analysis"))
        graph.add_node("code", _append_execution(2, "change_proposed"))
        graph.add_node("test", _append_execution(3, "validated"))
        graph.add_node("security", _append_execution(4, "policy_reviewed"))
        graph.add_node("documentation", self._documentation)
        graph.add_edge(START, "planner")
        graph.add_edge("planner", "analyst")
        graph.add_edge("analyst", "code")
        graph.add_edge("code", "test")
        graph.add_edge("test", "security")
        graph.add_edge("security", "documentation")
        graph.add_edge("documentation", END)
        self.graph = graph.compile()

    def _planner(self, state: WorkflowState) -> dict[str, Any]:
        query = f"{state['ticket']['title']} retry idempotency payment security"
        retrieved = [document.__dict__ for document in self.vector_store.search(query)]
        execution = {**AGENT_EXECUTIONS[0], "status": "completed"}
        return {"stage": "planned", "executions": [execution], "retrieved_context": retrieved}

    @staticmethod
    def _documentation(state: WorkflowState) -> dict[str, Any]:
        execution = {**AGENT_EXECUTIONS[5], "status": "completed"}
        package = {**PR_ARTIFACT, "approval_status": "pending", "policy_result": "approval_required"}
        return {"stage": "awaiting_human_approval", "executions": [*state["executions"], execution], "review_package": package}

    def run(self) -> WorkflowState:
        initial: WorkflowState = {
            "ticket": TICKET,
            "stage": "intake",
            "executions": [],
            "retrieved_context": [],
            "review_package": {},
            "messages": [],
        }
        return self.graph.invoke(initial)


class ProviderInterface:
    """Extension point for a future provider without making one a demo dependency."""

    def complete(self, *, system: str, prompt: str) -> str:
        raise NotImplementedError("No provider is configured; deterministic demo mode is active.")

