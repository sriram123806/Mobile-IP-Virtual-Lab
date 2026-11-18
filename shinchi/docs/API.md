# Shinchi HTTP API

Base URL: `http://localhost:8000` locally, or wherever the backend is deployed.
All bodies are JSON (UTF-8) except the upload endpoint (multipart). CORS is allowed
for the origins listed in the `ALLOWED_ORIGINS` environment variable. No cookies are
used, so the frontend never needs `credentials: "include"`.

---

## Public endpoints

### `POST /api/chat`

Request:

```json
{ "session_id": "k3j2h4g5f6d7s8a9", "message": "What is a Home Agent?" }
```

* `session_id`: 8-64 characters, `[A-Za-z0-9_-]`. The frontend generates it once per
  conversation (e.g. `crypto.randomUUID()` with the dashes kept) and stores it in
  `sessionStorage`. The backend keeps conversation memory (user's name, recent turns,
  last topic) per session id.
* `message`: 1-1500 characters.

Response `200`:

```json
{
  "session_id": "k3j2h4g5f6d7s8a9",
  "reply": "**Simple explanation**\nThe Home Agent is ... [1]\n\n**Important point**\n...",
  "intent": "technical",
  "answer_mode": "grounded",
  "user_name": "Sriram",
  "interpreted_as": null,
  "notice": null,
  "llm_used": true,
  "references": [
    {
      "id": 1,
      "title": "Mobile IP Overview (starter notes)",
      "source": "mobile_ip/01_mobile_ip_overview.md",
      "section": "Home Agent",
      "page": null,
      "page_end": null,
      "snippet": "A Home Agent is a router on the mobile node's home network ...",
      "doc_type": "notes",
      "doc_status": "starter",
      "cited": true,
      "score": 0.83
    }
  ],
  "resources": [
    {
      "id": "rfc5944",
      "title": "RFC 5944 - IP Mobility Support for IPv4, Revised",
      "url": "https://www.rfc-editor.org/rfc/rfc5944",
      "description": "The current Mobile IPv4 specification.",
      "kind": "standard",
      "status": "current",
      "badge": null,
      "authors": null,
      "note": null
    }
  ],
  "suggestions": ["What is its responsibility?", "Explain tunneling."],
  "timestamp": "2026-11-03T01:08:00+00:00"
}
```

Field notes:

