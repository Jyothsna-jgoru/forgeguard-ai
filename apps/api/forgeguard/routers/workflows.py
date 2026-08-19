from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from forgeguard.db import get_db
from forgeguard.demo_data import AGENT_EXECUTIONS, PR_ARTIFACT, TICKET
from forgeguard.models import WorkflowRun
from forgeguard.services.workflow import DeterministicWorkflow

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("/demo")
def get_demo_workflow(session: Session = Depends(get_db)) -> dict:
    run = session.scalar(select(WorkflowRun).where(WorkflowRun.id == "RUN-2026-0818-0042"))
    if not run:
        raise HTTPException(status_code=404, detail="Demo workflow not seeded")
    return {
        "id": run.id,
        "ticket": TICKET,
        "status": run.status,
        "stage": run.current_stage,
        "executions": AGENT_EXECUTIONS,
        "review_package": PR_ARTIFACT,
        "external_mutations": 0,
    }


@router.post("/demo/run")
def run_demo_workflow() -> dict:
    state = DeterministicWorkflow().run()
    return {**state, "messages": [], "run_id": "RUN-LOCAL-DETERMINISTIC", "external_mutations": 0}

