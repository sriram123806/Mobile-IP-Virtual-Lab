import io
import time


def wait(client, jid, h):
    for _ in range(100):
        j = client.get(f"/api/admin/jobs/{jid}", headers=h).json()
        if j["status"] in ("done", "failed"):
            return j
        time.sleep(0.1)
    raise AssertionError("job timeout")


def test_health_and_chat(client):
    h = client.get("/api/health").json()
    assert h["status"] == "ok" and h["index"]["ready"] and h["llm"]["enabled"] is False
    r = client.post("/api/chat", json={"session_id": "abcdefgh12", "message": "What is a Care-of Address?"})
    assert r.status_code == 200 and r.json()["references"]
    assert client.post("/api/chat", json={"session_id": "x", "message": "hi"}).status_code == 422
    assert client.post("/api/chat", json={"session_id": "abcdefgh12", "message": "a" * 1600}).status_code == 422
    assert client.delete("/api/session/abcdefgh12").json() == {"cleared": True}


def test_rate_limit(client, settings):
    client.app.state.settings.rate_limit_per_min = 3
    codes = [client.post("/api/chat", json={"session_id": "abcdefgh12", "message": "hi"}).status_code for _ in range(5)]
    assert codes[:3] == [200] * 3 and codes[3] == 429


def test_admin_auth(client):
    assert client.get("/api/admin/documents").status_code == 401
    assert client.get("/api/admin/documents", headers={"Authorization": "Bearer nope"}).status_code == 401


def test_admin_disabled_without_token(client):
    client.app.state.settings.admin_token = ""
    assert client.get("/api/admin/documents", headers={"Authorization": "Bearer x"}).status_code == 503


def test_upload_index_and_answer_and_delete(client):
    h = {"Authorization": "Bearer test-admin-token"}
    text = b"# Zeta Protocol\n\n## Zeta handshake\n\nThe Zeta protocol uses a quokka-handshake to open sessions between nodes.\n"
    r = client.post("/api/admin/upload", headers=h, files={"file": ("zeta notes.md", text, "text/markdown")})
    assert r.status_code == 202
    j = wait(client, r.json()["job_id"], h)
    assert j["status"] == "done" and j["chunks"] >= 1
    docs = client.get("/api/admin/documents", headers=h).json()["documents"]
    assert any(d["source"].startswith("my_documents/zeta") for d in docs)
    a = client.post("/api/chat", json={"session_id": "abcdefgh12", "message": "What is the quokka-handshake in the Zeta protocol?"}).json()
    assert any("zeta" in x["source"] for x in a["references"])
    src = next(d["source"] for d in docs if "zeta" in d["source"])
    assert client.delete("/api/admin/documents", headers=h, params={"source": src}).json() == {"deleted": True}
    a = client.post("/api/chat", json={"session_id": "abcdefgh12", "message": "What is the quokka-handshake in the Zeta protocol?"}).json()
    assert not any("zeta" in x["source"] for x in a["references"])


def test_upload_errors(client):
    h = {"Authorization": "Bearer test-admin-token"}
    assert client.post("/api/admin/upload", headers=h, files={"file": ("a.exe", b"MZ", "x/y")}).status_code == 415
    assert client.post("/api/admin/upload", headers=h, files={"file": ("a.pdf", b"nope", "x/y")}).status_code == 400
    assert client.post("/api/admin/upload", headers=h, files={"file": ("a.txt", b"", "x/y")}).status_code == 400
    client.app.state.settings.max_upload_mb = 0
    assert client.post("/api/admin/upload", headers=h, files={"file": ("a.txt", b"hello", "x/y")}).status_code == 413


def test_corrupt_pdf_with_valid_header_reports_failure(client):
    h = {"Authorization": "Bearer test-admin-token"}
    r = client.post("/api/admin/upload", headers=h, files={"file": ("broken.pdf", b"%PDF-1.4\ngarbage without structure", "application/pdf")})
    assert r.status_code == 202
    j = wait(client, r.json()["job_id"], h)
    assert j["status"] == "failed" and j["error"]


def test_rebuild_and_sync(client):
    h = {"Authorization": "Bearer test-admin-token"}
    n = client.get("/api/health").json()["index"]["chunks"]
    j = wait(client, client.post("/api/admin/reindex", headers=h, json={"mode": "rebuild"}).json()["job_id"], h)
    assert j["status"] == "done"
    assert client.get("/api/health").json()["index"]["chunks"] == n
