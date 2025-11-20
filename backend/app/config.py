"""
Configuration management using Pydantic Settings.
All environment variables and application settings are centralized here.
"""

from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Hugging Face
    huggingface_token: str = Field(..., description="Hugging Face API token for model access")

    # LLM Provider
    openai_api_key: str | None = Field(None, description="OpenAI API key")
    llm_api_key: str | None = Field(None, description="Generic LLM API key (DeepSeek, etc.)")
    llm_provider: Literal["openai", "anthropic", "deepseek"] = Field("deepseek", description="LLM provider")
    llm_model: str = Field("deepseek-chat", description="LLM model to use")

    # Device Configuration
    device: Literal["cpu", "cuda"] = Field("cpu", description="PyTorch device")
    torch_device: str = Field("cpu", description="Specific torch device (e.g., cuda:0)")

    # Models
    diarization_model: str = Field(
        "pyannote/speaker-diarization-3.1", description="Speaker diarization model ID"
    )
    asr_model: str = Field(
        "simonl0909/whisper-large-v2-cantonese",
        description="ASR model for Cantonese+English",
    )
    embedding_model: str = Field(
        "sentence-transformers/all-MiniLM-L6-v2", description="Embedding model for RAG"
    )

    # Storage
    upload_dir: Path = Field(Path("./data/uploads"), description="Directory for uploaded files")
    storage_dir: Path = Field(
        Path("./data/storage"), description="Directory for processed data"
    )

    # Server
    host: str = Field("0.0.0.0", description="Server host")
    port: int = Field(8000, description="Server port")

    # RAG Settings
    rag_chunk_max_tokens: int = Field(500, description="Max tokens per RAG chunk")
    rag_top_k: int = Field(5, description="Number of chunks to retrieve for RAG")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Ensure directories exist
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.storage_dir.mkdir(parents=True, exist_ok=True)


# Global settings instance
settings = Settings()

