/* Redline Surf Club — etkileşim katmanı */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── açılış ─────────────────────────────── */
  var intro = document.getElementById('intro');
  function start() {
    document.body.classList.add('ready');
    if (intro) setTimeout(function () { intro.classList.add('done'); }, reduce ? 0 : 1250);
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
  // yavaş bağlantıda takılı kalmasın
  setTimeout(start, 3000);

  /* ── dil (TR / EN) ──────────────────────── */
  var langBtn = document.getElementById('lang');
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-tr][data-en]'));

  function setLang(l) {
    document.documentElement.lang = l;
    nodes.forEach(function (n) {
      var v = n.getAttribute('data-' + l);
      if (v != null) n.innerHTML = v;
    });
    if (langBtn) {
      var s = langBtn.querySelectorAll('span');
      s[0].classList.toggle('off', l !== 'tr');
      s[1].classList.toggle('off', l !== 'en');
    }
    try { localStorage.setItem('rl-lang', l); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem('rl-lang'); } catch (e) {}
  if (!saved) saved = (navigator.language || 'tr').toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en';
  setLang(saved);

  if (langBtn) langBtn.addEventListener('click', function () {
    setLang(document.documentElement.lang === 'tr' ? 'en' : 'tr');
  });

  /* ── başlık: gizle/göster + arka plan ───── */
  var hdr = document.getElementById('hdr');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var callbar = document.querySelector('.callbar');
  var bar = document.querySelector('.scroll-progress i');
  var last = 0, ticking = false;

  function onScroll() {
    var y = window.pageYOffset;
    hdr.classList.toggle('solid', y > 60);
    if (y > 520 && y > last && !nav.classList.contains('open')) hdr.classList.add('hide');
    else hdr.classList.remove('hide');
    last = y;

    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (callbar) callbar.classList.toggle('on', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ── mobil menü ─────────────────────────── */
  function closeNav() {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) hdr.classList.remove('hide');
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeNav(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ── görünüme girince aç ────────────────── */
  var revealables = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── sayaçlar ───────────────────────────── */
  var nums = document.querySelectorAll('.num[data-to]');
  function countUp(el) {
    var to = parseInt(el.getAttribute('data-to'), 10);
    if (el.hasAttribute('data-plain') || reduce || isNaN(to)) { el.textContent = el.getAttribute('data-to') || el.textContent; return; }
    var dur = 1400, t0 = performance.now();
    (function tick(now) {
      var p = Math.min((now - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  if ('IntersectionObserver' in window) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); nio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { nio.observe(n); });
  } else {
    nums.forEach(countUp);
  }

  /* ── videolar: görünürken oynat ─────────── */
  var vids = document.querySelectorAll('.lazyvid');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (v.preload === 'none') v.preload = 'auto';
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) { v.pause(); }
      });
    }, { threshold: 0.25 });
    vids.forEach(function (v) { vio.observe(v); });
  }

  /* ── hero videosu: sayfa açıldıktan sonra yüklensin ── */
  var hero = document.getElementById('heroVid');
  function heroStart() {
    if (!hero || hero.src) return;
    var c = navigator.connection || {};
    // yavaş bağlantı ya da veri tasarrufu: sadece kapak karesi kalsın
    if (c.saveData || /^([23])g$/.test(c.effectiveType || '')) return;
    hero.addEventListener('playing', function () { hero.classList.add('on'); }, { once: true });
    // dar ekranda küçük sürüm (960x540); geniş ekranda 1080p
    var sm = hero.getAttribute('data-src-sm');
    hero.src = (sm && window.innerWidth <= 700) ? sm : hero.getAttribute('data-src');
    var p = hero.play();
    if (p && p.catch) p.catch(function () {});
  }
  if (document.readyState === 'complete') setTimeout(heroStart, 60);
  else window.addEventListener('load', function () { setTimeout(heroStart, 60); });

  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      if (!hero.src) return;
      if (e[0].isIntersecting) { var p = hero.play(); if (p && p.catch) p.catch(function () {}); }
      else hero.pause();
    }, { threshold: 0.05 }).observe(hero);
  }

  /* ── aktif menü bağlantısı ──────────────── */
  var secs = ['dersler', 'neden', 'ekipman', 'galeri', 'iletisim']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var links = {};
  document.querySelectorAll('.nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (a && en.isIntersecting) {
          for (var k in links) links[k].classList.remove('active');
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { sio.observe(s); });
  }

  /* ── ara düğmesinde imleci takip eden ışık ─ */
  if (!reduce) {
    document.querySelectorAll('.btn-call').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      });
    });
  }

  /* ── hero parallax ──────────────────────── */
  if (!reduce && window.innerWidth > 900) {
    var media = document.querySelector('.hero-media');
    var hin = document.querySelector('.hero-in');
    var pTick = false;
    window.addEventListener('scroll', function () {
      if (pTick) return;
      pTick = true;
      requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (y < window.innerHeight * 1.2) {
          if (media) media.style.transform = 'translateY(' + y * 0.22 + 'px)';
          if (hin) { hin.style.transform = 'translateY(' + y * 0.09 + 'px)'; hin.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.78)); }
        }
        pTick = false;
      });
    }, { passive: true });
  }

  document.getElementById('yr').textContent = new Date().getFullYear();
  onScroll();
})();
