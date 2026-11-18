# Knowledge-base format

The indexer scans `knowledge_base/` recursively. Supported: `.pdf .docx .txt .md .markdown .html .htm`.
Files named `README.md` and anything starting with `.` or `_` are ignored.
The first folder level is stored as the document's `category`.

## Optional front matter (Markdown and TXT)

```
---
title: Mobile IP Overview
type: notes            # notes | viva | reference | textbook | rfc
status: starter        # starter | user | placeholder
source_url: https://www.rfc-editor.org/rfc/rfc5944   # optional, informational
updated: 2026-11-03
---
```

* If `title` is missing, the first `# Heading` (or the file name) is used.
* `status: starter` marks AI-drafted starter notes shipped with Shinchi. The UI labels them so students
  know they are a draft and not a lecturer's material. Files without a `status` are treated as `user`.

## Headings

Chunks are split along headings (`#`, `##`, `###`) and the heading path is stored with every chunk
and shown in references (for example `Tunneling > Forward tunnel`). Write headings that name the concept.

## Viva question bank format (`type: viva`)

One Q&A per `###` heading, so that each question becomes its own chunk:

```
### Q7 [hard] Why can't the Home Agent just replace the destination address of the packet?
**Answer:** Because ... (model answer, 2-6 sentences)
```

Difficulty tags are `[easy]`, `[medium]`, `[hard]`. The parser reads questions from headings matching
`^Q\d+ \[(easy|medium|hard)\] (.+)$` and the model answer from the text underneath.

## `config/resources.json` (curated external links)

```json
{
  "version": 1,
  "resources": [
    {
      "id": "rfc5944",
      "title": "RFC 5944 - IP Mobility Support for IPv4, Revised",
      "url": "https://www.rfc-editor.org/rfc/rfc5944",
      "kind": "standard",
      "status": "current",
      "badge": null,
      "description": "One sentence on what a student can learn here.",
      "covers": "Optional longer sentence (used for books).",
      "authors": null,
      "note": null,
      "topics": ["mobile ip", "registration", "agent discovery", "home agent", "foreign agent", "care-of address"],
      "priority": 1
    }
  ]
}
```

* `kind`: `standard` | `website` | `book`. `status`: `current` | `historical` | `superseded` | `reference`.
* `url` may be `null` only when no legitimate publisher/author page could be verified; explain in `note`.
* `topics`: lowercase phrases. A resource is offered for a question only when one of its topics matches the
  question or its detected entities, so keep topics specific. Generic learning sites use topics such as
  `networking basics`, `data communication`, `osi model`, `ip addressing`, `subnetting`, `routing`.
* `priority`: lower number = shown first.
