/* Hugo Romat — personal site interactions
   - BibTeX cite popovers with copy-to-clipboard
   - Smooth scroll-to-top for the portrait / name
   - Active section highlighting in the side nav
   ------------------------------------------------------------------------- */
(function () {
  'use strict';

  /* ——— Cite popovers ——— */
  function closeAllCites(except) {
    document.querySelectorAll('.cite-pop.open').forEach(function (pop) {
      if (pop === except) return;
      pop.style.height = '0px';
      pop.classList.remove('open');
      pop.setAttribute('aria-hidden', 'true');
      var btn = pop.parentElement.querySelector('.cite-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function togglePop(btn) {
    var body = btn.closest('.pub-body');
    if (!body) return;
    var pop = body.querySelector('.cite-pop');
    if (!pop) return;
    var isOpen = pop.classList.contains('open');
    closeAllCites(isOpen ? null : pop);
    if (isOpen) {
      pop.style.height = '0px';
      pop.classList.remove('open');
      pop.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
    } else {
      pop.classList.add('open');
      pop.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      var card = pop.querySelector('.cite-card');
      pop.style.height = (card.offsetHeight) + 'px';
    }
  }

  function flashStatus(pop) {
    var status = pop.querySelector('.cite-status');
    if (!status) return;
    status.classList.add('show');
    setTimeout(function () { status.classList.remove('show'); }, 1600);
  }

  async function copyText(text, pop) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
    }
    flashStatus(pop);
  }

  document.addEventListener('click', function (e) {
    var citeBtn = e.target.closest('.cite-btn');
    if (citeBtn) { togglePop(citeBtn); return; }

    var copyBtn = e.target.closest('.copy-btn');
    if (copyBtn) {
      var pop = copyBtn.closest('.cite-pop');
      var pre = pop.querySelector('pre.bibtex');
      if (pre) copyText(pre.textContent, pop);
      return;
    }

    var closeBtn = e.target.closest('.cite-pop .close-btn');
    if (closeBtn) { closeAllCites(null); return; }

    /* click outside any popover closes them */
    if (!e.target.closest('.cite-pop') && !e.target.closest('.cite-btn')) {
      closeAllCites(null);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllCites(null);
  });

  /* Recompute open popover height on resize */
  window.addEventListener('resize', function () {
    document.querySelectorAll('.cite-pop.open').forEach(function (pop) {
      var card = pop.querySelector('.cite-card');
      if (card) pop.style.height = card.offsetHeight + 'px';
    });
  });

  /* ——— Scroll to top (portrait + name) ——— */
  document.querySelectorAll('a.to-top').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ——— Featured cards + in-page publication links ——— */
  function highlightPub(el) {
    el.classList.remove('pub-highlight');
    void el.offsetWidth; /* restart animation */
    el.classList.add('pub-highlight');
    setTimeout(function () { el.classList.remove('pub-highlight'); }, 3200);
  }

  document.querySelectorAll('a.featured-card, a[href^="#pub-"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlightPub(target);
      history.replaceState(null, '', '#' + id);
    });
  });

  /* ——— Smooth-scroll side nav + active highlight ——— */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav.side a[href^="#"]'));
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    });
  });

  var sections = navLinks
    .map(function (l) { return document.getElementById(l.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var byId = {};
    navLinks.forEach(function (l) { byId[l.getAttribute('href').slice(1)] = l; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.style.color = ''; });
          var active = byId[entry.target.id];
          if (active) active.style.color = 'var(--accent)';
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    sections.forEach(function (s) { observer.observe(s); });
  }
})();
