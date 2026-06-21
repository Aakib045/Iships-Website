// Nav — transparent over hero, solid on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40));

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
