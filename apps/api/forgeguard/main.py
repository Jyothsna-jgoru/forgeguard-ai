from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from forgeguard.core.config import get_settings
from forgeguard.db import Base, SessionLocal, engine
from forgeguard.routers import approvals, governance, health, tickets, workflows
from forgeguard.services.seed import seed_demo

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        seed_demo(session)
    yield


app = FastAPI(
    title="ForgeGuard AI API",
    description="Deterministic agent workflow and deny-by-default tool gateway for the ForgeGuard public demonstration.",
    version="1.0.0",
    lifespan=lifespan,
    contact={"name": "ForgeGuard AI project documentation", "url": "/api/v1/health"},
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Accept"],
)
app.include_router(health.router, prefix=settings.api_prefix)
app.include_router(tickets.router, prefix=settings.api_prefix)
app.include_router(workflows.router, prefix=settings.api_prefix)
app.include_router(governance.router, prefix=settings.api_prefix)
app.include_router(approvals.router, prefix=settings.api_prefix)


@app.get("/", include_in_schema=False)
def root() -> dict[str, str]:
    return {"service": "ForgeGuard AI API", "documentation": "/docs", "mode": "deterministic-demo"}

