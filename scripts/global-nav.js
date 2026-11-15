/* ================================================================
   Mobile IP Virtual Lab – Global Navigation & Shared Utilities
   Builds the unified glassmorphism nav bar and shared helpers.
================================================================ */
(function () {
  'use strict';

  /* Navigation link map – relative from pages/ folder */
  var NAV = [
    { key: 'aim',        label: 'AIM',        href: 'aim.html' },
    { key: 'theory',     label: 'THEORY',     href: 'theory.html' },
    { key: 'procedure',  label: 'PROCEDURE',  href: 'procedure.html' },
    { key: 'simulation', label: 'SIMULATION', href: 'simulation.html' },
    { key: 'learning',   label: 'LEARNING',   href: 'learning.html' },
    { key: 'quiz',       label: 'QUIZ',       href: 'quiz.html' },
    { key: 'references', label: 'REFERENCES', href: 'references.html' }
  ];

  /* ---- Build nav ---- */
  function buildNav(hostEl, activeKey) {
    if (!hostEl) return;
    hostEl.className = 'lab-nav';
    hostEl.setAttribute('role', 'navigation');
    hostEl.setAttribute('aria-label', 'Virtual Lab Sections');

    /* Brand */
    var brand = document.createElement('a');
    brand.className = 'lab-brand';
    brand.href = '../index.html';
    brand.innerHTML =
      '<svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
      '<rect width="64" height="64" rx="14" fill="#101A35"/>' +
      '<path d="M12 40c10-22 30-22 40 0" fill="none" stroke="#68E0E0" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="12" cy="40" r="6" fill="#9478E8"/>' +
      '<circle cx="52" cy="40" r="6" fill="#56B8E8"/>' +
      '</svg> Mobile IP Lab';
    hostEl.appendChild(brand);

    /* Burger */
    var burger = document.createElement('button');
    burger.className = 'lab-burger';
    burger.type = 'button';
    burger.setAttribute('aria-label', 'Toggle navigation menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '&#9776;';
    hostEl.appendChild(burger);

    /* Links */
    var ul = document.createElement('ul');
    ul.className = 'lab-nav-links';
    ul.id = 'lab-nav-links';
    ul.setAttribute('role', 'list');

    NAV.forEach(function (n) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.textContent = n.label;
      a.href = n.href;
      if (n.key === activeKey) {
        a.setAttribute('aria-current', 'page');
      }
      li.appendChild(a);
      ul.appendChild(li);
    });

    hostEl.appendChild(ul);

    /* Burger toggle */
    burger.addEventListener('click', function () {
      var open = ul.classList.toggle('lab-open');
      burger.setAttribute('aria-expanded', String(open));
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!hostEl.contains(e.target)) {
        ul.classList.remove('lab-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        ul.classList.remove('lab-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Toast helper ---- */
  function toast(msg) {
    var t = document.getElementById('lab-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'lab-toast';
      t.className = 'lab-toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('lab-show');
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove('lab-show'); }, 2800);
  }

  /* ---- FAQ accordion ---- */
  function initFaq() {
    var btns = document.querySelectorAll('.lab-q');
    btns.forEach(function (q) {
      q.addEventListener('click', function () {
        var panelId = q.getAttribute('aria-controls');
        var panel = document.getElementById(panelId);
        var expanded = q.getAttribute('aria-expanded') === 'true';
        // Close all others
        document.querySelectorAll('.lab-q[aria-expanded="true"]').forEach(function(openQ) {
          if (openQ !== q) {
            openQ.setAttribute('aria-expanded', 'false');
            var pId = openQ.getAttribute('aria-controls');
            var p = document.getElementById(pId);
            if (p) p.classList.remove('lab-open');
          }
        });
        q.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.classList.toggle('lab-open', !expanded);
      });
    });
  }

  /* ---- Video placeholder ---- */
  function initVideos(videoMap) {
    var map = videoMap || {};
    function embed(u) {
      var m = (u || '').match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
      return m ? 'https://www.youtube.com/embed/' + m[1] + '?rel=0&modestbranding=1' : '';
    }
    document.querySelectorAll('[data-lab-video]').forEach(function (box) {
      var id = box.getAttribute('data-lab-video');
      var url = (map[id] || box.getAttribute('data-lab-video-url') || '').trim();
      var link = document.querySelector('[data-lab-video-link="' + id + '"]');
      if (!link) return;
      var e = embed(url);
      if (e) {
        var frame = document.createElement('iframe');
        frame.src = e;
        frame.title = id;
        frame.allowFullscreen = true;
        frame.allow = 'accelerometer; encrypted-media; picture-in-picture';
        frame.loading = 'lazy';
        var vf = box.querySelector('.lab-vframe');
        if (vf) { vf.innerHTML = ''; vf.appendChild(frame); }
        link.href = url; link.target = '_blank'; link.rel = 'noopener';
        link.removeAttribute('aria-disabled');
      } else {
        link.addEventListener('click', function (ev) {
          ev.preventDefault();
          toast('YouTube link not added yet. Update global-nav.js MIP_VIDEOS or the data-lab-video-url attribute.');
        });
      }
    });
  }

  /* ---- Public API ---- */
  window.LAB = {
    buildNav: buildNav,
    toast: toast,
    initFaq: initFaq,
    initVideos: initVideos
  };

  /* Auto-init */
  document.addEventListener('DOMContentLoaded', function () {
    var host = document.getElementById('lab-nav');
    if (host) {
      buildNav(host, host.getAttribute('data-active'));
    }
    initFaq();
    initVideos(window.MIP_VIDEOS || {});
  });
})();
