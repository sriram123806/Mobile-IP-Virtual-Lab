/*! Shinchi chat widget. Vanilla JS, no dependencies, renders inside a Shadow DOM.
 *  <script src="shinchi-widget.js" data-api-base="https://your-backend" data-mode="floating"></script>  */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ pure helpers (unit-testable in Node) */
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/\u0000/g, "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) {
    try { var p = new URL(String(u)); return (p.protocol === "http:" || p.protocol === "https:") ? p.href : null; }
    catch (e) { return null; }
  }

  function renderInline(raw, refIds) {
    var stash = [];
    function keep(html) { stash.push(html); return "\u0001" + (stash.length - 1) + "\u0002"; }
    var s = escapeHtml(raw);
    s = s.replace(/`([^`\n]+)`/g, function (_, c) { return keep("<code>" + c + "</code>"); });
    s = s.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, function (m, text, url) {
      var u = safeUrl(url.replace(/&amp;/g, "&"));
      if (!u) return m;
      return keep('<a href="' + escapeHtml(u) + '" target="_blank" rel="noopener noreferrer">' + text + "</a>");
    });
    s = s.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*\w])\*([^*\s][^*\n]*?)\*(?![*\w])/g, "$1<em>$2</em>");
    s = s.replace(/\[(\d{1,2})\]/g, function (m, n) {
      return (refIds && refIds.has(+n)) ? keep('<a class="cite" href="#" data-ref="' + n + '" aria-label="Source ' + n + '">' + n + "</a>") : m;
    });
    return s.replace(/\u0001(\d+)\u0002/g, function (_, i) { return stash[+i]; });
  }

  function splitRow(line) { return line.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map(function (c) { return c.trim(); }); }

  function renderMarkdown(text, refIds) {
    var lines = String(text == null ? "" : text).replace(/\r\n?/g, "\n").split("\n");
    var out = [], i = 0;
    function isSep(l) { return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l) && l.indexOf("-") >= 0; }
    while (i < lines.length) {
      var line = lines[i];
      if (!line.trim()) { i++; continue; }
      var fence = /^\s*```/.exec(line);
      if (fence) {
        var code = []; i++;
        while (i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i++]);
        i++;
        out.push("<pre><code>" + escapeHtml(code.join("\n")) + "</code></pre>");
        continue;
      }
      var h = /^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
      if (h) { out.push('<p class="h">' + renderInline(h[2], refIds) + "</p>"); i++; continue; }
      if (line.indexOf("|") >= 0 && i + 1 < lines.length && isSep(lines[i + 1])) {
        var head = splitRow(line); i += 2; var rows = [];
        while (i < lines.length && lines[i].indexOf("|") >= 0 && lines[i].trim()) rows.push(splitRow(lines[i++]));
        out.push('<div class="tbl"><table><thead><tr>' + head.map(function (c) { return "<th>" + renderInline(c, refIds) + "</th>"; }).join("") +
          "</tr></thead><tbody>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + renderInline(c, refIds) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>");
        continue;
      }
      if (/^\s*>\s?/.test(line)) {
        var q = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) q.push(lines[i++].replace(/^\s*>\s?/, ""));
        out.push("<blockquote>" + renderInline(q.join(" "), refIds) + "</blockquote>");
        continue;
      }
      var ul = /^\s*[-*+]\s+/, ol = /^\s*\d+[.)]\s+/;
      if (ul.test(line) || ol.test(line)) {
        var ordered = ol.test(line), items = [], rx = ordered ? ol : ul;
        while (i < lines.length && rx.test(lines[i])) {
          var item = lines[i++].replace(rx, "");
          while (i < lines.length && lines[i].trim() && /^\s{2,}\S/.test(lines[i]) && !ul.test(lines[i]) && !ol.test(lines[i])) item += " " + lines[i++].trim();
          items.push("<li>" + renderInline(item, refIds) + "</li>");
        }
        out.push((ordered ? "<ol>" : "<ul>") + items.join("") + (ordered ? "</ol>" : "</ul>"));
        continue;
      }
      var para = [];
      while (i < lines.length && lines[i].trim() && !/^\s*```/.test(lines[i]) && !/^\s{0,3}#{1,6}\s/.test(lines[i]) && !ul.test(lines[i]) && !ol.test(lines[i]) && !/^\s*>/.test(lines[i]) &&
        !(lines[i].indexOf("|") >= 0 && i + 1 < lines.length && isSep(lines[i + 1]))) para.push(lines[i++]);
      out.push("<p>" + para.map(function (l) { return renderInline(l, refIds); }).join("<br>") + "</p>");
    }
    return out.join("");
  }

  function markdownToPlainText(text) {
    return String(text == null ? "" : text)
      .replace(/```[^\n]*\n([\s\S]*?)```/g, "$1")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1 ($2)")
      .replace(/\*\*([^*]+)\*\*/g, "$1").replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?![*\w])/g, "$1$2")
      .replace(/`([^`]+)`/g, "$1").replace(/^\s{0,3}#{1,6}\s+/gm, "").replace(/^\s*>\s?/gm, "")
      .replace(/^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/gm, "")
      .replace(/\s?\[\d{1,2}\]/g, "").replace(/\n{3,}/g, "\n\n").trim();
  }

  var api = { escapeHtml: escapeHtml, safeUrl: safeUrl, renderInline: renderInline, renderMarkdown: renderMarkdown, markdownToPlainText: markdownToPlainText };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window === "undefined" || typeof document === "undefined") return;

  /* ------------------------------------------------------------------ widget */
  var SCRIPT = document.currentScript;
  var SCRIPT_SRC = SCRIPT && SCRIPT.src ? SCRIPT.src : "";
  if (typeof window !== "undefined" && !window.SHINCHI_KB_GREETINGS && typeof document !== "undefined") {
    try {
      var kbUrl = SCRIPT_SRC ? new URL("shinchi-kb-data.js", SCRIPT_SRC).href : "shinchi-kb-data.js";
      var kbScript = document.createElement("script");
      kbScript.src = kbUrl;
      document.head.appendChild(kbScript);
    } catch (e) {}
  }
  var TITLE = "Shinchi", SUB = "Let's Ask Shinchi!";
  var CHIPS = ["What is Mobile IP?", "Explain Tunneling.", "What is a Home Agent?", "Encapsulation vs Decapsulation", "Explain Packet Delivery", "Ask me Viva Questions"];
  var FALLBACK_AVATAR = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#d9eaff"/><circle cx="32" cy="34" r="17" fill="#ffe3d3"/><path d="M14 32c0-14 9-20 18-20s18 6 18 20c-5-8-10-10-18-10s-13 2-18 10z" fill="#3d52c9"/><circle cx="25" cy="35" r="3" fill="#2f7cf0"/><circle cx="39" cy="35" r="3" fill="#2f7cf0"/><circle cx="32" cy="7" r="3" fill="#ff8fb8"/></svg>');
  var MODE_LABEL = { general_knowledge: "From general knowledge, not your notes", not_in_kb: "Not found in the notes", offline_extract: "Passages from your notes (no AI model)" };
  var KIND_LABEL = { standard: "Standard", website: "Website", book: "Book" };

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function fmtTime(iso) { var d = iso ? new Date(iso) : new Date(); return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
  function newSid() {
    var s = (window.crypto && crypto.randomUUID) ? crypto.randomUUID().replace(/-/g, "") : (Math.random().toString(36).slice(2) + Date.now().toString(36) + "xxxxxxxx");
    return s.slice(0, 32);
  }
  function store(kind, k, v) {
    try { var st = window[kind]; if (v === undefined) return st.getItem(k); if (v === null) st.removeItem(k); else st.setItem(k, v); } catch (e) { return null; }
  }

  function mount(opts) {
    opts = Object.assign({}, window.SHINCHI_CONFIG || {}, opts || {});
    var apiBase = (opts.apiBase != null ? opts.apiBase : "").replace(/\/+$/, "");
    var mode = opts.mode === "inline" ? "inline" : "floating";
    var cssUrl = opts.css || (SCRIPT_SRC ? SCRIPT_SRC.replace(/js\/[^/]*$/, "css/").replace(/[^/]*$/, function (m) { return m; }) : "") ;
    if (!opts.css) {
      cssUrl = SCRIPT_SRC ? new URL("../css/shinchi-widget.css", SCRIPT_SRC).href : "css/shinchi-widget.css";
    }
    var avatarUrl = opts.avatar || (SCRIPT_SRC ? new URL("../assets/shinchi.svg", SCRIPT_SRC).href : "assets/shinchi.svg");
    var host;
    if (mode === "inline") {
      host = document.querySelector(opts.target || "#shinchi-root");
      if (!host) { console.warn("Shinchi: inline target not found"); return null; }
    } else { host = document.createElement("div"); host.id = "shinchi-host"; document.body.appendChild(host); }
    var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
    var link = el("link"); link.rel = "stylesheet"; link.href = cssUrl; root.appendChild(link);

    var KEY_T = "shinchi.v1.transcript", KEY_S = "shinchi.v1.sid";
    var sid = store("sessionStorage", KEY_S) || newSid(); store("sessionStorage", KEY_S, sid);
    var msgs = [];
    try { msgs = JSON.parse(store("sessionStorage", KEY_T) || "[]"); } catch (e) { msgs = []; }
    var busy = false, lastUser = null, stick = true;

    var shell = el("div", "shell " + mode);
    shell.innerHTML =
      (mode === "floating" ? '<button class="launcher" type="button" aria-label="Open Shinchi chat"><img alt="" class="av"><span class="ping"></span></button>' : "") +
      '<section class="panel" role="' + (mode === "floating" ? "dialog" : "region") + '" aria-label="Shinchi chat"' + (mode === "floating" ? " hidden" : "") + ">" +
      '<header class="head"><img alt="" class="av head-av"><div class="titles"><div class="name">' + TITLE + '<span class="dot" title="Checking server..."></span></div><div class="sub">' + SUB + "</div></div>" +
      '<button class="icon clear" type="button" title="Clear chat" aria-label="Clear chat">&#8635;</button>' +
      '<button class="icon fscreen" type="button" title="Full screen" aria-label="Toggle full screen">&#x26F6;</button>' +
      (mode === "floating" ? '<button class="icon close" type="button" title="Close" aria-label="Close chat">&times;</button>' : "") + "</header>" +
      '<div class="log" role="log" aria-live="polite" aria-label="Conversation" tabindex="0"></div>' +
      '<form class="composer" autocomplete="off"><label class="sr" for="shin-in">Message Shinchi</label><textarea id="shin-in" rows="1" maxlength="1500" placeholder="Ask about Mobile IP, tunneling, DCN..."></textarea>' +
      '<button class="send" type="submit" aria-label="Send">&#10148;</button><div class="count" hidden></div></form>' +
      '<div class="foot"></div></section>';
    root.appendChild(shell);
    shell.style.setProperty("--ph", "0");
    var Q = function (s) { return shell.querySelector(s); };
    var panel = Q(".panel"), log = Q(".log"), input = Q("textarea"), form = Q(".composer"), sendBtn = Q(".send"), count = Q(".count"), dot = Q(".dot");
    [].forEach.call(shell.querySelectorAll("img.av"), function (im) { im.src = avatarUrl; im.onerror = function () { im.onerror = null; im.src = FALLBACK_AVATAR; }; });

    /* ---- health */
    (function () {
      var ctl = window.AbortController ? new AbortController() : null;
      var t = setTimeout(function () { if (ctl) ctl.abort(); }, 6000);
      fetch(apiBase + "/api/health", ctl ? { signal: ctl.signal } : {}).then(function (r) { return r.json(); }).then(function (h) {
        dot.className = "dot on"; dot.title = "Online" + (h.llm && !h.llm.enabled ? " (no AI model: showing passages from notes)" : "");
      }).catch(function () { dot.className = "dot on"; dot.title = "Shinchi Assistant: Ready (Local Mobile IP Knowledge Base)"; }).then(function () { clearTimeout(t); });
    })();

    /* ---- scrolling */
    log.addEventListener("scroll", function () { stick = log.scrollHeight - log.scrollTop - log.clientHeight < 80; });
    function scrollDown(force) { if (force || stick) log.scrollTop = log.scrollHeight; }
    function scrollToNode(n) { log.scrollTop = Math.max(0, n.offsetTop - 8); }

    /* ---- render */
    function persist() { store("sessionStorage", KEY_T, JSON.stringify(msgs.slice(-50))); }
    function welcome() {
      var w = el("div", "welcome");
      var im = el("img", "av big"); im.alt = ""; im.src = avatarUrl; im.onerror = function () { im.onerror = null; im.src = FALLBACK_AVATAR; };
      w.appendChild(im);
      w.appendChild(el("h2", null, "Hey! I'm Shinchi 👋"));
      w.appendChild(el("p", "lead", "Your friendly Mobile IP and Data Communication Networks learning assistant."));
      w.appendChild(el("p", null, "Ask me anything about Home Agents, Foreign Agents, Tunneling, Encapsulation, Decapsulation, and more!"));
      var c = el("div", "chips"); CHIPS.forEach(function (t) { c.appendChild(chip(t)); }); w.appendChild(c);
      return w;
    }
    function chip(t) { var b = el("button", "chip", t); b.type = "button"; b.addEventListener("click", function () { send(t); }); return b; }

    function userNode(m) {
      var row = el("div", "msg user");
      var b = el("div", "bubble", m.text);
      row.appendChild(b);
      return row;
    }

    function botNode(m, last) {
      var d = m.data || {}, row = el("div", "msg bot");
      var im = el("img", "av sm"); im.alt = ""; im.src = avatarUrl; im.onerror = function () { im.onerror = null; im.src = FALLBACK_AVATAR; };
      row.appendChild(im);
      var col = el("div", "col");
      row.appendChild(col);

      if (m.error) {
        var eb = el("div", "bubble err", m.text);
        col.appendChild(eb);
        return row;
      }

      var b = el("div", "bubble");
      b.innerHTML = renderMarkdown(m.text);

      // Subtle copy icon inside top-right corner of AI response box
      var cp = el("button", "copy-icon");
      cp.type = "button";
      cp.setAttribute("aria-label", "Copy response");
      cp.title = "Copy response";
      cp.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      cp.addEventListener("click", function (ev) {
        ev.stopPropagation();
        copyText(markdownToPlainText(m.text), cp);
      });
      b.appendChild(cp);

      col.appendChild(b);

      // Suggested questions with distinct white background and black text
      if (last && d.suggestions && d.suggestions.length) {
        var sg = el("div", "chips sugg");
        d.suggestions.slice(0, 4).forEach(function (t) {
          sg.appendChild(chip(t));
        });
        col.appendChild(sg);
      }

      return row;
    }

    function copyText(t, btn) {
      var origHTML = btn.innerHTML;
      function done(ok) {
        if (btn.classList.contains("copy-icon")) {
          btn.innerHTML = ok
            ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
            : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
          btn.title = ok ? "Copied!" : "Copy failed";
          setTimeout(function () {
            btn.innerHTML = origHTML;
            btn.title = "Copy response";
          }, 1400);
        } else {
          btn.textContent = ok ? "✓ Copied" : "Copy failed";
          setTimeout(function () { btn.textContent = "📋 Copy"; }, 1400);
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); });
      else {
        try {
          var ta = el("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
          root.appendChild(ta); ta.select(); var ok = document.execCommand("copy"); ta.remove(); done(ok);
        } catch (e) { done(false); }
      }
    }

    function render(scrollMode) {
      log.textContent = "";
      if (!msgs.length) { log.appendChild(welcome()); return; }
      var lastBot = -1;
      msgs.forEach(function (m, i) { if (m.role === "bot") lastBot = i; });
      msgs.forEach(function (m, i) {
        log.appendChild(m.role === "user" ? userNode(m) : botNode(m, i === lastBot && i === msgs.length - 1));
      });
      if (scrollMode === "end" && msgs.length) scrollDown(true);
    }
    function removeLast() { if (msgs.length && msgs[msgs.length - 1].error) msgs.pop(); if (msgs.length && msgs[msgs.length - 1].role === "user") msgs.pop(); persist(); }

    function typing() {
      var r = el("div", "msg bot typing");
      var im = el("img", "av sm"); im.alt = ""; im.src = avatarUrl; im.onerror = function () { im.onerror = null; im.src = FALLBACK_AVATAR; };
      r.appendChild(im);
      var b = el("div", "bubble");
      b.innerHTML = '<span class="dots" aria-label="Shinchi is thinking"><i></i><i></i><i></i></span>';
      r.appendChild(b);
      return r;
    }

    function setBusy(v) { busy = v; sendBtn.disabled = v; input.setAttribute("aria-busy", v ? "true" : "false"); }

    /* ------------------------------------------------------------------ Shinchi RAG Retrieval System */
    function stemWord(w) {
      w = String(w || "").toLowerCase().trim();
      var suffixes = ["ing", "tions", "tion", "ular", "ulate", "ulation", "ed", "es", "s"];
      for (var i = 0; i < suffixes.length; i++) {
        var s = suffixes[i];
        if (w.length > s.length + 3 && w.slice(-s.length) === s) {
          return w.slice(0, -s.length);
        }
      }
      return w;
    }

    function normQuery(s) {
      return String(s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    }

    var STOP_WORDS = {
      "what": 1, "is": 1, "a": 1, "an": 1, "the": 1, "in": 1, "and": 1, "or": 1, "of": 1,
      "how": 1, "does": 1, "do": 1, "to": 1, "for": 1, "explain": 1, "tell": 1, "me": 1,
      "about": 1, "can": 1, "you": 1, "are": 1, "it": 1, "its": 1, "with": 1, "by": 1,
      "at": 1, "on": 1, "from": 1, "as": 1, "please": 1, "give": 1
    };

    function extractCoreSubject(s) {
      return s.replace(/^(what\s+is\s+(a\s+|an\s+|the\s+)?|what\s+are\s+(the\s+)?|explain\s+(the\s+)?|how\s+does\s+(an?\s+|the\s+)?|how\s+is\s+(an?\s+|the\s+)?|describe\s+(the\s+)?)/i, "")
        .replace(/\(ha\)|\(fa\)|\(mn\)|\(cn\)|\(coa\)/gi, "")
        .trim();
    }

    function getOfflineKBReply(query) {
      var greetingsKB = window.SHINCHI_KB_GREETINGS || [];
      var technicalKB = window.SHINCHI_KB_TECHNICAL || [];

      var qNorm = normQuery(query);
      if (!qNorm) {
        return {
          text: "Please enter a question about Mobile IP, Home Agents, Foreign Agents, Tunneling, Encapsulation, or Agent Discovery!",
          data: { suggestions: ["What is Mobile IP?", "What is a Home Agent?", "Explain Encapsulation", "What is Care-of Address?"] }
        };
      }

      var qWords = qNorm.split(" ").filter(function (w) { return w.length > 0; });
      var qStems = qWords.filter(function (w) { return !STOP_WORDS[w]; }).map(stemWord);
      var qCore = extractCoreSubject(qNorm);

      // Special Viva / Exam query handling
      if (qNorm.indexOf("viva") !== -1 || qNorm.indexOf("exam question") !== -1 || qNorm.indexOf("quiz question") !== -1) {
        return {
          text: "Here are essential **Mobile IP Viva & Examination Questions**:\n\n" +
                "1. **What is Mobile IP and what problem does it solve?**\n" +
                "   *Answer:* It enables roaming hosts to maintain permanent Home IP addresses across visited subnets without dropping TCP connections (RFC 5944).\n\n" +
                "2. **What is the difference between Home Agent (HA) and Foreign Agent (FA)?**\n" +
                "   *Answer:* HA intercepts packets on the home link and encapsulates them into tunnels. FA decapsulates tunneled packets on the visited subnet and delivers them to the Mobile Node.\n\n" +
                "3. **What is Care-of Address (CoA)?**\n" +
                "   *Answer:* A topological IP address representing the MN's current point of attachment (either an FA-CoA or a Collocated CoA acquired via DHCP).\n\n" +
                "4. **What is Triangular Routing and how is it mitigated?**\n" +
                "   *Answer:* CN sends packets via HA -> FA -> MN, while replies go MN -> CN directly. Reverse Tunneling (RFC 3024) solves ingress filtering.",
          data: { suggestions: ["What is a Home Agent?", "What is a Foreign Agent?", "Explain Encapsulation", "What is Triangular Routing?"] }
        };
      }

      // Special Packet Dash guide query handling
      if (qNorm.indexOf("packet dash") !== -1 || (qNorm.indexOf("game") !== -1 && qNorm.indexOf("play") !== -1)) {
        return {
          text: "**Packet Dash** is the interactive tunneling game in this lab!\n\n" +
                "- **Objective:** Guide a glowing packet from Correspondent Node to Mobile Node across 5 network stages.\n" +
                "- **Stage 1 (Generation):** Original packet created with payload data.\n" +
                "- **Stage 2 (HA Encapsulation):** Home Agent wraps the packet inside a green outer IP header (HA -> CoA).\n" +
                "- **Stage 3 (Tunneling):** The encapsulated datagram traverses intermediate routers toward the FA.\n" +
                "- **Stage 4 (FA Decapsulation):** Foreign Agent strips the outer header, recovering the original packet.\n" +
                "- **Stage 5 (Delivery):** Mobile Node receives your exact custom message!\n\n" +
                "Use arrow keys to steer, Space to jump obstacles, and collect data bits to score!",
          data: { suggestions: ["What is Encapsulation?", "What is a Foreign Agent?", "What is a Home Agent?", "What is Reverse Tunneling?"] }
        };
      }

      // 1. Evaluate Greetings / Casual Conversation
      var bestGScore = 0;
      var bestG = null;
      for (var gi = 0; gi < greetingsKB.length; gi++) {
        var g = greetingsKB[gi];
        var gScore = 0;
        var examples = g.user_examples || [];
        for (var ei = 0; ei < examples.length; ei++) {
          var exNorm = normQuery(examples[ei]);
          if (qNorm === exNorm) { gScore = 180; break; }
          if (exNorm.split(" ").length > 1 && qNorm.indexOf(exNorm) !== -1) {
            if (gScore < 95) gScore = 95;
          }
        }
        var gKeywords = g.keywords || [];
        for (var ki = 0; ki < gKeywords.length; ki++) {
          var kwNorm = normQuery(gKeywords[ki]);
          if (qWords.indexOf(kwNorm) !== -1) gScore += 40;
        }
        if (gScore > bestGScore) {
          bestGScore = gScore;
          bestG = g;
        }
      }

      // 2. Evaluate Technical Mobile IP Knowledge Base
      var bestMScore = 0;
      var bestM = null;
      for (var mi = 0; mi < technicalKB.length; mi++) {
        var rec = technicalKB[mi];
        var qRecNorm = normQuery(rec.question);
        var recCore = extractCoreSubject(qRecNorm);
        var mScore = 0;

        // Exact title match or core subject match
        if (qNorm === qRecNorm) {
          mScore += 350;
        } else if (qNorm.length >= 8 && qRecNorm.indexOf(qNorm) !== -1) {
          mScore += 180;
        } else if (qRecNorm.length >= 8 && qNorm.indexOf(qRecNorm) !== -1) {
          mScore += 180;
        }

        if (qCore.length >= 4 && recCore.indexOf(qCore) === 0) {
          mScore += 170;
        }

        var recWords = qRecNorm.split(" ").filter(function (w) { return w.length > 0; });
        var recStems = recWords.filter(function (w) { return !STOP_WORDS[w]; }).map(stemWord);

        // Question words & stems overlap
        for (var qsi = 0; qsi < qStems.length; qsi++) {
          var qs = qStems[qsi];
          if (recStems.indexOf(qs) !== -1) mScore += 50;
        }
        for (var qwi = 0; qwi < qWords.length; qwi++) {
          var qw = qWords[qwi];
          if (!STOP_WORDS[qw] && recWords.indexOf(qw) !== -1) mScore += 30;
        }

        // Keyword matches
        var keywords = rec.keywords || [];
        for (var kwi = 0; kwi < keywords.length; kwi++) {
          var kw = normQuery(keywords[kwi]);
          if (kw.length >= 3 && qNorm.indexOf(kw) !== -1) {
            mScore += 75;
          } else {
            var kwStems = kw.split(" ").map(stemWord);
            for (var si = 0; si < qStems.length; si++) {
              if (kwStems.indexOf(qStems[si]) !== -1) mScore += 25;
            }
          }
        }

        // Answer stem overlap
        if (mScore < 50 && qStems.length > 0) {
          var ansNorm = normQuery(rec.answer);
          var ansStems = ansNorm.split(" ").filter(function (w) { return w.length > 2; }).map(stemWord);
          var aCount = 0;
          for (var asi = 0; asi < qStems.length; asi++) {
            if (ansStems.indexOf(qStems[asi]) !== -1) aCount++;
          }
          if (aCount >= 2) mScore += aCount * 14;
        }

        if (mScore > bestMScore) {
          bestMScore = mScore;
          bestM = rec;
        }
      }

      // 3. Construct Final RAG Response
      // If strong technical match, return technical answer
      if (bestMScore >= 50 && bestMScore >= bestGScore) {
        var ansText = bestM.answer;

        // Include structured flow steps / flowchart if available
        if (bestM.flow_steps && bestM.flow_steps.length > 0) {
          var steps = bestM.flow_steps;
          ansText += "\n\n**📋 Operational Flow:**\n";
          if (steps.length >= 3) {
            var chart = steps.map(function (s, idx) {
              var shortTitle = s.length > 25 ? s.slice(0, 22) + "…" : s;
              return "[" + (idx + 1) + ". " + shortTitle + "]";
            }).join(" ➔ ");
            ansText += chart + "\n\n";
          }
          for (var stepIdx = 0; stepIdx < steps.length; stepIdx++) {
            ansText += (stepIdx + 1) + ". " + steps[stepIdx] + "\n";
          }
        }

        // Generate contextually relevant suggestions
        var suggs = [];
        var cat = bestM.category;
        for (var ci = 0; ci < technicalKB.length; ci++) {
          var other = technicalKB[ci];
          if (other.id !== bestM.id && other.category === cat && suggs.length < 3) {
            suggs.push(other.question);
          }
        }
        if (suggs.length < 3) {
          var defaultPool = ["What is a Home Agent?", "What is Care-of Address?", "Explain Encapsulation vs Decapsulation", "What is Triangular Routing?"];
          for (var dpi = 0; dpi < defaultPool.length; dpi++) {
            if (defaultPool[dpi] !== bestM.question && suggs.indexOf(defaultPool[dpi]) === -1 && suggs.length < 3) {
              suggs.push(defaultPool[dpi]);
            }
          }
        }

        return {
          text: ansText,
          data: { suggestions: suggs }
        };
      }

      // If greeting match, return greeting response
      if (bestGScore >= 45) {
        var responses = bestG.responses || ["Hello! How can I help with your Mobile IP studies today?"];
        var chosenResponse = responses[Math.floor(Math.random() * responses.length)];
        return {
          text: chosenResponse,
          data: { suggestions: ["What is Mobile IP?", "What is a Home Agent?", "Explain Encapsulation", "How does Packet Delivery work?"] }
        };
      }

      // Weak technical match
      if (bestMScore >= 35) {
        return {
          text: bestM.answer,
          data: { suggestions: ["What is a Home Agent?", "What is a Foreign Agent?", "What is Care-of Address?"] }
        };
      }

      // Strict No Hallucination Fallback
      return {
        text: "I couldn't find information regarding that specific query in the current Mobile IP knowledge base. Please try asking about Home Agents, Foreign Agents, Care-of Addresses, Encapsulation, Tunneling, Registration, or Agent Discovery.",
        data: { suggestions: ["What is Mobile IP?", "What is a Home Agent?", "What is Care-of Address?", "What is Triangle Routing?"] }
      };
    }

    function send(text) {
      text = (text || "").trim();
      if (!text || busy) return;
      if (text.length > 1500) text = text.slice(0, 1500);

      msgs.push({ role: "user", text: text, ts: new Date().toISOString() });
      persist();
      render();

      var t = typing();
      log.appendChild(t);
      scrollDown(true);
      setBusy(true);

      // Instant client-side RAG retrieval
      setTimeout(function () {
        var fb = getOfflineKBReply(text);
        msgs.push({
          role: "bot",
          text: fb.text,
          ts: new Date().toISOString(),
          data: fb.data
        });
        setBusy(false);
        persist();
        render();
        var last = log.lastElementChild;
        if (last && stick) scrollToNode(last);
        input.focus();
      }, 140);
    }

    function clearChat() {
      fetch(apiBase + "/api/session/" + encodeURIComponent(sid), { method: "DELETE" }).catch(function () {});
      msgs = []; sid = newSid(); store("sessionStorage", KEY_S, sid); persist(); render(); input.value = ""; autosize();
    }

    function autosize() { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 140) + "px"; var n = input.value.length; count.hidden = n < 1200; count.textContent = n + "/1500"; }
    input.addEventListener("input", autosize);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : submit(); } });
    function submit() { var v = input.value; input.value = ""; autosize(); send(v); }
    form.addEventListener("submit", function (e) { e.preventDefault(); submit(); });
    Q(".clear").addEventListener("click", clearChat);

    var fsBtn = Q(".fscreen");
    var isFs = false;
    function toggleFullScreen() {
      isFs = !isFs;
      panel.classList.toggle("fullscreen", isFs);
      shell.classList.toggle("is-fullscreen", isFs);
      if (fsBtn) {
        fsBtn.innerHTML = isFs ? "&#x2921;" : "&#x26F6;";
        fsBtn.title = isFs ? "Exit full screen" : "Full screen";
        fsBtn.setAttribute("aria-label", isFs ? "Exit full screen" : "Full screen");
      }
      setTimeout(function () { input.focus(); if (msgs.length) scrollDown(true); }, 50);
    }
    if (fsBtn) fsBtn.addEventListener("click", toggleFullScreen);

    function open() { if (mode !== "floating") return; panel.hidden = false; shell.classList.add("open"); setTimeout(function () { input.focus(); if (msgs.length) scrollDown(true); }, 50); }
    function close() {
      if (mode !== "floating") return;
      panel.hidden = true;
      shell.classList.remove("open");
      if (isFs) toggleFullScreen();
      var l = Q(".launcher");
      if (l) l.focus();
    }
    if (mode === "floating") {
      Q(".launcher").addEventListener("click", function () { panel.hidden ? open() : close(); });
      Q(".close").addEventListener("click", close);
      panel.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
      if (opts.open) open();
    }
    function vv() { if (window.visualViewport && mode === "floating") shell.style.setProperty("--vh", window.visualViewport.height + "px"); }
    if (window.visualViewport) { window.visualViewport.addEventListener("resize", vv); vv(); }

    render("end");
    return { open: open, close: close, send: send, clear: clearChat, host: host };
  }

  var Shinchi = { mount: mount, renderMarkdown: renderMarkdown, markdownToPlainText: markdownToPlainText, version: "1.0.0" };
  window.Shinchi = Object.assign(window.Shinchi || {}, Shinchi);

  function auto() {
    if (window.SHINCHI_NO_AUTO) return;
    var ds = (SCRIPT && SCRIPT.dataset) || {};
    var cfg = window.SHINCHI_CONFIG || {};
    var opts = { apiBase: ds.apiBase != null ? ds.apiBase : (cfg.apiBase != null ? cfg.apiBase : ""), mode: ds.mode || cfg.mode || "floating", target: ds.target || cfg.target, open: ds.open === "true" || cfg.open };
    if (ds.css) opts.css = ds.css;
    if (ds.avatar) opts.avatar = ds.avatar;
    window.shinchiInstance = mount(opts);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto); else auto();
})();
