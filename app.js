document.addEventListener('DOMContentLoaded', () => {
  const LANG_KEY = 'lang';
  const THEME_KEY = 'theme';
  const SUPPORTED_LANGS = ['es', 'en'];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  let currentLang = localStorage.getItem(LANG_KEY) || 'es';
  if (!SUPPORTED_LANGS.includes(currentLang)) currentLang = 'es';

  let currentTheme = localStorage.getItem(THEME_KEY) || 'dark';
  if (!['dark', 'light'].includes(currentTheme)) currentTheme = 'dark';

  const toast = $('#toast');
  let toastTimer = null;

  /* ---------- i18n ---------- */
  function t(key) {
    return TRANSLATIONS[currentLang]?.[key] ?? key;
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang === 'es' ? 'es' : 'en';

    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (el.tagName === 'META') {
        el.content = t(key);
      } else {
        el.innerHTML = t(key);
      }
    });

    $$('[data-i18n-title]').forEach((el) => {
      el.title = t(el.getAttribute('data-i18n-title'));
    });

    const metaTitle = $('title[data-i18n]');
    if (metaTitle) metaTitle.textContent = t('metaTitle');

    const langLabel = $('#langLabel');
    if (langLabel) langLabel.textContent = currentLang === 'es' ? 'EN' : 'ES';

    const langToggle = $('#langToggle');
    if (langToggle) langToggle.title = t('langToggleTitle');
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    applyTranslations();
  }

  /* ---------- Theme ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = $('#themeIcon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }

  /* ---------- Toast ---------- */
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- Year ---------- */
  const yearEl = $('#currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  /* ---------- Mobile menu ---------- */
  const mobileMenuBtn = $('#mobileMenuBtn');
  const mobileNavDrawer = $('#mobileNavDrawer');
  const navbar = $('#navbar');

  function closeMobileMenu() {
    mobileNavDrawer?.classList.remove('open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
  }

  mobileMenuBtn?.addEventListener('click', () => {
    const isOpen = mobileNavDrawer?.classList.toggle('open');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  $$('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('click', (e) => {
    if (mobileNavDrawer?.classList.contains('open') && !mobileNavDrawer.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* ---------- Navbar scroll ---------- */
  function onScroll() {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.timeline-item, .personal-card, .pillar-card, .pub-card, .project-card, .skill-category-card, .edu-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Filters ---------- */
  const filterButtons = $$('.filter-btn');
  const timelineItems = $$('.timeline-item');
  const filters = { active: 'all' };

  function applyFilter(filter) {
    filters.active = filter;
    timelineItems.forEach((item) => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  /* ---------- Scrollspy ---------- */
  const sections = $$('main section[id], section[id]').filter((sec) => sec.id);
  const navLinks = $$('.nav-menu .nav-link');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((sec) => spyObserver.observe(sec));

  /* ---------- Copy email ---------- */
  const btnCopyEmail = $('#btnCopyEmail');
  const copiedEmailTag = $('#copiedEmailTag');
  const EMAIL = 'brendaelisacabreracruz@gmail.com';

  btnCopyEmail?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      copiedEmailTag?.classList.add('show');
      showToast(t('toastCopied'));
      setTimeout(() => copiedEmailTag?.classList.remove('show'), 2000);
    } catch (err) {
      btnCopyEmail.textContent = 'ERROR';
    }
  });

  /* ---------- Language & theme controls ---------- */
  $('#langToggle')?.addEventListener('click', (e) => {
    e.preventDefault();
    setLang(currentLang === 'es' ? 'en' : 'es');
  });

  $('#themeToggle')?.addEventListener('click', () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Init ---------- */
  applyTheme(currentTheme);
  applyTranslations();
  applyFilter('all');
});