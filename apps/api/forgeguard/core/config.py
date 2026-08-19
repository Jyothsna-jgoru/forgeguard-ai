from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration. No secret-bearing setting is required in demo mode."""

    app_name: str = "ForgeGuard AI API"
    api_prefix: str = "/api/v1"
    demo_mode: bool = Field(default=True, alias="FORGEGUARD_DEMO_MODE")
    database_url: str = Field(default="sqlite:///./forgeguard.db", alias="DATABASE_URL")
    cors_origins: str = Field(
        default="http://localhost:5173,http://localhost:8080",
        alias="FORGEGUARD_CORS_ORIGINS",
    )
    model_config = SettingsConfigDict(env_file=".env", extra="ignore", populate_by_name=True)

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

