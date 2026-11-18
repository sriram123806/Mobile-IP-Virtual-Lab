# Shinchi: Mobile IP & DCN RAG chatbot ("Let's Ask Shinchi!")

A subject-focused learning assistant that answers from **your** documents using Retrieval-Augmented Generation, with source references, follow-up understanding, viva practice and curated RFC/book links.

## Architecture
```
Browser (GitHub Pages)                  Backend (Render / Railway / VPS / Docker)
 frontend/js/shinchi-widget.js  --HTTPS-->  FastAPI  /api/chat
 (no keys, Shadow DOM)                       |- chat/intents    greetings, name, thanks...  -> NO retrieval, NO LLM
                                             |- chat/service    follow-up resolution, routing, quiz, resources
                                             |- rag/retriever   hybrid: Chroma vectors + BM25, rank fusion
                                             |- rag/llm         Claude or OpenAI writes the answer from retrieved passages
                                             |- ingestion/*     PDF/DOCX/TXT/MD/HTML -> clean -> chunk -> embed -> Chroma
                                             `- config/resources.json  curated RFC / website / book links
```
**How RAG works here:** (1) documents in `knowledge_base/` are extracted, cleaned and split along headings into chunks that keep title + section (+ page for PDFs); (2) each chunk is embedded and stored in ChromaDB; (3) a question (after resolving "it/its/the agent you just explained" from conversation memory) is searched with dense vectors *and* BM25 and fused; (4) the top passages are given to the language model as quoted reference data with strict rules (cite `[n]`, don't invent, label anything not from the notes); (5) the UI shows the answer, the numbered sources (file, section, page), and topic-matched external resources. Citations the model invents are stripped server-side. Retrieved text is treated as data: instruction-like lines are removed at ingestion and the prompt tells the model to ignore any that remain.

**Without an API key** Shinchi still works: it shows the most relevant passages from your notes (clearly labelled "no AI model"). With a key you get written explanations.

## Quick start (local)
```bash
cd shinchi
python -m venv .venv && source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                     # add ANTHROPIC_API_KEY (or OPENAI_API_KEY) and ADMIN_TOKEN
cd backend && uvicorn app.asgi:app --reload --port 8000
```
Open http://localhost:8000 (chat), http://localhost:8000/admin.html (knowledge base), http://localhost:8000/embed-example.html (floating widget demo). The first start indexes `knowledge_base/` automatically. The first run with `EMBEDDING_PROVIDER=auto` downloads the small MiniLM model (~80 MB); if that is blocked it falls back to an offline hash embedder (weaker on paraphrases). Check `/api/health`.

## Add your own documents
Drop PDF/DOCX/TXT/MD/HTML files into `knowledge_base/my_documents/` and click **Sync** on the admin page (or `python backend/scripts/ingest.py`), or upload on the admin page. Use **Rebuild** after changing the embedding model. Only add material you have permission to use. The shipped notes are **AI-drafted starter notes** (labelled in the UI): replace or supplement them with your lecturer's material for authoritative answers. Viva questions come from files with `type: viva` (format in `docs/KB_FORMAT.md`). Scanned PDFs have no text and are rejected with a clear message (no OCR).

## Configuration (`.env`)
See `.env.example`. Keys live only on the backend. `ALLOWED_ORIGINS` must list your site origin (e.g. `https://YOUR-USERNAME.github.io`, no path). `ADMIN_TOKEN` protects the admin API.

## Testing
```bash
pip install -r requirements-dev.txt
cd backend && python -m pytest tests -q                 # 29 tests: ingestion, retrieval, chat, API, admin, safety
python scripts/evaluate.py                              # runs the 18 acceptance questions -> docs/EVALUATION.md
```

## Deploy the backend (GitHub Pages cannot run Python)
1. Push this folder to a GitHub repo (`.env` and `data/` are git-ignored).
2. **Render**: New > Blueprint (uses `render.yaml`/`Dockerfile`), set `ANTHROPIC_API_KEY`, `ADMIN_TOKEN`, `ALLOWED_ORIGINS`. Railway/Fly/any Docker host work the same: `docker build -t shinchi . && docker run -p 8000:8000 --env-file .env -v shinchi-data:/data shinchi`.
3. Free tiers sleep and lose local disk: the knowledge base ships in the image and is re-indexed at start; files uploaded via the admin page are lost on redeploy unless you attach a persistent disk (mount at `/data` and set `KB_DIR=/data/kb`, copying `knowledge_base/` there once) or commit the files to `knowledge_base/` and redeploy.
4. Open `https://YOUR-BACKEND/api/health` to confirm.

## Integrate into your Mobile IP Virtual Lab (GitHub Pages)
1. Copy `frontend/css`, `frontend/js`, `frontend/assets` into your site (keep the folder names), e.g. `shinchi/`.
2. Add before `</body>` on every page that should show the chatbot:
```html
<script src="shinchi/js/shinchi-widget.js" data-api-base="https://YOUR-BACKEND" data-mode="floating"></script>
```
Use `data-mode="inline" data-target="#my-div"` to embed it inside a page section. The widget lives in a Shadow DOM, so your site's CSS won't break it. The backend allows your origin via CORS; no keys are in the page.

## Known limits (honest notes)
- The starter notes were drafted from knowledge of the RFCs and textbooks and were **not** line-by-line verified against RFC text in this build; check them against RFC 5944, 2003, 3024 and your lecture notes.
- Book entries have no links (none could be verified); resources are only links you can check yourself. RFC 3344 is shown as superseded by RFC 5944.
- Automated tests ran with the offline hash embedder and **no live LLM** (no API key in the build environment). The Claude/OpenAI path and the MiniLM embedder are implemented but were exercised only with a fake LLM; run `scripts/evaluate.py` with your key and read the answers.
- Follow-up resolution is rule-based (pronouns, "the agent you just explained", short follow-ups); unusual phrasing may not resolve.
