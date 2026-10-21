import set from '../content/set.json';
import kits from '../content/kits.json';
import renders from '../content/renders.json';
import vendors from '../content/vendors.json';
import { SWATCHES } from './swatches.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const price = (p) => (p == null ? 'TBC' : `$${p}`);

const kit = (k) => `<article class="kit rv">${k.image ? `<figure class="kit-img"><img src="${esc(k.image)}" alt="${esc(k.alt)}"${k.full ? ` data-full="${esc(k.full)}"` : ''} loading="lazy" decoding="async" width="1400" height="1400"></figure>` : ''}<h3>${esc(k.name)}</h3><p class="data">${price(k.price)}</p></article>`;

// the kits page as HTML. The build writes it into index.html (vite.config.js), so crawlers and link previews see the
// content without running JavaScript; the dev server does the same
export function showcaseHTML(base = '/') {
  return `
    <div class="sc-wrap">
      <section class="sc-reveal" id="reveal" aria-labelledby="sc-name">
        <div class="sc-hero">
          <h2 class="sc-name" id="sc-name" aria-label="${esc(set.name)}"><span class="logo" aria-hidden="true"></span><span class="sc-by">by <i class="sc-dk" role="img" aria-label="Deltakeyco" style="--dk:url(${base}brands/deltakeyco-mark.svg)"></i></span></h2>
          <p class="sc-lede">${esc(set.tagline)}</p>
          <a class="sc-cta" href="#vendors">Where to buy</a>
        </div>
        <figure class="sc-render"><img src="${base}renders/hero.webp" alt="An M60 in GMK Liminal, half sunk into the carpet of Level 0" decoding="async"></figure>
      </section>

      <section class="sc-section" id="colorway" aria-labelledby="colorway-h">
        <div class="sc-head rv"><h2 class="sc-title" id="colorway-h">Colorway</h2><p class="sc-lede">Four colors, taken from the building.</p></div>
        <ul class="strip rv">${SWATCHES.map((s) => `
          <li style="--c:${s.hex}"><i aria-hidden="true"></i><span class="strip-name">${esc(s.name)}</span></li>`).join('')}
        </ul>
      </section>

      <section class="sc-section" id="kits" aria-labelledby="kits-h">
        <div class="sc-head rv"><h2 class="sc-title" id="kits-h">Kits</h2><p class="sc-lede">Five kits and two deskmats.</p></div>
        <div class="kits">${kits.filter((k) => k.kind !== 'deskmat').map(kit).join('')}</div>
        <div class="kits mats">${kits.filter((k) => k.kind === 'deskmat').map(kit).join('')}</div>
      </section>

      <section class="sc-section" id="renders" aria-labelledby="renders-h">
        <div class="sc-head rv"><h2 class="sc-title" id="renders-h">Renders</h2><p class="sc-lede">The set, as it sits in the building.</p></div>
        <div class="renders">${renders.map((r) => `
          <figure class="render rv"><img src="${esc(r.src)}" alt="${esc(r.alt)}"${r.full ? ` data-full="${esc(r.full)}"` : ''} loading="lazy" decoding="async" width="1200" height="1200"></figure>`).join('')}
        </div>
      </section>

      <section class="sc-section" id="vendors" aria-labelledby="vendors-h">
        <div class="sc-head rv"><h2 class="sc-title" id="vendors-h">Vendors</h2><p class="sc-lede">Where to buy.</p></div>
        <ul class="vendors data">${vendors.map((v) => `
          <li><span class="v-name">${esc(v.name)}</span><span>${esc(v.region)}</span>
          ${v.url ? `<a href="${esc(v.url)}" rel="noopener">Open</a>` : '<span class="off">Link TBC</span>'}</li>`).join('')}
        </ul>
      </section>

      <footer class="sc-foot" id="end">
        <p class="sc-foot-mark" aria-label="${esc(set.name)}"><span class="logo" aria-hidden="true"></span></p>
        <span class="sc-foot-logos"><img src="${base}brands/manu.svg" alt="manu" width="62" height="40"><span class="sc-foot-sep" aria-hidden="true">/</span><img src="${base}brands/designer01.webp" alt="designer01" width="38" height="40"></span>
        <a class="sc-foot-link" href="privacy.html">Privacy</a>
        <button type="button" id="back-to-start">Back to top</button>
      </footer>
    </div>`;
}

export function renderShowcase(root) {
  if (!root.firstElementChild) root.innerHTML = showcaseHTML(import.meta.env.BASE_URL);

  // each render and kit picture can be opened larger (src/lightbox.js): a button over the picture, so it is reachable by keyboard
  root.querySelectorAll('.render, .kit-img').forEach((f) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'zoom'; b.setAttribute('aria-label', `View larger: ${f.querySelector('img').alt}`);
    f.append(b);
  });

  // the picture frames show a skeleton until their image has arrived
  root.querySelectorAll('.sc-render, .render, .kit-img').forEach((f) => {
    const img = f.querySelector('img'), done = () => f.classList.add('is-loaded');
    if (img.complete) done(); else { img.addEventListener('load', done); img.addEventListener('error', done); }
  });

  // sections settle in as they arrive, a few at a time
  const items = root.querySelectorAll('.rv');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  root.classList.add('has-rv');
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -8% 0px' });
  [...items, root.querySelector('.sc-render')].forEach((el) => io.observe(el));   // the hero render settles as it arrives
}
