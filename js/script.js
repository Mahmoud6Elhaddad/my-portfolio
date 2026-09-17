/* Mahmoud Mohamed El-Saeed — portfolio behaviour
   No dependencies. Everything degrades gracefully without JS. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- Footer year ------------------------------------------------------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Sticky nav + scroll progress -------------------------------------- */
  var nav = $('#siteNav');
  var bar = $('#progress');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('is-stuck', y > 24);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---- Mobile menu ------------------------------------------------------- */
  var toggle = $('#navToggle');
  var sheet  = $('#navSheet');

  function setMenu(open) {
    if (!toggle || !sheet) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      sheet.hidden = false;
      window.requestAnimationFrame(function () { sheet.classList.add('is-open'); });
    } else {
      sheet.classList.remove('is-open');
      window.setTimeout(function () { if (toggle.getAttribute('aria-expanded') === 'false') sheet.hidden = true; }, 320);
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (sheet) {
    $$('a', sheet).forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---- Reveal on scroll --------------------------------------------------- */
  var revealItems = $$('.reveal');

  function fillMeters(scope) {
    $$('.meter i', scope).forEach(function (m) {
      var v = parseFloat(m.getAttribute('data-fill') || '0');
      m.style.width = Math.max(0, Math.min(100, v)) + '%';
    });
  }

  if (reduced || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('in'); });
    fillMeters(document);
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        fillMeters(entry.target);
        revealObs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealItems.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---- Active section in nav ---------------------------------------------- */
  var navAnchors = $$('#navLinks a');
  var sectionMap = {};

  navAnchors.forEach(function (a) {
    (a.getAttribute('data-sections') || '').split(/\s+/).forEach(function (id) {
      if (id) sectionMap[id] = a;
    });
  });

  var watched = Object.keys(sectionMap)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && watched.length) {
    var visible = {};
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      var bestId = null, best = 0;
      Object.keys(visible).forEach(function (id) {
        if (visible[id] > best) { best = visible[id]; bestId = id; }
      });
      navAnchors.forEach(function (a) {
        a.classList.remove('is-active');
        a.removeAttribute('aria-current');
      });
      if (bestId && sectionMap[bestId]) {
        sectionMap[bestId].classList.add('is-active');
        sectionMap[bestId].setAttribute('aria-current', 'true');
      }
    }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

    watched.forEach(function (s) { navObs.observe(s); });
  }

  /* ---- Project accordions -------------------------------------------------- */
  $$('.row-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  /* ---- Project image viewer ---------------------------------------------- */
  var lightbox = $('#lightbox');
  var lightboxImage = $('#lightbox-image');
  var lightboxCaption = $('#lightbox-caption');
  var lightboxClose = $('.lightbox-close');
  var lastGalleryTrigger = null;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastGalleryTrigger) lastGalleryTrigger.focus();
  }

  $$('.gallery-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var image = $('img', trigger);
      if (!lightbox || !lightboxImage || !image) return;
      lastGalleryTrigger = trigger;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = image.alt;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    });
  });

  $$('[data-lightbox-close]').forEach(function (closeButton) {
    closeButton.addEventListener('click', closeLightbox);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });

  /* ---- Neural background --------------------------------------------------- */
  var canvas = $('#neural-canvas');
  if (!canvas || reduced) { if (canvas) canvas.style.display = 'none'; return; }

  var ctx = canvas.getContext('2d');
  var nodes = [];
  var w = 0, h = 0, dpr = 1;
  var raf = null;
  var pointer = { x: -9999, y: -9999 };

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width  = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var target = Math.round(Math.min(72, Math.max(24, (w * h) / 26000)));
    nodes = [];
    for (var i = 0; i < target; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.3 + 0.6
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    var maxDist = w < 700 ? 110 : 150;

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;

      for (var j = i + 1; j < nodes.length; j++) {
        var m = nodes[j];
        var dx = n.x - m.x, dy = n.y - m.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          ctx.strokeStyle = 'rgba(123,147,255,' + (0.1 * (1 - d / maxDist)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      }

      var pdx = n.x - pointer.x, pdy = n.y - pointer.y;
      var near = Math.sqrt(pdx * pdx + pdy * pdy) < 130;
      ctx.fillStyle = near ? 'rgba(79,214,192,0.5)' : 'rgba(150,170,255,0.28)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = window.requestAnimationFrame(frame);
  }

  function start() { if (!raf) raf = window.requestAnimationFrame(frame); }
  function stop()  { if (raf) { window.cancelAnimationFrame(raf); raf = null; } }

  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(size, 180);
  });

  window.addEventListener('pointermove', function (e) {
    pointer.x = e.clientX; pointer.y = e.clientY;
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  size();
  start();
})();
