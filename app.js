/**
 * Brenda Elisa Cabrera Cruz — Landing Page & CV Logic
 * Features: Bilingual Switcher (EN/ES), Theme Toggle, Dynamic Filters, Email Copy
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Current Year
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Language Switcher Engine
  const langToggle = document.getElementById('langToggle');
  const langLabel = document.getElementById('langLabel');
  const htmlElement = document.documentElement;

  // Determine initial language (saved > browser > 'es')
  const savedLang = localStorage.getItem('brenda_lang') ||
    (navigator.language && navigator.language.startsWith('en') ? 'en' : 'es');

  function applyLanguage(lang) {
    const dict = typeof translations !== 'undefined' && translations[lang] ? translations[lang] : null;
    if (!dict) return;

    htmlElement.setAttribute('lang', lang);

    // Update all elements with data-i18n
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        // Use innerHTML to preserve bold/italic formatting in strings
        if (el.tagName === 'META') {
          el.setAttribute('content', dict[key]);
        } else if (el.tagName === 'TITLE') {
          document.title = dict[key];
        } else {
          el.innerHTML = dict[key];
        }
      }
    });

    // Update Language Toggle Button UI
    if (langLabel) {
      langLabel.textContent = lang === 'es' ? 'EN' : 'ES';
    }
    if (langToggle) {
      langToggle.setAttribute('title', dict.langToggleTitle || (lang === 'es' ? 'Switch to English' : 'Cambiar a Español'));
      langToggle.setAttribute('aria-label', dict.langToggleTitle || 'Switch language');
    }

    // Update Filter Label
    const filterLabel = document.getElementById('filterLabel');
    if (filterLabel) {
      filterLabel.textContent = lang === 'es' ? 'Filtro:' : 'Filter:';
    }

    localStorage.setItem('brenda_lang', lang);
  }

  // Initialize Language
  applyLanguage(savedLang);

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const currentLang = htmlElement.getAttribute('lang') || 'es';
      const nextLang = currentLang === 'es' ? 'en' : 'es';
      applyLanguage(nextLang);
      showToast(nextLang === 'en' ? 'Language switched to English' : 'Idioma cambiado a Español');
    });
  }

  // 3. Theme Toggle (Dark / Light)
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  const savedTheme = localStorage.getItem('brenda_theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    localStorage.setItem('brenda_theme', theme);
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      const isEn = htmlElement.getAttribute('lang') === 'en';
      showToast(isEn
        ? `Theme switched to ${next === 'dark' ? 'dark' : 'light'} mode`
        : `Tema cambiado a modo ${next === 'dark' ? 'oscuro' : 'claro'}`
      );
    });
  }

  // 4. Experience Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // 5. Copy Email Button
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const emailText = 'brendaelisacabreracruz@gmail.com';
  const copiedEmailTag = document.getElementById('copiedEmailTag');

  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', async () => {
      const success = await copyTextToClipboard(emailText);
      if (success) {
        if (copiedEmailTag) {
          copiedEmailTag.classList.add('visible');
          setTimeout(() => {
            copiedEmailTag.classList.remove('visible');
          }, 2500);
        }
        const isEn = htmlElement.getAttribute('lang') === 'en';
        showToast(isEn ? 'Email copied to clipboard!' : '¡Email copiado al portapapeles!');
      }
    });
  }

  // Robust Clipboard Copy Helper (works on HTTPS, localhost, file://)
  async function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        console.warn('navigator.clipboard failed, trying execCommand fallback', e);
      }
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    } catch (err) {
      console.error('Fallback execCommand failed:', err);
      textArea.remove();
      return false;
    }
  }

  // 6. Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function closeMobileMenu() {
    if (mobileMenuBtn && mobileNavDrawer) {
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileNavDrawer.classList.remove('open');
    }
  }

  function toggleMobileMenu() {
    if (mobileMenuBtn && mobileNavDrawer) {
      const isOpen = mobileNavDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        mobileMenuBtn.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileNavDrawer.classList.add('open');
      }
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close mobile drawer when tapping any mobile nav link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close mobile menu on click outside
  document.addEventListener('click', (e) => {
    if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
      const isInsideNavbar = e.target.closest('#navbar');
      if (!isInsideNavbar) {
        closeMobileMenu();
      }
    }
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // Close mobile menu on window resize if larger than tablet breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  // 7. Toast Notification Utility
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
});