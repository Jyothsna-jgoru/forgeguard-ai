def test_health(client) -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["mode"] == "deterministic-demo"


def test_seeded_ticket_includes_retrieved_context(client) -> None:
    response = client.get("/api/v1/tickets/PAY-1842")
    assert response.status_code == 200
    assert response.json()["service"] == "payment-service"
    assert len(response.json()["retrieved_context"]) == 3


def test_workflow_endpoint_runs_graph_without_external_mutation(client) -> None:
    response = client.post("/api/v1/workflows/demo/run")
    assert response.status_code == 200
    assert response.json()["stage"] == "awaiting_human_approval"
    assert response.json()["external_mutations"] == 0


def test_approval_creates_only_simulated_artifact(client) -> None:
    response = client.post("/api/v1/approvals/APV-0042/approve", json={"actor": "demo-visitor", "acknowledge_simulation": True})
    assert response.status_code == 200
    assert response.json()["external_mutation_performed"] is False
    assert response.json()["draft_pull_request"]["simulated"] is True


def test_unknown_ticket_returns_404(client) -> None:
    assert client.get("/api/v1/tickets/UNKNOWN").status_code == 404
