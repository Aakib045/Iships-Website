// Active nav link — detect current page and apply .active
(function () {
  const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const divisionPages = ['scrap.html', 'spare-parts.html', 'import-export.html'];

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = (link.getAttribute('href') || '').replace(/^\//, '');
    if (file === 'index.html' && (href === 'index.html' || href === '')) {
      link.classList.add('active');
    } else if (file === 'about.html' && href === 'about.html') {
      link.classList.add('active');
    } else if (file === 'contact.html' && href === 'contact.html') {
      link.classList.add('active');
    } else if (divisionPages.includes(file) && (href === 'index.html#divisions' || href === '#divisions')) {
      link.classList.add('active');
    }
  });
})();

// Nav — transparent over hero, solid on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40));

// Hamburger menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    nav.classList.toggle('nav-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      nav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Reveal + counters — skipped when GSAP is loaded (animations.js takes over)
if (!window.gsap) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(x => {
      if (x.isIntersecting) {
        x.target.classList.add('in');
        io.unobserve(x.target);
      }
    });
  }, { threshold: .12 });

  document.querySelectorAll('.rv').forEach((el, i) => {
    el.style.transitionDelay = (i % 3 * 90) + 'ms';
    io.observe(el);
  });

  const cio = new IntersectionObserver(entries => {
    entries.forEach(x => {
      if (x.isIntersecting) {
        const el = x.target;
        const to = +el.dataset.to;
        let start = null;
        const tick = t => {
          if (!start) start = t;
          const p = Math.min((t - start) / 1400, 1);
          el.textContent = Math.floor(p * to);
          p < 1 ? requestAnimationFrame(tick) : el.textContent = to;
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      }
    });
  }, { threshold: .5 });

  document.querySelectorAll('.count').forEach(el => cio.observe(el));
}

// Contact form — shows inline confirmation; replace preventDefault with real POST when backend is live
const iqForm = document.getElementById('iq-form');
if (iqForm) {
  iqForm.addEventListener('submit', e => {
    e.preventDefault();
    const notice = document.getElementById('form-notice');
    notice.className = 'form-notice success';
    notice.textContent = 'Thanks — we\'ll be in touch within 24 hours.';
    notice.style.display = 'block';
    iqForm.reset();
    notice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
