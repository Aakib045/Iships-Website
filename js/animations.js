/**
 * animations.js — GSAP + ScrollTrigger motion layer
 * Loaded only on pages that include it. main.js detects window.gsap and
 * skips its CSS fallback, so there is no double-animation conflict.
 *
 * Rules:
 *   - transforms & opacity only (GPU-friendly, no layout thrash)
 *   - prefers-reduced-motion: bail out completely, restore visibility
 *   - subtle & intentional — nothing flashy
 */

(function () {
  'use strict';

  // ── Reduced-motion: make everything visible immediately and exit ──
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.rv').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // ── Safety: GSAP + ScrollTrigger must both be present ────────────
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // ── Disable CSS transitions on .rv so GSAP owns those properties ─
  // (prevents the CSS `transition:1s` from fighting GSAP's keyframes)
  document.querySelectorAll('.rv').forEach(el => {
    el.style.transition = 'none';
    el.style.transitionDelay = '0ms';
  });


  // ═══════════════════════════════════════════════════════════════════
  // 1. HERO — page-load sequence (no ScrollTrigger)
  // ═══════════════════════════════════════════════════════════════════
  const heroEl = document.querySelector('.hero');

  if (heroEl) {
    const eyebrow = heroEl.querySelector('.eyebrow');
    const h1      = heroEl.querySelector('h1');
    const heroP   = heroEl.querySelector('p.rv');
    const heroCta = heroEl.querySelector('.hero-cta');

    // ── Split h1 into per-line spans for staggered reveal ──────────
    // Input:  Scrap.<br>Parts.<br><span>Trade.</span>
    // Output: <span class="h1-line">Scrap.</span><br>
    //         <span class="h1-line">Parts.</span><br>
    //         <span class="h1-line"><span>Trade.</span></span>
    let lines = [];
    if (h1) {
      const nodes = [...h1.childNodes];
      h1.innerHTML = '';
      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const s = document.createElement('span');
          s.className = 'h1-line';
          s.textContent = node.textContent;
          h1.appendChild(s);
          lines.push(s);
        } else if (node.nodeName === 'BR') {
          h1.appendChild(document.createElement('br'));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const s = document.createElement('span');
          s.className = 'h1-line';
          s.appendChild(node.cloneNode(true));
          h1.appendChild(s);
          lines.push(s);
        }
      });
      // h1 container becomes visible; only the inner lines animate
      gsap.set(h1, { opacity: 1, y: 0 });
    }

    // ── Set initial hidden states (all synchronous, no visible flash) ─
    if (eyebrow)         gsap.set(eyebrow, { opacity: 0, y: 16 });
    if (lines.length)    gsap.set(lines,   { opacity: 0, y: 38 });
    if (heroP)           gsap.set(heroP,   { opacity: 0, y: 20 });
    if (heroCta)         gsap.set(heroCta, { opacity: 0, y: 16 });

    // ── Entrance timeline ───────────────────────────────────────────
    const tl = gsap.timeline({ delay: 0.12 });

    if (eyebrow)
      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' });

    if (lines.length)
      tl.to(lines, {
        opacity: 1, y: 0,
        duration: 0.95,
        ease: 'power3.out',
        stagger: 0.14
      }, '-=0.25');

    if (heroP)
      tl.to(heroP, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4');

    if (heroCta)
      tl.to(heroCta, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.38');

    // ── Ken-burns: slow background zoom ────────────────────────────
    const bgImg = heroEl.querySelector('.hero-bg img');
    if (bgImg) {
      gsap.fromTo(bgImg,
        { scale: 1,    transformOrigin: 'center center' },
        { scale: 1.08, duration: 13, ease: 'none' }
      );
    }
  }


  // ═══════════════════════════════════════════════════════════════════
  // 2. SECTION REVEALS — ScrollTrigger.batch groups visible elements
  // ═══════════════════════════════════════════════════════════════════
  // Collect all .rv elements that are NOT inside the hero header
  const revealEls = gsap.utils.toArray('.rv').filter(el => !el.closest('.hero'));

  // Set initial invisible state for all of them upfront
  gsap.set(revealEls, { opacity: 0, y: 24 });

  // Batch: elements that enter the viewport within 100ms of each other
  // are animated together with a stagger — creates natural section-wide
  // reveals without manual per-section targeting.
  ScrollTrigger.batch(revealEls, {
    onEnter: batch => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.78,
        ease: 'power2.out',
        stagger: { each: 0.09 },
        overwrite: 'auto'
      });
    },
    // Fires each time an element re-enters (scroll up then back down);
    // since targets are already at opacity:1 it's a visual no-op.
    start: 'top 84%'
  });


  // ═══════════════════════════════════════════════════════════════════
  // 3. STATS COUNTERS — eased via GSAP proxy, ScrollTrigger triggered
  // ═══════════════════════════════════════════════════════════════════
  document.querySelectorAll('.count').forEach(el => {
    const target = parseInt(el.dataset.to, 10);
    if (isNaN(target)) return;

    const proxy = { val: 0 };
    gsap.to(proxy, {
      val: target,
      duration: 1.9,
      ease: 'power2.out',
      delay: 0.42,          // let the parent .rv fade-in lead slightly
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        once: true
      },
      onUpdate()  { el.textContent = Math.round(proxy.val); },
      onComplete() { el.textContent = target; }
    });
  });


  // ═══════════════════════════════════════════════════════════════════
  // 4. DIVISION CARDS — hover lift (image scale handled by CSS)
  // ═══════════════════════════════════════════════════════════════════
  document.querySelectorAll('.dv').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -6, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0,  duration: 0.45, ease: 'power2.inOut', overwrite: 'auto' });
    });
  });


  // ═══════════════════════════════════════════════════════════════════
  // 5. MARQUEE — pause CSS animation on hover
  // ═══════════════════════════════════════════════════════════════════
  const marqueeBand  = document.querySelector('.marquee');
  const marqueeTrack = document.querySelector('.mq');
  if (marqueeBand && marqueeTrack) {
    marqueeBand.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeBand.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }


  // ═══════════════════════════════════════════════════════════════════
  // 6. BUTTON MICRO-HOVER — 3% scale nudge, GPU-only
  // ═══════════════════════════════════════════════════════════════════
  document.querySelectorAll('.btn, .ghost, .nav-cta').forEach(btn => {
    // Skip native <button> elements (form submit) — they handle their own state
    if (btn.tagName === 'BUTTON') return;

    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.03, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1,    duration: 0.28, ease: 'power2.inOut', overwrite: 'auto' });
    });
  });

})();
