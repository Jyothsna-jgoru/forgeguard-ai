from fastapi import APIRouter

from forgeguard import __version__
from forgeguard.schemas import HealthResponse

router = APIRouter(tags=["system"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", mode="deterministic-demo", version=__version__)

