"""
Configuration management using Pydantic Settings.
All environment variables and application settings are centralized here.
"""

from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file="../.env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Storage
    upload_dir: Path = Field(Path("./data/uploads"), description="Directory for uploaded files")

    # Server
    host: str = Field("0.0.0.0", description="Server host")
    port: int = Field(8000, description="Server port")

    # File upload limits
    max_file_size_mb: int = Field(500, description="Maximum file size in MB")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Ensure directories exist
        self.upload_dir.mkdir(parents=True, exist_ok=True)


# Global settings instance
settings = Settings()

