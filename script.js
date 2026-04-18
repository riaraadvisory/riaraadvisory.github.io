/* ============================================================
   RIARA ADVISORY — script.js  (v2)
   ============================================================ */

'use strict';

/* ── Navbar: scroll shadow ─────────────────────────────── */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 16);
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
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
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
    if (href === page || (page === '' && href === 'index.html') || (page === '/' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();


/* ── Scroll-reveal animations ───────────────────────────── */
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
  }, { threshold: 0.07, rootMargin: '0px 0px -28px 0px' });
  els.forEach(el => observer.observe(el));
})();


/* ── Gold underline reveal on scroll ────────────────────── */
(function () {
  const els = document.querySelectorAll('.gold-underline');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
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


/* ── Testimonial rotator ────────────────────────────────── */
(function () {
  const cards = document.querySelectorAll('.testimonial-card');
  const dots  = document.querySelectorAll('.dot');
  if (!cards.length) return;

  let current  = 0;
  let interval = null;

  function goTo(index) {
    cards[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (index + cards.length) % cards.length;
    cards[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(interval);
    interval = setInterval(() => goTo(current + 1), 5000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  startAuto();
})();


/* ── FAQ accordion ──────────────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
})();


/* ── Contact form — Formspree submission ────────────────── */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.querySelector('.form-success');
  if (!form) return;

  function validate(field) {
    const val = field.value.trim();
    let ok = true;
    if (field.hasAttribute('required') && !val) ok = false;
    if (field.type === 'email' && val) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    field.classList.toggle('error', !ok);
    return ok;
  }

  form.querySelectorAll('input, select, textarea').forEach(f => {
    f.addEventListener('input',  () => f.classList.remove('error'));
    f.addEventListener('change', () => f.classList.remove('error'));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let allValid = true;
    fields.forEach(f => { if (!validate(f)) allValid = false; });
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && !validate(emailField)) allValid = false;

    if (!allValid) {
      const firstError = form.querySelector('.error');
      if (firstError) {
        const top = firstError.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top, behavior: 'smooth' });
        firstError.focus();
      }
      return;
    }

    const submitBtn = form.querySelector('.form-submit');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        form.style.display = 'none';
        if (success) {
          success.style.display = 'block';
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        const existing = form.querySelector('.form-server-error');
        if (!existing) {
          submitBtn.insertAdjacentHTML('afterend', '<p class="form-server-error" style="color:#e53e3e;font-size:.82rem;margin-top:10px;text-align:center;">Something went wrong. Please email us at riaraadvisory@gmail.com.</p>');
        }
      }
    })
    .catch(() => {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      const existing = form.querySelector('.form-server-error');
      if (!existing) {
        submitBtn.insertAdjacentHTML('afterend', '<p class="form-server-error" style="color:#e53e3e;font-size:.82rem;margin-top:10px;text-align:center;">Network error. Please try again or email riaraadvisory@gmail.com.</p>');
      }
    });
  });
})();


/* ── Stat counter animation ─────────────────────────────── */
(function () {
  const stats = document.querySelectorAll('.stat-val[data-target]');
  if (!stats.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1400, step = 16, steps = dur / step;
      let current = 0;
      const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + suffix;
      }, step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));
})();
