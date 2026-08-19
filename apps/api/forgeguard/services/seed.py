from sqlalchemy import select
from sqlalchemy.orm import Session

from forgeguard.demo_data import AGENT_EXECUTIONS, PR_ARTIFACT, TICKET
from forgeguard.models import AgentExecution, ApprovalRequest, PolicyDecision, Ticket, WorkflowRun


def seed_demo(session: Session) -> None:
    if session.get(Ticket, TICKET["id"]):
        return
    session.add(Ticket(id=TICKET["id"], title=TICKET["title"], description=TICKET["description"], risk_level=TICKET["risk_level"], service=TICKET["service"], payload=TICKET))
    session.add(WorkflowRun(id="RUN-2026-0818-0042", ticket_id=TICKET["id"], status="awaiting_approval", current_stage="approval_gate", payload={"demo": True}))
    for execution in AGENT_EXECUTIONS:
        session.add(AgentExecution(run_id="RUN-2026-0818-0042", agent_name=execution["name"], agent_role=execution["role"], status="completed", elapsed_ms=execution["elapsed_ms"], input_data={"ticket_id": TICKET["id"]}, output_data={"items": execution["output"], "tool": execution["tool"]}))
    seeded_decisions = [
        ("evt_01J8Y10K", "repository.analyst", "repository.read", "allowed", False),
        ("evt_01J8Y13M", "quality.validator", "test.run", "allowed", False),
        ("evt_01J8Y18P", "documentation.writer", "github.create_draft_pr", "approval_required", True),
        ("evt_01J8Y20R", "code.author", "deployment.production", "blocked", False),
        ("evt_01J8Y21S", "repository.analyst", "secrets.read", "blocked", False),
    ]
    for event_id, role, tool, result, approval in seeded_decisions:
        session.add(PolicyDecision(event_id=event_id, run_id="RUN-2026-0818-0042", agent_role=role, tool_name=tool, arguments={"redacted": False, "demo": True}, result=result, reason="Seeded deterministic policy decision.", approval_required=approval))
    session.add(ApprovalRequest(id="APV-0042", run_id="RUN-2026-0818-0042", status="pending", artifact=PR_ARTIFACT))
    session.commit()


def reset_approval(session: Session) -> None:
    approval = session.scalar(select(ApprovalRequest).where(ApprovalRequest.id == "APV-0042"))
    if approval:
        approval.status = "pending"
        approval.decided_by = None
        approval.decided_at = None
        session.commit()
