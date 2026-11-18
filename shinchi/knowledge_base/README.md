# Knowledge base

Shinchi indexes everything in this folder (`.pdf .docx .txt .md .markdown .html .htm`). Folder names become categories.

- `mobile_ip/`, `dcn/`, `viva/`, `glossary.md`: **starter notes drafted by an AI assistant** so the chatbot has something to retrieve. They are marked `status: starter` and the UI labels them. Replace or supplement them with your own lecturer notes.
- `my_documents/`: put your own notes and textbooks here (only material you have permission to use).

To add documents: drop files into `my_documents/` and run `python scripts/ingest.py` (or use the admin page upload). To remove starter notes, delete them and re-sync. See `../docs/KB_FORMAT.md` for front matter and the viva question format.
This README is ignored by the indexer.
