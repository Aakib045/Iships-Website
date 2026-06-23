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

// Contact form — POST to live backend
const iqForm = document.getElementById('iq-form');
if (iqForm) {
  iqForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const notice = document.getElementById('form-notice');
    const btn    = iqForm.querySelector('button[type="submit"]');
    const origLabel = btn.textContent;

    // Reset notice, enter loading state
    notice.style.display = 'none';
    notice.className = 'form-notice';
    btn.disabled = true;
    btn.textContent = 'Sending…';

    const payload = {
      name:     iqForm.elements['name'].value.trim(),
      email:    iqForm.elements['email'].value.trim(),
      phone:    iqForm.elements['phone'].value.trim(),
      division: iqForm.elements['division'].value,
      message:  iqForm.elements['message'].value.trim()
    };

    try {
      const res = await fetch('https://iships-backend-production.up.railway.app/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        notice.className = 'form-notice success';
        notice.textContent = 'Enquiry sent — we\'ll be in touch within one business day.';
        iqForm.reset();
      } else {
        throw new Error('status ' + res.status);
      }
    } catch (_) {
      notice.className = 'form-notice error';
      notice.textContent = 'Something went wrong. Please try again or email us at info@iships.ae.';
    }

    notice.style.display = 'block';
    btn.disabled = false;
    btn.textContent = origLabel;
    notice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
