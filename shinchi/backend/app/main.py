"""FastAPI application: chat API, admin API, and (optionally) the static frontend."""
from __future__ import annotations

import logging
import secrets
import threading
import time
from collections import deque
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, File, Header, HTTPException, Query, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from .chat.resources import Resources
from .chat.service import ChatService
from .config import Settings
from .ingestion.indexer import Indexer
from .ingestion.loaders import ALLOWED_EXT, IngestError
from .rag.embeddings import make_embedder
from .rag.llm import LLM
from .rag.retriever import Retriever
from .rag.store import VectorStore

log = logging.getLogger("shinchi")


class ChatRequest(BaseModel):
    session_id: str = Field(pattern=r"^[A-Za-z0-9_-]{8,64}$")
    message: str = Field(min_length=1, max_length=1500)


class ReindexRequest(BaseModel):
    mode: str = Field(default="sync", pattern="^(sync|rebuild)$")


def create_app(settings: Settings | None = None) -> FastAPI:
    s = settings or Settings()
    embedder = make_embedder(s)
    store = VectorStore(s.data_dir, f"{embedder.name}:{embedder.dim}")
    retriever = Retriever(store, embedder)
    llm = LLM(s)
    indexer = Indexer(s, store, embedder)
    chat = ChatService(s, store, retriever, llm, Resources(s.resources_path))
    hits: dict[str, deque] = {}
    hits_lock = threading.Lock()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        if s.auto_index_on_start:
            indexer.submit_sync("sync")
        yield

    app = FastAPI(title="Shinchi API", version=s.version, lifespan=lifespan)
    app.add_middleware(CORSMiddleware, allow_origins=s.allowed_origins, allow_credentials=False,
                       allow_methods=["GET", "POST", "DELETE", "OPTIONS"], allow_headers=["*"])
    app.state.chat, app.state.indexer, app.state.store, app.state.llm, app.state.settings = chat, indexer, store, llm, s

    def admin(authorization: str | None = Header(default=None)) -> None:
        if not s.admin_enabled:
            raise HTTPException(503, "Admin API disabled: set ADMIN_TOKEN (at least 8 characters) in the backend environment.")
        tok = (authorization or "").removeprefix("Bearer ").strip()
        if not secrets.compare_digest(tok.encode(), s.admin_token.encode()):
            raise HTTPException(401, "Invalid or missing admin token.")

    # ------------------------------------------------------------ public
    @app.post("/api/chat")
    def chat_endpoint(body: ChatRequest, request: Request):
        ip = request.client.host if request.client else "?"
        now = time.time()
        with hits_lock:
            q = hits.setdefault(ip, deque())
            while q and now - q[0] > 60:
                q.popleft()
            if len(q) >= s.rate_limit_per_min:
                retry = int(60 - (now - q[0])) + 1
                return JSONResponse({"detail": "Too many messages. Please wait a moment.", "retry_after": retry}, status_code=429, headers={"Retry-After": str(retry)})
            q.append(now)
        try:
            return chat.handle(body.session_id, body.message)
        except Exception:  # noqa: BLE001
            log.exception("chat failed")
            raise HTTPException(500, "Something went wrong while answering. Please try again.")

    @app.delete("/api/session/{session_id}")
    def clear_session(session_id: str):
        return {"cleared": chat.clear(session_id)}

    @app.get("/api/health")
    def health():
        docs = store.manifest["documents"]
        return {
            "status": "ok", "app": s.app_name, "version": s.version,
            "llm": {"enabled": llm.enabled, "provider": llm.provider, "model": llm.model or None},
            "embeddings": {"provider": embedder.name.split("-")[0], "model": embedder.name, "dim": embedder.dim},
            "index": {"documents": sum(1 for d in docs.values() if d["status"] == "indexed"), "chunks": store.count(),
                      "ready": store.count() > 0, "needs_rebuild": store.needs_rebuild},
            "admin_enabled": s.admin_enabled,
        }

    # ------------------------------------------------------------ admin
    @app.get("/api/admin/documents", dependencies=[Depends(admin)])
    def list_docs():
        return {"documents": indexer.list_documents(), "total_chunks": store.count(),
                "embedder": store.embedder_id, "needs_rebuild": store.needs_rebuild}

    @app.post("/api/admin/upload", status_code=202, dependencies=[Depends(admin)])
    async def upload(file: UploadFile = File(...)):
        name = Path(file.filename or "").name
        ext = Path(name).suffix.lower()
        if ext not in ALLOWED_EXT:
            raise HTTPException(415, f"Unsupported file type '{ext or 'none'}'. Allowed: {', '.join(sorted(ALLOWED_EXT))}.")
        limit = s.max_upload_mb * 1024 * 1024
        data = bytearray()
        while chunk := await file.read(1024 * 1024):
            data.extend(chunk)
            if len(data) > limit:
                raise HTTPException(413, f"File is larger than the {s.max_upload_mb} MB limit.")
        try:
            job = indexer.submit_upload(name, bytes(data))
        except IngestError as e:
            raise HTTPException(400, str(e))
        return {"job_id": job.d["id"], "filename": job.d["filename"]}

    @app.get("/api/admin/jobs", dependencies=[Depends(admin)])
    def jobs():
        return {"jobs": [j.d for j in reversed(indexer.jobs.values())]}

    @app.get("/api/admin/jobs/{job_id}", dependencies=[Depends(admin)])
    def job(job_id: str):
        j = indexer.jobs.get(job_id)
        if not j:
            raise HTTPException(404, "Unknown job id.")
        return j.d

    @app.delete("/api/admin/documents", dependencies=[Depends(admin)])
    def delete_doc(source: str = Query(...)):
        if not indexer.delete(source):
            raise HTTPException(404, "Document not found.")
        return {"deleted": True}

    @app.post("/api/admin/reindex", status_code=202, dependencies=[Depends(admin)])
    def reindex(body: ReindexRequest):
        return {"job_id": indexer.submit_sync(body.mode).d["id"]}

    if s.frontend_dir.exists():
        app.mount("/", StaticFiles(directory=str(s.frontend_dir), html=True), name="frontend")
    return app
