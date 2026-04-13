/* ============================================================
   RIARA ADVISORY — script.js
   ============================================================ */

'use strict';

/* ── Navbar: scroll shadow ─────────────────────────────── */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 16);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── Navbar: mobile toggle ─────────────────────────────── */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Close when a link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ── Navbar: active link ───────────────────────────────── */
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(a => {
    const href = a.getAttribute('href');
    if (
      href === page ||
      (page === ''     && href === 'index.html') ||
      (page === '/'    && href === 'index.html')
    ) {
      a.classList.add('active');
    }
  });
})();


/* ── Scroll-reveal animations (IntersectionObserver) ───── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  els.forEach(el => observer.observe(el));
})();


/* ── Smooth scroll for hash anchors ────────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── Contact form ──────────────────────────────────────── */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.querySelector('.form-success');
  if (!form) return;

  function validate(field) {
    const val = field.value.trim();
    let ok = true;

    if (field.hasAttribute('required') && !val) ok = false;

    if (field.type === 'email' && val) {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    field.classList.toggle('error', !ok);
    return ok;
  }

  // Real-time clearing of error state
  form.querySelectorAll('input, select, textarea').forEach(f => {
    f.addEventListener('input', () => f.classList.remove('error'));
    f.addEventListener('change', () => f.classList.remove('error'));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let allValid = true;

    fields.forEach(f => {
      if (!validate(f)) allValid = false;
    });

    // Also validate email field if present (not necessarily required)
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && !validate(emailField)) allValid = false;

    if (!allValid) {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        const top = firstError.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top, behavior: 'smooth' });
        firstError.focus();
      }
      return;
    }

    // Simulate submission
    const submitBtn = form.querySelector('.form-submit');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        // Scroll success into view
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1300);
  });
})();


/* ── Stat counter animation ────────────────────────────── */
(function () {
  const stats = document.querySelectorAll('.stat-val[data-target]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur    = 1400;
      const step   = 16;
      const steps  = dur / step;
      let current  = 0;

      const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = prefix + Math.floor(current) + suffix;
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
})();
