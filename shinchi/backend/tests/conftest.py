import shutil
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
ROOT = Path(__file__).resolve().parents[2]


@pytest.fixture()
def settings(tmp_path, monkeypatch):
    kb = tmp_path / "kb"
    shutil.copytree(ROOT / "knowledge_base", kb)
    monkeypatch.setenv("KB_DIR", str(kb))
    monkeypatch.setenv("DATA_DIR", str(tmp_path / "data"))
    monkeypatch.setenv("EMBEDDING_PROVIDER", "hash")
    monkeypatch.setenv("LLM_PROVIDER", "none")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "")
    monkeypatch.setenv("OPENAI_API_KEY", "")
    monkeypatch.setenv("ADMIN_TOKEN", "test-admin-token")
    monkeypatch.setenv("AUTO_INDEX_ON_START", "false")
    monkeypatch.setenv("RESOURCES_PATH", str(ROOT / "config" / "resources.json"))
    from app.config import Settings
    return Settings()


@pytest.fixture()
def client(settings):
    from fastapi.testclient import TestClient
    from app.main import create_app
    app = create_app(settings)
    app.state.indexer.sync()
    return TestClient(app)


@pytest.fixture()
def svc(client):
    return client.app.state.chat
