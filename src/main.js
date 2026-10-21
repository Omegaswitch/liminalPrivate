import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import '@fontsource/archivo-narrow/400.css';
import '@fontsource/ibm-plex-mono/400.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/showcase.css';
import './styles/lightbox.css';
import { renderShowcase } from './showcase.js';
import { mirrorize } from './mirror.js';
import { createParallax } from './parallax.js';
import { scramble } from './scramble.js';
import { createLightbox } from './lightbox.js';


const root = document.documentElement;
const $ = (id) => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const showcase = $('showcase');

renderShowcase(showcase);
mirrorize();
scramble(showcase, '.sc-title, .sc-lede, .kit h3, .strip-name, .v-name, .sc-foot p');
const parallax = createParallax(showcase);
createLightbox({ onOpen: () => lenis?.stop(), onClose: () => lenis?.start() });
addEventListener('resize', parallax);

// ---- the page: the kits page from the top, with Lenis smooth scroll ----
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', onScroll);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
addEventListener('scroll', onScroll, { passive: true });
const go = (el, duration = 1.6) => (lenis ? lenis.scrollTo(el, { duration }) : (el === 0 ? scrollTo(0, 0) : el.scrollIntoView()));

function onScroll() {
  parallax();
  root.classList.toggle('past-hero', (showcase.querySelector('.sc-render')?.getBoundingClientRect().bottom ?? 1) < 60);
}
onScroll();

// every in-page link (the mark, "Where to buy") scrolls without writing to the address bar
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a[href^="#"]');
  const el = a && document.querySelector(a.getAttribute('href'));
  if (!el) return;
  e.preventDefault();
  go(el.id === 'reveal' ? 0 : el);
});
$('back-to-start')?.addEventListener('click', () => go(0, 2.4));
