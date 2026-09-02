/* Khaled Gamal — Architect
   Progressive enhancement only. Every page is readable and navigable with
   this file absent. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Year ──────────────────────────────────────────────────────────── */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ── Mobile index drawer ───────────────────────────────────────────── */
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.getElementById('nav-drawer');

  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.getAttribute('data-open') === 'true';
      drawer.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') {
        drawer.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ── Reveal once on entry ──────────────────────────────────────────── */
  var revealables = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(revealables, function (el) { reveal.observe(el); });
  }

  /* ── Frame-sequence animations ─────────────────────────────────────── */
  Array.prototype.forEach.call(document.querySelectorAll('[data-anim]'), function (root) {
    var frames = Array.prototype.slice.call(root.querySelectorAll('.anim__frames img'));
    var toggle = root.querySelector('.anim__toggle');
    if (frames.length < 2) { return; }

    var interval = parseInt(root.getAttribute('data-interval'), 10) || 900;
    var i = 0;
    var timer = null;
    var playing = false;

    function show(n) {
      frames.forEach(function (f, k) { f.classList.toggle('is-on', k === n); });
    }

    /* The frames are stacked and absolutely positioned, which makes lazy
       loading unreliable — the browser can decide none of them are "near the
       viewport". Fetch them explicitly the first time we need them. */
    var loaded = false;
    function ensureLoaded() {
      if (loaded) { return; }
      loaded = true;
      frames.forEach(function (f) { f.loading = 'eager'; });
    }

    function play() {
      if (playing) { return; }
      ensureLoaded();
      playing = true;
      if (toggle) { toggle.textContent = 'Pause'; toggle.setAttribute('aria-pressed', 'true'); }
      timer = window.setInterval(function () {
        i = (i + 1) % frames.length;
        show(i);
      }, interval);
    }

    function pause() {
      playing = false;
      window.clearInterval(timer);
      if (toggle) { toggle.textContent = 'Play'; toggle.setAttribute('aria-pressed', 'false'); }
    }

    show(0);
    /* Markup ships saying "Pause" so it reads right without JS; once we are
       driving it, the label must match the real state. */
    if (toggle) { toggle.textContent = 'Play'; toggle.setAttribute('aria-pressed', 'false'); }

    if (toggle) {
      toggle.addEventListener('click', function () {
        if (playing) { pause(); } else { play(); }
      });
    }

    if (reduceMotion) {
      pause();
      return;
    }

    /* The frames are the heaviest thing on the page, so don't fetch them until
       the reader is actually approaching. Deliberately a plain geometry check
       on scroll rather than IntersectionObserver: if the observer never fires
       — and in testing it sometimes doesn't — the animation silently stays
       dead and never loads. This cannot fail that way. */
    var started = false;

    function nearViewport() {
      var r = root.getBoundingClientRect();
      return r.top < window.innerHeight * 1.5 && r.bottom > window.innerHeight * -0.5;
    }

    function maybeStart() {
      if (started || !nearViewport()) { return; }
      started = true;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      play();
    }

    var ticking = false;
    function onScroll() {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; maybeStart(); });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    maybeStart();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { pause(); } else if (started) { play(); }
    });
  });

  /* ── Lightbox ──────────────────────────────────────────────────────── */
  var lb = document.getElementById('lightbox');
  if (!lb) { return; }

  /* Essay figures share the plate structure (img + figcaption), so dense
     diagrams open in the viewer too. */
  var plates = Array.prototype.slice.call(
    document.querySelectorAll('.plate, .article__body .figure')
  );
  if (!plates.length) { return; }

  var stage    = lb.querySelector('.lb__stage');
  var caption  = lb.querySelector('[data-lb-caption]');
  var counter  = lb.querySelector('[data-lb-counter]');
  var btnPrev  = lb.querySelector('[data-lb-prev]');
  var btnNext  = lb.querySelector('[data-lb-next]');
  var btnClose = lb.querySelector('[data-lb-close]');

  var index = 0;
  var lastFocused = null;

  function render() {
    var plate = plates[index];
    var img   = plate.querySelector('img');
    var text  = plate.querySelector('figcaption');

    stage.innerHTML = '';
    var big = document.createElement('img');
    big.src = img.getAttribute('data-full') || img.getAttribute('src');
    big.alt = img.getAttribute('alt') || '';
    stage.appendChild(big);

    caption.textContent = text ? text.textContent.trim() : '';
    counter.textContent = (index + 1) + ' / ' + plates.length;

    btnPrev.disabled = plates.length < 2;
    btnNext.disabled = plates.length < 2;
  }

  function open(i) {
    index = i;
    lastFocused = document.activeElement;
    lb.setAttribute('data-open', 'true');
    document.body.style.overflow = 'hidden';
    render();
    btnClose.focus();
  }

  function close() {
    lb.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
    stage.innerHTML = '';
    if (lastFocused && lastFocused.focus) { lastFocused.focus(); }
  }

  function step(delta) {
    index = (index + delta + plates.length) % plates.length;
    render();
  }

  plates.forEach(function (plate, i) {
    plate.setAttribute('tabindex', '0');
    plate.setAttribute('role', 'button');
    plate.setAttribute('aria-label', 'Open image ' + (i + 1) + ' of ' + plates.length);

    plate.addEventListener('click', function () { open(i); });
    plate.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { step(-1); });
  btnNext.addEventListener('click', function () { step(1); });

  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target === stage) { close(); }
  });

  document.addEventListener('keydown', function (e) {
    if (lb.getAttribute('data-open') !== 'true') { return; }

    if (e.key === 'Escape')     { close(); }
    if (e.key === 'ArrowLeft')  { step(-1); }
    if (e.key === 'ArrowRight') { step(1); }

    if (e.key === 'Tab') {
      var focusable = lb.querySelectorAll('button:not([disabled])');
      if (!focusable.length) { return; }
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });
})();