| Field | Meaning |
|---|---|
| `reply` | Markdown subset (see below). May contain citation markers like `[1]`. |
| `intent` | `greeting`, `farewell`, `thanks`, `how_are_you`, `bot_name`, `creator`, `capabilities`, `about_bot`, `user_name`, `ack`, `technical`, `quiz`, `quiz_answers`, `resources`, `off_topic`, `empty` |
| `answer_mode` | `conversational` (no retrieval), `grounded` (answer written from retrieved notes), `general_knowledge` (notes had nothing relevant; model answered from its own knowledge, reply starts with a clear label), `not_in_kb` (nothing relevant found and no model available), `off_topic`, `quiz`, `resources`, `offline_extract` (no language model configured, so the most relevant passages are shown) |
| `user_name` | Name the student gave earlier in this session, or `null`. |
| `interpreted_as` | When a follow-up like "What happens if it fails?" was resolved, the standalone question Shinchi understood, e.g. "What happens if the Home Agent fails?". Otherwise `null`. UI may show it as a small "Understood as ..." line. |
| `notice` | Optional short notice (e.g. the language model was unavailable, so passages are shown instead). Render as a subtle info line. |
| `references[]` | Knowledge-base chunks the answer used. `cited: true` means the answer text actually cites it with `[id]`; `cited: false` means "retrieved context that was consulted". `page`/`page_end` are `null` when the file type has no pages. `doc_status` is `starter` (AI-drafted starter notes shipped with the project), `user` (the owner's own documents) or `placeholder`. |
| `resources[]` | Curated external links (RFCs, learning sites, textbooks) selected by topic from `config/resources.json`. `kind` is `standard`, `website` or `book`. `status` is `current`, `historical`, `superseded` or `reference`. `url` can be `null` for a book with no verified link. `badge` is optional short text such as "Superseded by RFC 5944". |
| `suggestions[]` | 0-3 follow-up prompts. Render as chips; clicking one sends it as a normal message. |

Errors: `422` (invalid body), `429` (rate limited: `{"detail": "...", "retry_after": 12}`),
`500` (`{"detail": "..."}`). The frontend must show a friendly message for each.

#### Markdown subset used in `reply`

Paragraphs separated by blank lines; `**bold**`; `*italic*`; `` `inline code` ``;
fenced code blocks (triple backticks); unordered lists (`- item`); ordered lists
(`1. item`); blockquotes (`> text`); simple pipe tables; and citation markers `[n]`
that refer to `references[].id`. There is no raw HTML. Headings are written as bold
lines (`**Example**`), but a renderer should tolerate `#`-style headings too.
Everything must be HTML-escaped before rendering.

### `DELETE /api/session/{session_id}`

Clears the server-side memory for that session. Response `{"cleared": true}`.

### `GET /api/health`

```json
{
  "status": "ok",
  "app": "Shinchi",
  "version": "1.0.0",
  "llm": { "enabled": true, "provider": "anthropic", "model": "claude-sonnet-5-5" },
  "embeddings": { "provider": "local", "model": "all-MiniLM-L6-v2", "dim": 384 },
  "index": { "documents": 11, "chunks": 142, "ready": true, "needs_rebuild": false },
  "admin_enabled": true
}
```

---

## Admin endpoints

Every admin request needs `Authorization: Bearer <ADMIN_TOKEN>`. If the server has no
usable `ADMIN_TOKEN`, admin endpoints answer `503` with `{"detail": "Admin API disabled: set ADMIN_TOKEN ..."}`.
A wrong token gives `401`.

### `GET /api/admin/documents`

```json
{
  "documents": [
    {
      "source": "mobile_ip/01_mobile_ip_overview.md",
      "title": "Mobile IP Overview",
      "status": "indexed",
      "chunks": 12,
      "pages": null,
      "size_bytes": 8123,
      "sha256": "...",
      "updated_at": "2026-11-03T01:00:00+00:00",
      "doc_type": "notes",
      "doc_status": "starter",
      "category": "mobile_ip",
      "warnings": [],
      "error": null
    }
  ],
  "total_chunks": 142,
  "embedder": "local:all-MiniLM-L6-v2:384",
  "needs_rebuild": false
}
```

`status` is `indexed`, `failed` or `empty`. `error` holds a human-readable message for failures.

### `POST /api/admin/upload`

`multipart/form-data` with a `file` field. Allowed: `.pdf .docx .txt .md .markdown .html .htm`.
Maximum size is set by `MAX_UPLOAD_MB`. Returns `202`:

```json
{ "job_id": "a1b2c3d4", "filename": "my_notes.pdf" }
```

Immediate `4xx` errors for an unsupported type (`415`), a file that is too large (`413`),
or a file whose content does not match its extension (`400`, e.g. a renamed ZIP).
Uploading a file with an existing name replaces that document.

### `GET /api/admin/jobs/{job_id}` and `GET /api/admin/jobs`

```json
{
  "id": "a1b2c3d4",
  "kind": "upload",
  "filename": "my_notes.pdf",
  "status": "running",
  "stage": "embedding",
  "progress": 0.62,
  "message": "Embedding 48 chunks...",
  "chunks": null,
  "error": null,
  "warnings": [],
  "started_at": "...",
  "finished_at": null
}
```

`status`: `queued`, `running`, `done`, `failed`. `stage` (in order): `validating`,
`extracting`, `cleaning`, `chunking`, `embedding`, `indexing`, `done`.
The list endpoint returns `{"jobs": [...]}` (newest first).
Poll every ~700 ms until `status` is `done` or `failed`.

### `DELETE /api/admin/documents?source=<relative path>`

Removes the document from the index and deletes its file. Returns `{"deleted": true}`.

### `POST /api/admin/reindex`

Body `{"mode": "sync"}` (index new or changed files only, remove vanished ones) or
`{"mode": "rebuild"}` (wipe the vector index and re-embed everything). Returns `202`
with `{"job_id": "..."}`; track it with the jobs endpoint.
