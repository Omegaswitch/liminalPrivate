// The renders drift inside their frames as the page scrolls, so each frame reads as a window onto the building. Uses CSS
// `translate`, which leaves the reveal's `transform` and the settle's `scale` alone. The image is taller than its frame and
// the shift is clamped to that slack, so a frame never shows a gap. Text stays put: it carries the buying information.
// shortcut: reads layout on every scroll, fine for five pictures; use an IntersectionObserver to pause the rest if the page grows.
// selector, speed, slack: how far the image may shift, as a share of the frame's height — no more than the image overhangs
// its frame on each side (showcase.css: the hero image is 108% tall at -4%, the renders 116% at -8%)
const LAYERS = [
  ['.sc-render img', 0.12, 0.04],
  ['.render:nth-child(odd) img', 0.06, 0.07],
  ['.render:nth-child(even) img', 0.13, 0.07],   // the two columns drift at different rates
];

export function createParallax(root) {
  // and not on touch screens: they scroll natively, ahead of the scroll events this runs on, and the address bar
  // changes the screen's height mid-scroll, so the pictures lag and jump behind the finger
  if (matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return () => {};
  const layers = LAYERS.flatMap(([sel, speed, give]) => [...root.querySelectorAll(sel)].map((img) => ({ img, frame: img.parentElement, speed, give })));
  return () => {
    const vh = innerHeight;
    for (const { img, frame, speed, give } of layers) {
      const r = frame.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const slack = r.height * give;
      const y = Math.max(-slack, Math.min(slack, (r.top + r.height / 2 - vh / 2) * speed));
      img.style.translate = `0 ${y.toFixed(1)}px`;
    }
  };
}
