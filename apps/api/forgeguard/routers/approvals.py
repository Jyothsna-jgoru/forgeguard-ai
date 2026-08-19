from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from forgeguard.db import get_db
from forgeguard.demo_data import PR_ARTIFACT
from forgeguard.models import ApprovalRequest
from forgeguard.schemas import ApprovalDecision
from forgeguard.services.audit import AuditService

router = APIRouter(prefix="/approvals", tags=["approvals"])


@router.get("/{approval_id}")
def get_approval(approval_id: str, session: Session = Depends(get_db)) -> dict:
    approval = session.get(ApprovalRequest, approval_id)
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")
    return {"id": approval.id, "run_id": approval.run_id, "status": approval.status, "artifact": approval.artifact, "simulated": True}


@router.post("/{approval_id}/approve")
def approve(approval_id: str, decision: ApprovalDecision, session: Session = Depends(get_db)) -> dict:
    approval = session.get(ApprovalRequest, approval_id)
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")
    approval.status = "approved"
    approval.decided_by = decision.actor
    approval.decided_at = datetime.now(UTC)
    approval.artifact = {**PR_ARTIFACT, "approval_record": "APR-2026-0042"}
    AuditService().append(
        session,
        event_type="approval.recorded",
        actor=decision.actor,
        correlation_id="RUN-2026-0818-0042",
        payload={"approval_id": approval_id, "result": "approved", "simulated": True},
    )
    session.commit()
    return {"id": approval.id, "status": approval.status, "draft_pull_request": approval.artifact, "external_mutation_performed": False}

