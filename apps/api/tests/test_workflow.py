from forgeguard.services.workflow import DeterministicWorkflow


def test_deterministic_graph_reaches_approval_gate() -> None:
    state = DeterministicWorkflow().run()
    assert state["stage"] == "awaiting_human_approval"
    assert len(state["executions"]) == 6
    assert state["review_package"]["policy_result"] == "approval_required"
    assert state["review_package"]["simulated"] is True
    assert len(state["retrieved_context"]) == 3


def test_deterministic_graph_is_repeatable() -> None:
    workflow = DeterministicWorkflow()
    first = workflow.run()
    second = workflow.run()
    assert first["executions"] == second["executions"]
    assert first["review_package"] == second["review_package"]

