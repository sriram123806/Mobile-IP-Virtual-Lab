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
      var row = el("div", "msg user"); var b = el("div", "bubble", m.text); row.appendChild(b);
      row.appendChild(el("div", "meta", fmtTime(m.ts))); return row;
    }
    function botNode(m, last) {
      var d = m.data || {}, refs = d.references || [], row = el("div", "msg bot");
      var im = el("img", "av sm"); im.alt = ""; im.src = avatarUrl; im.onerror = function () { im.onerror = null; im.src = FALLBACK_AVATAR; }; row.appendChild(im);
      var col = el("div", "col"); row.appendChild(col);
      if (m.error) { var eb = el("div", "bubble err", m.text); col.appendChild(eb); if (m.retry) { var rb = el("button", "retry", "Try again"); rb.type = "button"; rb.addEventListener("click", function () { removeLast(); send(m.retry, true); }); col.appendChild(rb); } return row; }
      var ids = new Set(refs.map(function (r) { return r.id; }));
      var b = el("div", "bubble"); b.innerHTML = renderMarkdown(m.text, ids); col.appendChild(b);
      if (d.interpreted_as) col.appendChild(el("div", "note", "Understood as: " + d.interpreted_as));
      if (MODE_LABEL[d.answer_mode]) col.appendChild(el("div", "modeLabel " + d.answer_mode, MODE_LABEL[d.answer_mode]));
      if (d.notice) col.appendChild(el("div", "note info", d.notice));
      if (refs.length && d.answer_mode !== "quiz") col.appendChild(sources(refs));
      if (d.resources && d.resources.length) col.appendChild(resources(d.resources));
      var meta = el("div", "meta"); meta.appendChild(document.createTextNode(fmtTime(m.ts)));
      var cp = el("button", "copy", "Copy"); cp.type = "button"; cp.setAttribute("aria-label", "Copy answer");
      cp.addEventListener("click", function () { copyText(markdownToPlainText(m.text), cp); }); meta.appendChild(cp); col.appendChild(meta);
      if (last && d.suggestions && d.suggestions.length) { var sg = el("div", "chips sugg"); d.suggestions.forEach(function (t) { sg.appendChild(chip(t)); }); col.appendChild(sg); }
      b.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest("a.cite"); if (!a) return; e.preventDefault();
        var li = col.querySelector('[data-src="' + a.getAttribute("data-ref") + '"]'); var det = col.querySelector("details.sources");
        if (li && det) { det.open = true; li.classList.add("flash"); li.scrollIntoView({ block: "nearest", behavior: "smooth" }); setTimeout(function () { li.classList.remove("flash"); }, 1600); }
      });
      return row;
    }
    function sources(refs) {
      var det = el("details", "sources"); det.appendChild(el("summary", null, "Sources (" + refs.length + ")"));
      var ul = el("ul");
      refs.forEach(function (r) {
        var li = el("li"); li.setAttribute("data-src", r.id);
        var t = el("div", "st"); t.appendChild(el("span", "sid", "[" + r.id + "]"));
        t.appendChild(document.createTextNode(" " + r.title + (r.section ? " › " + r.section : "") + (r.page ? " · p." + r.page + (r.page_end ? "–" + r.page_end : "") : "")));
        if (r.doc_status === "starter") t.appendChild(el("span", "badge", "Starter notes"));
        if (r.cited === false) t.appendChild(el("span", "badge soft", "consulted"));
        li.appendChild(t);
        if (r.snippet) li.appendChild(el("div", "snip", r.snippet));
        if (r.source) li.appendChild(el("div", "path", r.source));
        ul.appendChild(li);
      });
      det.appendChild(ul); return det;
    }
    function resources(list) {
      var wrap = el("div", "res"); wrap.appendChild(el("div", "reshead", "Learn more"));
      list.forEach(function (r) {
        var card = el("div", "card " + (r.status || ""));
        var top = el("div", "ct"); var u = r.url && safeUrl(r.url);
        if (u) { var a = el("a", null, r.title); a.href = u; a.target = "_blank"; a.rel = "noopener noreferrer"; top.appendChild(a); } else top.appendChild(el("span", "ctitle", r.title));
        card.appendChild(top);
        var tags = el("div", "tags"); tags.appendChild(el("span", "tag", KIND_LABEL[r.kind] || r.kind));
        if (r.badge) tags.appendChild(el("span", "tag warn", r.badge)); else if (r.status === "historical" || r.status === "superseded") tags.appendChild(el("span", "tag warn", r.status));
        if (r.authors) tags.appendChild(el("span", "tag soft", r.authors));
        card.appendChild(tags);
        var desc = r.description || r.covers; if (desc) card.appendChild(el("div", "cd", desc));
        if (!u && r.note) card.appendChild(el("div", "cd note", r.note));
        wrap.appendChild(card);
      });
      return wrap;
    }
    function copyText(t, btn) {
      function done(ok) { btn.textContent = ok ? "Copied" : "Copy failed"; setTimeout(function () { btn.textContent = "Copy"; }, 1400); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); });
      else { try { var ta = el("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0"; root.appendChild(ta); ta.select(); var ok = document.execCommand("copy"); ta.remove(); done(ok); } catch (e) { done(false); } }
    }

    function render(scrollMode) {
      log.textContent = "";
      if (!msgs.length) { log.appendChild(welcome()); return; }
      var lastBot = -1; msgs.forEach(function (m, i) { if (m.role === "bot") lastBot = i; });
      msgs.forEach(function (m, i) { log.appendChild(m.role === "user" ? userNode(m) : botNode(m, i === lastBot && i === msgs.length - 1)); });
      if (scrollMode === "end" && msgs.length) scrollDown(true);
    }
    function removeLast() { if (msgs.length && msgs[msgs.length - 1].error) msgs.pop(); if (msgs.length && msgs[msgs.length - 1].role === "user") msgs.pop(); persist(); }

    function typing() { var r = el("div", "msg bot typing"); var im = el("img", "av sm"); im.alt = ""; im.src = avatarUrl; im.onerror = function () { im.onerror = null; im.src = FALLBACK_AVATAR; }; r.appendChild(im);
      var b = el("div", "bubble"); b.innerHTML = '<span class="dots" aria-label="Shinchi is typing"><i></i><i></i><i></i></span><span class="slow" hidden></span>'; r.appendChild(b); return r; }

    function setBusy(v) { busy = v; sendBtn.disabled = v; input.setAttribute("aria-busy", v ? "true" : "false"); }

    
  /* ------------------------------------------------------------------ Offline Mobile IP RAG Knowledge Base */
  function getOfflineKBReply(q) {
    var raw = (q || "").toLowerCase();
    
    // Viva questions
    if (raw.indexOf("viva") !== -1 || raw.indexOf("question") !== -1 || raw.indexOf("quiz") !== -1 || raw.indexOf("exam") !== -1) {
      return {
        text: "Here are key **Mobile IP Viva Questions** to test your knowledge:\n\n" +
              "1. **What is Mobile IP and what problem does it solve?**\n" +
              "   *Answer:* It enables a Mobile Node to keep its permanent Home Address while moving across foreign networks, avoiding TCP connection breakdown (RFC 5944).\n\n" +
              "2. **What is the difference between Home Agent and Foreign Agent?**\n" +
              "   *Answer:* Home Agent (HA) intercepts packets at the home network and encapsulates them into tunnels. Foreign Agent (FA) decapsulates tunneled packets on the foreign network and delivers them to the Mobile Node.\n\n" +
              "3. **What is Care-of Address (CoA)?**\n" +
              "   *Answer:* A temporary IP address representing the mobile node's current topological location. It is either an FA-CoA (shared) or Collocated CoA (CCoA acquired via DHCP).\n\n" +
              "4. **What is Triangular Routing and how is it addressed?**\n" +
              "   *Answer:* Packets from CN travel CN -> HA -> FA -> MN, while replies go MN -> CN directly. Reverse Tunneling (RFC 3024) solves ingress filtering; Route Optimization updates CN's binding cache.",
        data: {
          answer_mode: "offline_extract",
          interpreted_as: "Viva examination and technical question bank",
          references: [
            { id: "viva_01", title: "Mobile IP Viva Question Bank", section: "Q1-Q20", page: 1, snippet: "Comprehensive viva revision for Data Communication and Mobile Networks." },
            { id: "rfc5944", title: "RFC 5944 - IP Mobility Support for IPv4", section: "Section 1", snippet: "Standard specification of Mobile IPv4 protocol and agent roles." }
          ],
          suggestions: ["Explain Tunneling", "Encapsulation vs Decapsulation", "What is Reverse Tunneling?", "How does Packet Dash work?"]
        }
      };
    }

    // Packet Dash Game questions
    if (raw.indexOf("packet dash") !== -1 || raw.indexOf("game") !== -1 || raw.indexOf("dash") !== -1 || raw.indexOf("stage") !== -1) {
      return {
        text: "**Packet Dash** is the interactive tunneling game in this lab! Here is how it works:\n\n" +
              "- **Objective:** Guide a glowing blue data packet from the **Correspondent Node** to the **Mobile Node** across 5 stages.\n" +
              "- **Stage 1 (Packet Journey Begins):** Original packet leaves the Correspondent Node addressed to the Home Address.\n" +
              "- **Stage 2 (Home Agent):** Home Agent performs **Encapsulation** - wraps the original packet in a transparent green outer IP header (`HA -> CoA`).\n" +
              "- **Stage 3 (Tunnel Adventure):** The encapsulated packet travels securely through the IP-in-IP tunnel toward the Foreign Agent.\n" +
              "- **Stage 4 (Foreign Agent):** Foreign Agent performs **Decapsulation** - removes the green outer IP header in a burst of particles!\n" +
              "- **Stage 5 (Delivery):** The exact original packet and payload are delivered intact to the Mobile Node!\n\n" +
              "You can enter a custom message (like `Hello, I'm Sriram!`) before starting, and watch your message travel through every stage!",
        data: {
          answer_mode: "offline_extract",
          interpreted_as: "Packet Dash interactive educational game guide",
          references: [
            { id: "game_guide", title: "Packet Dash Game Overview", section: "5 Stages & Tunneling", snippet: "Visualizes encapsulation and decapsulation during gameplay." }
          ],
          suggestions: ["What is Mobile IP?", "What is a Home Agent?", "Explain Tunneling", "Ask me Viva Questions"]
        }
      };
    }

    // Home Agent
    if (raw.indexOf("home agent") !== -1 || raw.indexOf("ha") !== -1 && raw.length < 5) {
      return {
        text: "The **Home Agent (HA)** is a router on the Mobile Node's permanent home network (RFC 5944).\n\n" +
              "**Primary Functions:**\n" +
              "- **Mobility Binding:** Maintains the binding table mapping the Mobile Node's permanent Home Address to its temporary Care-of Address (CoA).\n" +
              "- **Proxy ARP:** When the MN is away, HA answers ARP requests for the MN's Home Address using its own MAC address.\n" +
              "- **Encapsulation & Tunneling:** Intercepts datagrams destined for the MN, adds an outer IP header (`Source: HA, Dest: CoA`, RFC 2003), and forwards them into the tunnel.\n" +
              "- **Registration Processing:** Validates and accepts registration requests sent by or on behalf of the Mobile Node.",
        data: {
          answer_mode: "offline_extract",
          interpreted_as: "Home Agent architecture and operations",
          references: [
            { id: "rfc5944_sec3", title: "RFC 5944: Home Agent Operations", section: "Section 3.8", snippet: "Binding tables, Proxy ARP, and encapsulation mechanisms." },
            { id: "mip_notes_01", title: "Mobile IP Architecture Notes", section: "Specialized Nodes", snippet: "HA acts as the mobility anchor on the home subnet." }
          ],
          suggestions: ["What is a Foreign Agent?", "What is Care-of Address?", "Encapsulation vs Decapsulation", "What is Reverse Tunneling?"]
        }
      };
    }

    // Foreign Agent
    if (raw.indexOf("foreign agent") !== -1 || raw.indexOf("fa") !== -1 && raw.length < 5) {
      return {
        text: "The **Foreign Agent (FA)** is a specialized router on the visited (foreign) network that provides routing services to registered mobile nodes (RFC 5944).\n\n" +
              "**Primary Functions:**\n" +
              "- **Agent Advertisements:** Periodically broadcasts ICMP Agent Advertisements announcing its availability and Care-of Address (FA-CoA).\n" +
              "- **Registration Relay:** Relays registration requests from the MN to the HA and sends back the registration replies.\n" +
              "- **Decapsulation:** Terminates the tunnel from the HA, strips the outer IP header, and delivers the inner original IP packet to the Mobile Node.\n" +
              "- **Default Router:** Serves as the default local router for visiting mobile nodes.",
        data: {
          answer_mode: "offline_extract",
          interpreted_as: "Foreign Agent role and protocol duties",
          references: [
            { id: "rfc5944_sec4", title: "RFC 5944: Foreign Agent Operations", section: "Section 3.7", snippet: "Advertisements, visitor list management, and decapsulation." }
          ],
          suggestions: ["What is Care-of Address?", "What is a Home Agent?", "Explain Tunneling", "Encapsulation vs Decapsulation"]
        }
      };
    }

    // Encapsulation vs Decapsulation or Tunneling
    if (raw.indexOf("encapsulation") !== -1 || raw.indexOf("decapsulation") !== -1 || raw.indexOf("tunnel") !== -1 || raw.indexOf("ip-in-ip") !== -1) {
      return {
        text: "### Tunneling, Encapsulation & Decapsulation (RFC 2003)\n\n" +
              "**Tunneling** is the mechanism used to carry datagrams across the Internet between the Home Agent and the Care-of Address without changing the original packet.\n\n" +
              "1. **Encapsulation (at Home Agent):**\n" +
              "   - When a packet from a Correspondent Node arrives at HA, HA wraps the **entire original packet** inside a new outer IP header.\n" +
              "   - **Outer Header:** `Source = HA IP`, `Destination = Care-of Address (CoA)`, `Protocol = 4 (IP-in-IP)`.\n" +
              "   - **Inner Packet:** Kept 100% intact with `Source = CN IP`, `Destination = Mobile Node Home Address`.\n\n" +
              "2. **Decapsulation (at Foreign Agent or MN):**\n" +
              "   - At the tunnel endpoint, the Foreign Agent receives the datagram, inspects Protocol 4, and strips the outer IP header.\n" +
              "   - The recovered original IP datagram is delivered directly to the Mobile Node over the local link.",
        data: {
          answer_mode: "offline_extract",
          interpreted_as: "IP-in-IP Encapsulation and Tunneling",
          references: [
            { id: "rfc2003", title: "RFC 2003: IP Encapsulation within IP", section: "Section 2", snippet: "Outer header prepending and protocol 4 tunneling specification." },
            { id: "mip_notes_03", title: "Tunneling & Encapsulation Guide", section: "Header Structure", snippet: "Preserving original TCP/IP socket connections during mobility." }
          ],
          suggestions: ["What is a Home Agent?", "What is a Foreign Agent?", "What is Care-of Address?", "What is Triangular Routing?"]
        }
      };
    }

    // Care-of Address
    if (raw.indexOf("care-of") !== -1 || raw.indexOf("care of") !== -1 || raw.indexOf("coa") !== -1) {
      return {
        text: "A **Care-of Address (CoA)** identifies the Mobile Node's current topological location on the visited foreign network (RFC 5944).\n\n" +
              "There are two types of Care-of Addresses:\n" +
              "1. **Foreign Agent CoA (FA-CoA):**\n" +
              "   - The IP address of the Foreign Agent itself, advertised via Agent Advertisements.\n" +
              "   - Can be shared by multiple mobile nodes visiting that network.\n" +
              "   - The tunnel ends at the FA, which decapsulates the packets.\n\n" +
              "2. **Collocated CoA (CCoA):**\n" +
              "   - An individual IP address assigned directly to the Mobile Node via DHCP or local network configuration.\n" +
              "   - The tunnel ends directly at the Mobile Node, which must decapsulate its own packets.",
        data: {
          answer_mode: "offline_extract",
          interpreted_as: "Care-of Address classifications",
          references: [
            { id: "rfc5944_sec1", title: "RFC 5944: CoA Definitions", section: "Section 1.4", snippet: "FA-CoA vs Collocated CoA comparison." }
          ],
          suggestions: ["What is a Foreign Agent?", "What is a Home Agent?", "Explain Tunneling", "What is Reverse Tunneling?"]
        }
      };
    }

    // Triangle routing or reverse tunneling
    if (raw.indexOf("triangle") !== -1 || raw.indexOf("triangular") !== -1 || raw.indexOf("reverse tunnel") !== -1) {
      return {
        text: "### Triangular Routing & Reverse Tunneling (RFC 3024)\n\n" +
              "**Triangular Routing:**\n" +
              "- In basic Mobile IPv4, incoming packets travel: `CN -> HA -> (Tunnel) -> FA -> MN`.\n" +
              "- Outgoing replies travel: `MN -> CN` directly through standard IP routing.\n" +
              "- This triangular path adds delay and transmission latency.\n\n" +
              "**Why Reverse Tunneling is Needed:**\n" +
              "- When MN sends packets directly to CN, the packets have `Source IP = Home Address`, but emerge from a foreign subnet.\n" +
              "- Intermediate firewalls with **Ingress Filtering (RFC 2827)** drop these packets as spoofed!\n" +
              "- **Solution (RFC 3024):** The MN tunnels outbound packets back to the Home Agent (`FA -> HA`), and the Home Agent forwards them to CN with valid topological routing.",
        data: {
          answer_mode: "offline_extract",
          interpreted_as: "Triangle routing and ingress filtering mitigation",
          references: [
            { id: "rfc3024", title: "RFC 3024: Reverse Tunneling for Mobile IP", section: "Section 1", snippet: "Mitigating ingress filtering with reverse tunnels." },
            { id: "rfc2827", title: "RFC 2827: Network Ingress Filtering", section: "Defeating DoS", snippet: "Dropping spoofed source IP packets at ISP borders." }
          ],
          suggestions: ["What is Mobile IP?", "What is a Home Agent?", "Explain Tunneling", "Ask me Viva Questions"]
        }
      };
    }

    // Default Mobile IP overview
    return {
      text: "**Mobile IP (RFC 5944)** allows mobile devices to roam between different networks (Wi-Fi, Cellular, Subnets) while maintaining continuous TCP connections using a permanent **Home Address**.\n\n" +
            "**Core Components in this Virtual Lab:**\n" +
            "- **Mobile Node (MN):** Roaming host that keeps its permanent IP address.\n" +
            "- **Home Agent (HA):** Subnet anchor that intercepts packets using Proxy ARP and encapsulates them.\n" +
            "- **Foreign Agent (FA):** Visited network gateway that advertises Care-of Addresses and decapsulates packets.\n" +
            "- **Tunneling (RFC 2003):** IP-in-IP encapsulation wrapping packets during transport.\n\n" +
            "Feel free to ask me anything about the lab components, simulation, viva questions, or Packet Dash game!",
      data: {
        answer_mode: "offline_extract",
        interpreted_as: "Mobile IPv4 fundamentals",
        references: [
          { id: "rfc5944", title: "RFC 5944: IP Mobility Support for IPv4", section: "Overview", snippet: "Standard protocol for seamless IP roaming." },
          { id: "dcn_lab", title: "DCN Virtual Laboratory Manual", section: "Lab Objectives", snippet: "HA and FA tunneling practical visualization." }
        ],
        suggestions: ["What is a Home Agent?", "What is a Foreign Agent?", "Explain Tunneling", "Encapsulation vs Decapsulation", "Ask me Viva Questions", "How does Packet Dash work?"]
      }
    };
  }

    function send(text, isRetry) {
      text = (text || "").trim(); if (!text || busy) return;
      if (text.length > 1500) text = text.slice(0, 1500);
      lastUser = text; stick = true;
      if (!isRetry || !msgs.length || msgs[msgs.length - 1].role !== "user") msgs.push({ role: "user", text: text, ts: new Date().toISOString() });
      persist(); render(); var t = typing(); log.appendChild(t); scrollDown(true); setBusy(true);
      var slowTimer = setTimeout(function () { var s = t.querySelector(".slow"); if (s) { s.hidden = false; s.textContent = "Still thinking... the server may be waking up."; } }, 20000);
      var ctl = window.AbortController ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, 90000);
      fetch(apiBase + "/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sid, message: text }), signal: ctl ? ctl.signal : undefined })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, j: j }; }); })
        .then(function (res) {
          if (res.ok) { msgs.push({ role: "bot", text: res.j.reply || "", ts: res.j.timestamp, data: res.j }); }
          else {
            // For 402, 403, 405 and similar codes, fall back to local knowledge base
            if (res.status === 402 || res.status === 403 || res.status === 405 || res.status === 401 || (res.status >= 400 && res.status < 500 && res.status !== 422 && res.status !== 429)) {
              var fb = getOfflineKBReply(text);
              if (fb) { msgs.push({ role: "bot", text: fb.text, ts: new Date().toISOString(), data: fb.data }); return; }
            }
            var m = res.status === 429 ? "You're sending messages quickly. Please wait " + ((res.j && res.j.retry_after) || 10) + " seconds and try again."
              : res.status === 422 ? "That message couldn't be sent. Keep it under 1500 characters."
              : res.status >= 500 ? (function(){ var fb = getOfflineKBReply(text); if(fb){ msgs.push({role:"bot",text:fb.text,ts:new Date().toISOString(),data:fb.data}); return null; } return "Shinchi had a problem answering. Please try again in a moment."; })()
              : "Something went wrong (" + res.status + ").";
            if (m) msgs.push({ role: "bot", error: true, text: m, retry: text, ts: new Date().toISOString() });
          }
        })
        .catch(function () {
          var fb = getOfflineKBReply(text);
          if (fb) {
            msgs.push({ role: "bot", text: fb.text, ts: new Date().toISOString(), data: fb.data });
          } else {
            msgs.push({ role: "bot", error: true, text: "Can't reach Shinchi's server right now. Check your connection and try again.", retry: text, ts: new Date().toISOString() });
          }
        })
        .then(function () { clearTimeout(slowTimer); clearTimeout(to); setBusy(false); persist(); render(); var last = log.lastElementChild; if (last) { if (stick) scrollToNode(last); } input.focus(); });
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
