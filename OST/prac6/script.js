/* ============================================================
   script.js – Premium Portfolio Enhancements
   ============================================================ */

(() => {
  'use strict';

  /* ---------- 1. Theme Manager ---------- */
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY = 'theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    themeToggle.innerHTML = theme === 'dark' ? '&#9788;' : '&#9790;';
  }

  // Initialize: saved > system > light
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  /* ---------- 2. Typewriter Effect ---------- */
  const words = [
    'Hello, I\'m Smith Faldu',
    'Hi, I\'m Smith Faldu',
    'Hey, I\'m Smith Faldu',
  ];
  let wi = 0, ci = 0, deleting = false;
  const tw = document.getElementById('typewriter');
  function type() {
    const w = words[wi];
    if (!deleting) {
      tw.textContent = w.slice(0, ++ci);
      if (ci === w.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      tw.textContent = w.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 50 : 90);
  }
  if (tw) type();

  /* ---------- 3. Scroll Reveal (IntersectionObserver) ---------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // animate skill bars
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        // stagger children with .stagger-* classes
        entry.target.querySelectorAll('[class*="stagger-"]').forEach((el, i) => {
          el.style.transitionDelay = `${(i + 1) * 0.07}s`;
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    if (!prefersReduced) revealObserver.observe(el);
    else el.classList.add('visible');
  });

  /* ---------- 4. Active Nav Link & Navbar Scroll State ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('header');
  function onScroll() {
    const y = window.scrollY;
    // active link
    let current = '';
    sections.forEach(sec => {
      if (y >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
    // navbar scrolled
    navbar.classList.toggle('scrolled', y > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 5. Hero Parallax (mouse) ---------- */
  const hero = document.getElementById('hero');
  const profileRing = hero?.querySelector('.profile-ring');
  if (hero && profileRing && !prefersReduced) {
    hero.addEventListener('mousemove', e => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX - w/2) / w * 12;
      const y = (e.clientY - h/2) / h * 12;
      profileRing.style.transform = `translate(${x}px, ${y}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      profileRing.style.transform = 'translate(0,0)';
    });
  }

  /* ---------- 6. Custom Cursor (desktop only) ---------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches && !prefersReduced) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function tick() {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      cursorDot.style.transform = `translate(${rx}px, ${ry}px)`;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(tick);
    }
    tick();
    // enlarge on interactive
    const interactive = 'a, button, .btn, .card, .project-card, .skill-card, .social-btn';
    document.addEventListener('mouseover', e => {
      if (e.target.matches(interactive)) {
        cursorRing.style.width = '60px';
        cursorRing.style.height = '60px';
        cursorRing.style.borderColor = getComputedStyle(html).getPropertyValue('--secondary').trim();
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.matches(interactive)) {
        cursorRing.style.width = '40px';
        cursorRing.style.height = '40px';
        cursorRing.style.borderColor = getComputedStyle(html).getPropertyValue('--primary').trim();
      }
    });
  } else {
    // hide cursor elements on non‑fine pointers
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  /* ---------- 7. Page Load Sequence ---------- */
  // Use requestAnimationFrame to allow CSS to apply then start animations
  requestAnimationFrame(() => {
    document.documentElement.classList.add('loaded');
  });

  /* ---------- 8. Contact Form (EmailJS) with inline status ---------- */
  const form = document.getElementById('contactForm');
  const statusEl = form?.querySelector('.form-status');
  if (form) {
    emailjs.init('cWWoAGn2rQ6197oRI');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending…</span><svg class="spinner" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="30 15" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></svg>';
      document.getElementById('time').value = new Date().toLocaleString();
      try {
        await emailjs.sendForm('service_pctc8lo', 'template_qlhqs0n', form);
        showStatus('Message sent successfully!', true);
        form.reset();
        // reset floating labels
        form.querySelectorAll('label').forEach(l => l.style.top = '');
      } catch (err) {
        console.error(err);
        showStatus('Failed to send. Please try again.', false);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
      }
    });
  }
  function showStatus(msg, success) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status ' + (success ? 'success' : 'error');
    statusEl.style.display = 'flex';
    setTimeout(() => { statusEl.style.display = 'none'; }, 6000);
  }

  /* ---------- 9. Smooth scroll for anchor links (fallback) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', `#${id}`);
      }
    });
  });

})();