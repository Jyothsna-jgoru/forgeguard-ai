from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from forgeguard.db import get_db
from forgeguard.models import PolicyDecision
from forgeguard.schemas import PolicyDecisionResponse, ToolRequest
from forgeguard.services.audit import AuditService
from forgeguard.services.policy import InvalidToolArguments, PolicyEngine

router = APIRouter(prefix="/governance", tags=["governance"])


@router.get("/decisions")
def list_decisions(session: Session = Depends(get_db)) -> list[dict]:
    decisions = session.scalars(select(PolicyDecision).order_by(PolicyDecision.id)).all()
    return [
        {
            "event_id": item.event_id,
            "agent_role": item.agent_role,
            "tool_name": item.tool_name,
            "arguments": item.arguments,
            "result": item.result,
            "reason": item.reason,
            "approval_required": item.approval_required,
            "created_at": item.created_at,
        }
        for item in decisions
    ]


@router.post("/evaluate", response_model=PolicyDecisionResponse)
def evaluate(request: ToolRequest, session: Session = Depends(get_db)) -> PolicyDecisionResponse:
    try:
        decision = PolicyEngine().evaluate(request)
    except InvalidToolArguments as error:
        raise HTTPException(status_code=422, detail="Tool arguments failed schema validation") from error

    session.add(
        PolicyDecision(
            event_id=decision.event_id,
            run_id=None,
            agent_role=request.agent_role.value,
            tool_name=request.tool_name.value,
            arguments=decision.validated_arguments,
            result=decision.result.value,
            reason=decision.reason,
            approval_required=decision.approval_required,
        )
    )
    AuditService().append(
        session,
        event_type="policy.decision",
        actor=request.agent_id,
        correlation_id=request.correlation_id,
        payload={"tool": request.tool_name.value, "result": decision.result.value, "event_id": decision.event_id},
    )
    session.commit()
    return decision

