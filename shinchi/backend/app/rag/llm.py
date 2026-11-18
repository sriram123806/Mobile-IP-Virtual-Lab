"""Language-model wrapper (generation only; retrieval lives elsewhere)."""
from __future__ import annotations

import logging

log = logging.getLogger("shinchi.llm")


class LLMError(Exception):
    pass


class LLM:
    def __init__(self, settings):
        s = settings
        p = s.llm_provider
        if p == "auto":
            p = "anthropic" if s.anthropic_api_key else ("openai" if s.openai_api_key else "none")
        self.provider = p
        self.model = ""
        self._client = None
        if p == "anthropic" and s.anthropic_api_key:
            import anthropic

            self.model = s.llm_model or "claude-sonnet-5-5"
            self._client = anthropic.Anthropic(api_key=s.anthropic_api_key, timeout=60.0, max_retries=1)
        elif p == "openai" and s.openai_api_key:
            from openai import OpenAI

            self.model = s.llm_model or "gpt-4o-mini"
            self._client = OpenAI(api_key=s.openai_api_key, base_url=s.openai_base_url or None, timeout=60.0, max_retries=1)
        else:
            self.provider = "none"

    @property
    def enabled(self) -> bool:
        return self._client is not None

    def complete(self, system: str, user: str, max_tokens: int = 1000) -> str:
        if not self.enabled:
            raise LLMError("No language model configured.")
        try:
            if self.provider == "anthropic":
                r = self._client.messages.create(model=self.model, max_tokens=max_tokens, system=system,
                                                 messages=[{"role": "user", "content": user}])
                return "".join(getattr(b, "text", "") for b in r.content).strip()
            r = self._client.chat.completions.create(model=self.model, max_tokens=max_tokens, temperature=0.2,
                                                     messages=[{"role": "system", "content": system}, {"role": "user", "content": user}])
            return (r.choices[0].message.content or "").strip()
        except Exception as e:  # noqa: BLE001
            log.warning("LLM call failed: %s", e)
            raise LLMError(str(e)) from e
