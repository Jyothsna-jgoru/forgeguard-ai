import os

os.environ["DATABASE_URL"] = "sqlite:///./forgeguard-test.db"

import pytest
from fastapi.testclient import TestClient

from forgeguard.db import Base, engine
from forgeguard.main import app


@pytest.fixture(autouse=True)
def clean_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client
