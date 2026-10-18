/* XIAI JEWELRY — menu, jewellery dropdown, brand film, home carousel,
   product gallery, filters, enquiry prefill */
(function () {
  var doc = document;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  // Brand film: muted loop with our own pause and sound buttons.
  // Not started for visitors who ask for reduced motion; pauses while off screen.
  var film = doc.getElementById('film');
  if (film) {
    var box = film.parentNode;
    var playBtn = box.querySelector('.film-play');
    var soundBtn = box.querySelector('.film-sound');
    var userPaused = false;
    var autoPaused = false;
    film.removeAttribute('controls');
    box.classList.add('js');
    var syncPlay = function () {
      playBtn.classList.toggle('is-paused', film.paused);
      playBtn.setAttribute('aria-label', film.paused ? 'Play the film' : 'Pause the film');
    };
    var syncSound = function () {
      soundBtn.classList.toggle('is-on', !film.muted);
      soundBtn.setAttribute('aria-label', film.muted ? 'Turn the sound on' : 'Turn the sound off');
    };
    var start = function () {
      var p = film.play();
      if (p && p.catch) { p.catch(syncPlay); }
    };
    film.addEventListener('play', syncPlay);
    film.addEventListener('pause', syncPlay);
    film.addEventListener('volumechange', syncSound);
    playBtn.addEventListener('click', function () {
      if (film.paused) { userPaused = false; autoPaused = false; start(); }
      else { userPaused = true; film.pause(); }
    });
    soundBtn.addEventListener('click', function () {
      film.muted = !film.muted;
      if (!film.muted && film.paused) { userPaused = false; autoPaused = false; start(); }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting && !film.paused) { autoPaused = true; film.pause(); }
          else if (en.isIntersecting && autoPaused && !userPaused) { autoPaused = false; start(); }
        });
      }, { threshold: 0.2 }).observe(film);
    }
    syncPlay();
    syncSound();
    if (!(reduceMotion && reduceMotion.matches)) { start(); }
  }

  // Home carousel: native swipe/scroll with snap, plus arrows and dots.
  doc.querySelectorAll('[data-carousel]').forEach(function (car) {
    var track = car.querySelector('.car-track');
    var slides = track.children;
    var dots = car.querySelectorAll('.car-dots button');
    var prev = car.querySelector('.car-btn.prev');
    var next = car.querySelector('.car-btn.next');
    if (!prev || !next || slides.length < 2) { return; }
    car.classList.add('js');
    var current = 0;
    var show = function (i) {
      var n = slides.length;
      i = (i % n + n) % n;
      track.scrollTo({ left: i * track.clientWidth, behavior: reduceMotion && reduceMotion.matches ? 'auto' : 'smooth' });
    };
    var mark = function () {
      var i = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
      if (i === current) { return; }
      current = i;
      dots.forEach(function (d, k) {
        if (k === i) { d.setAttribute('aria-current', 'true'); } else { d.removeAttribute('aria-current'); }
      });
    };
    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) { return; }
      ticking = true;
      requestAnimationFrame(function () { ticking = false; mark(); });
    }, { passive: true });
    prev.addEventListener('click', function () { show(current - 1); });
    next.addEventListener('click', function () { show(current + 1); });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); }); });
    car.addEventListener('keydown', function (e) {
      if (e.target.closest && e.target.closest('a')) { return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    });
  });

  // Mobile drawer
  var drawer = doc.getElementById('drawer');
  var openBtn = doc.querySelector('.menu-btn');
  if (drawer && openBtn) {
    var closeBtn = drawer.querySelector('.drawer-close');
    var setOpen = function (open) {
      drawer.classList.toggle('open', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      doc.body.classList.toggle('locked', open);
      if (open) { setTimeout(function () { closeBtn.focus(); }, 80); } else { openBtn.focus(); }
    };
    openBtn.addEventListener('click', function () { setOpen(true); });
    closeBtn.addEventListener('click', function () { setOpen(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) { setOpen(false); }
    });
  }

  // Jewellery dropdown (click/keyboard; hover handled in CSS)
  doc.querySelectorAll('.has-mega').forEach(function (item) {
    var btn = item.querySelector('button');
    btn.addEventListener('click', function () {
      var open = !item.classList.contains('open');
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { item.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
    doc.addEventListener('click', function (e) {
      if (!item.contains(e.target)) { item.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  });

  // Product gallery
  var main = doc.getElementById('gal-main');
  if (main) {
    var thumbs = doc.querySelectorAll('.thumbs button');
    thumbs.forEach(function (b) {
      b.addEventListener('click', function () {
        main.src = b.dataset.src;
        main.alt = b.dataset.alt;
        thumbs.forEach(function (x) { x.removeAttribute('aria-current'); });
        b.setAttribute('aria-current', 'true');
      });
    });
  }

  // Pearl filters on listing pages
  var chips = doc.querySelectorAll('[data-filter]');
  if (chips.length) {
    var cards = doc.querySelectorAll('.grid .card');
    var shown = doc.getElementById('shown');
    var apply = function (key) {
      var n = 0;
      cards.forEach(function (c) {
        var ok = key === 'all' || (' ' + c.dataset.pearls + ' ').indexOf(' ' + key + ' ') > -1;
        c.hidden = !ok;
        if (ok) { n++; }
      });
      chips.forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.filter === key ? 'true' : 'false'); });
      if (shown) { shown.textContent = n + (n === 1 ? ' piece' : ' pieces'); }
    };
    chips.forEach(function (c) { c.addEventListener('click', function () { apply(c.dataset.filter); }); });
  }

  // Enquiry prefill on the contact page: /contact?item=33168
  var asking = doc.getElementById('asking');
  if (asking) {
    var m = /[?&]item=(\d{5})\b/.exec(location.search);
    if (m) {
      var names = JSON.parse(asking.dataset.names || '{}');
      var label = names[m[1]] ? names[m[1]] + ' (No. ' + m[1] + ')' : 'item no. ' + m[1];
      asking.querySelector('b').textContent = label;
      asking.classList.add('show');
    }
  }
})();
