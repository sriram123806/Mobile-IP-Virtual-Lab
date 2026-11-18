"""Central configuration. Everything comes from environment variables / .env."""
from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")


def _env(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def _int(name: str, default: int) -> int:
    try:
        return int(_env(name, str(default)))
    except ValueError:
        return default


def _bool(name: str, default: bool) -> bool:
    v = _env(name, "")
    if not v:
        return default
    return v.lower() in {"1", "true", "yes", "on"}


class Settings:
    def __init__(self) -> None:
        self.app_name = "Shinchi"
        self.version = "1.0.0"
        self.kb_dir = Path(_env("KB_DIR") or ROOT / "knowledge_base")
        self.data_dir = Path(_env("DATA_DIR") or ROOT / "data")
        self.resources_path = Path(_env("RESOURCES_PATH") or ROOT / "config" / "resources.json")
        self.frontend_dir = ROOT / "frontend"
        self.allowed_origins = [o.strip() for o in _env("ALLOWED_ORIGINS", "*").split(",") if o.strip()]
        self.admin_token = _env("ADMIN_TOKEN")
        self.max_upload_mb = _int("MAX_UPLOAD_MB", 25)
        # language model
        self.llm_provider = _env("LLM_PROVIDER", "auto").lower()  # auto | anthropic | openai | none
        self.llm_model = _env("LLM_MODEL")
        self.anthropic_api_key = _env("ANTHROPIC_API_KEY")
        self.openai_api_key = _env("OPENAI_API_KEY")
        self.openai_base_url = _env("OPENAI_BASE_URL")
        # embeddings
        self.embedding_provider = _env("EMBEDDING_PROVIDER", "auto").lower()  # auto | onnx | openai | hash
        self.openai_embedding_model = _env("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
        # retrieval / chunking
        self.top_k = _int("TOP_K", 6)
        self.chunk_chars = _int("CHUNK_CHARS", 1400)
        self.chunk_overlap = _int("CHUNK_OVERLAP", 150)
        # service
        self.rate_limit_per_min = _int("RATE_LIMIT_PER_MIN", 20)
        self.auto_index_on_start = _bool("AUTO_INDEX_ON_START", True)
        self.creator_text = _env(
            "CREATOR_TEXT",
            "I was built as the learning assistant for the Mobile IP Virtual Lab. "
            "I answer from the course notes and documents loaded into my knowledge base.",
        )

    @property
    def admin_enabled(self) -> bool:
        return len(self.admin_token) >= 8 and self.admin_token.lower() not in {"change-me", "changeme"}
