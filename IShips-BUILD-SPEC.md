# IShips General Trading — Build Spec ("Foundry" Design System)

> Hand this file to Claude Code. It is the single source of truth for the whole site.
> Rule: **never invent new colors/fonts/spacing. Only use the tokens below.**

---

## 0. The vibe (read first)
Cinematic industrial-premium with a **balanced light + dark rhythm** (locked version:
`iships-foundry-light.html`). Molten amber accent, big bold uppercase Archivo display,
photographic sections, animated counters, one amber commodity marquee.
Think "heavy-duty trading house that charges a premium." NOT cute, NOT rounded, NOT pastel.

**Section rhythm (alternate dark/light so it breathes — do NOT make it all dark):**
1. Hero — DARK (full-bleed image + amber)
2. Marquee — AMBER
3. Stats — LIGHT
4. Divisions — LIGHT background with DARK image cards
5. About — LIGHT (amber "10+" badge on image)
6. Why Iships — DARK (mid-scroll punch)
7. CTA — LIGHT
8. Footer — DARK

Body/light sections use warm off-white `--light:#F4F1EA` (never harsh pure white).
On light sections, use `--amber-deep:#C85E1E` for accent text so orange stays readable.

---

## 1. Color tokens
```css
:root{
  /* DARK (hero, why-band, footer) */
  --bg:#0A0A0B;        /* near-black */
  --bg-2:#111113;      /* alt dark band */
  /* LIGHT (stats, divisions, about, cta) */
  --light:#F4F1EA;     /* warm off-white body bg — NOT pure white */
  --light-2:#ECE7DB;
  --white:#FBF9F4;     /* raised light surfaces */
  /* TEXT */
  --bone:#EDEAE4;      /* text on dark */
  --bone-dim:#92928E;  /* muted on dark */
  --ink:#191A1B;       /* text on light */
  --muted:#63645F;     /* muted on light */
  /* ACCENT */
  --amber:#E8732B;       /* primary accent (use on dark) */
  --amber-lite:#FF9A4D;  /* hover / on-dark highlight */
  --amber-deep:#C85E1E;  /* accent text ON LIGHT sections (readable) */
  /* LINES */
  --line-d:rgba(237,234,228,.09);   /* divider on dark */
  --line-l:rgba(25,26,27,.14);      /* divider on light */
  --line-amber:rgba(232,115,43,.3); /* amber hairline */
}
```
**Usage law:** amber is the ONLY bright color. On dark use `--amber`, on light use
`--amber-deep`. Everything else is the charcoal/bone (dark) or ink/muted (light) scale.

---

## 2. Typography
Load from Google Fonts:
- **Archivo** (700/800/900) — all display & headings. UPPERCASE, letter-spacing:-.02em.
- **Inter** (400/500/600) — all body text, paragraphs, labels.
- **Space Grotesk** (400/500) — small uppercase technical labels, eyebrows, marquee, footer meta.

Type scale (clamp = responsive):
```css
h1 / hero : Archivo 900, clamp(3.6rem, 12vw, 9.5rem), line-height:.86
h2 / sec  : Archivo 900, clamp(2.4rem, 6vw, 4.6rem), line-height:.94
h3 / card : Archivo 800, 1.7rem, UPPERCASE
eyebrow   : Space Grotesk 700, .74rem, letter-spacing:.24em, UPPERCASE, color:amber-lite
body      : Inter 400, 1rem–1.12rem, color:bone-dim
button    : Archivo 700, .78rem, letter-spacing:.1em, UPPERCASE
```

---

## 3. Spacing & layout
```
container max-width : 1280px
container padding   : 0 40px  (0 24px on mobile)
section padding     : 120px 0  (90px on mobile)
grid gap (cards)    : 18px
border-radius       : 2px everywhere (sharp, industrial). Never large radii.
```

---

## 4. Components (reuse these exact patterns)

**Button (primary)** — bg:amber, text:bg, Archivo 700 uppercase, 16px 32px, hover→amber-lite
**Button (ghost)** — 1px line border, text:bone, hover→border amber + text amber-lite
**Nav** — fixed, transparent over hero; on scroll>40px add `.solid` (bg rgba(10,10,11,.85) + blur(16px) + soft bottom border)
**Stat counter** — Archivo 900 3.6rem, number animates 0→target on scroll into view (IntersectionObserver + requestAnimationFrame, ~1400ms)
**Marquee** — amber bg, black Archivo 800 uppercase text, infinite scroll, items separated by ● ; duplicate the list twice for seamless loop
**Division card** — full-bleed image, opacity .55, dark bottom gradient, big number (Archivo 900 amber), title, desc, "Enquire →" with arrow that slides on hover; image scales 1.08 on hover
**Reveal animation** — elements start opacity:0 translateY(24px); add `.in` via IntersectionObserver, stagger 90ms

---

## 5. Imagery rules
- Every image sits inside a `.ph` div with a gradient background fallback.
- Every `<img>` gets `onerror="this.remove()"` so a broken URL reveals the gradient (no broken icons).
- Replace ALL stock photos with the client's real photos when received (yard, scrap, warehouse, containers, team).
- Image treatment: always darkened (opacity .3–.62) so bone text stays readable.

---

## 6. Pages to build
1. **index.html** — home (hero, marquee, stats, divisions, about/feature, CTA, footer)
2. **scrap.html** — Scrap Trading division (full page)
3. **spare-parts.html** — Spare Parts division
4. **import-export.html** — Import & Export division
5. **about.html** — company story, values, stats, team
6. **gallery.html** — photo grid of operations/stock
7. **contact.html** — contact info + the live Quote/Inquiry form

> Separate division pages (not one combined) — looks more substantial + better SEO.

Shared header/footer across all pages (same nav + footer markup).

---

## 7. Backend (lean — money-maker only)
Same stack as IMAKSA: **Node/Express/MongoDB on Railway**.
Scope = ONE thing: the Quote/Inquiry form.
- `POST /api/inquiries` → save to Mongo + email the owner (Nodemailer, reuse IMAKSA pattern)
- Fields: name, email, phone, division (Scrap/Parts/Import-Export/Other), message
- Simple admin inbox page (list of inquiries, mark as read) — reuse IMAKSA admin auth pattern
- DO NOT build a product CMS yet. Upsell a live stock catalog later if the client wants it.

Env vars needed: `MONGODB_URI` (remember the `/iships_db` at the end — the IMAKSA bug),
`JWT_SECRET`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `OWNER_EMAIL`.

---

## 8. Repos
- Frontend: `Aakib045/Iships-Website` → Vercel
- Backend:  `Aakib045/iships-backend` → Railway

---

## 9. Copy-paste prompt for Claude Code
> "Build the IShips General Trading website using BUILD-SPEC.md as the strict design
> system. Start with index.html matching the Foundry homepage, then build scrap.html,
> spare-parts.html, import-export.html, about.html, gallery.html, contact.html with a
> shared nav + footer. Use only the color/font/spacing tokens in the spec. Then build
> the lean Express/MongoDB backend for the quote form per section 7. Deploy frontend to
> Vercel and backend to Railway."
