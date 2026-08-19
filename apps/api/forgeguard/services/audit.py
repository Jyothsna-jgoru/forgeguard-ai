import hashlib
import json
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from forgeguard.models import AuditEvent


class AuditService:
    """Writes append-oriented, hash-linked audit evidence."""

    def append(
        self,
        session: Session,
        *,
        event_type: str,
        actor: str,
        correlation_id: str,
        payload: dict[str, Any],
    ) -> AuditEvent:
        previous = session.scalar(select(AuditEvent).order_by(AuditEvent.id.desc()).limit(1))
        previous_hash = previous.event_hash if previous else "GENESIS"
        canonical = json.dumps(
            {"type": event_type, "actor": actor, "correlation_id": correlation_id, "payload": payload, "previous_hash": previous_hash},
            sort_keys=True,
            separators=(",", ":"),
        )
        event = AuditEvent(
            event_type=event_type,
            actor=actor,
            correlation_id=correlation_id,
            payload=payload,
            previous_hash=previous_hash,
            event_hash=hashlib.sha256(canonical.encode()).hexdigest(),
        )
        session.add(event)
        return event

