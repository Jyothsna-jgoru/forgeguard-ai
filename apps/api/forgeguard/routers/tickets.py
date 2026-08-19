from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from forgeguard.db import get_db
from forgeguard.models import Ticket
from forgeguard.services.rag import LocalVectorStore

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.get("/{ticket_id}")
def get_ticket(ticket_id: str, session: Session = Depends(get_db)) -> dict:
    ticket = session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    context = LocalVectorStore().search(f"{ticket.title} payment retry security")
    return {**ticket.payload, "retrieved_context": [item.__dict__ for item in context]}

