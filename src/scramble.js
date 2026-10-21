// Like the set's alphas, where a legend is now and then the wrong letter, from another alphabet, turned on its side: every
// few seconds a few letters of something in view are swapped for foreign glyphs at odd angles, flicker, and come back.
// The glyph is drawn over the real letter (which keeps its width), so nothing reflows; screen readers get the plain text.
// glyphs by how wide they run, in em: a letter only ever takes a glyph that fits its own width, so a word never gets
// wider and a line never breaks differently
const POOLS = [
  [0, '1ΙІ|!¡/:;'],                                                   // narrow: i, l, t, j, r, f
  [0.55, '0123456789ЬЪГЛПЭΞΛΠΣ§¶?'],                                   // mid: most Latin letters
  [0.8, 'ЙЦУКЕНШЩЗХФЫВАПРОДЖЯЧСМИТБЮЁΩΨΔΦΘ#%&@'],                    // wide: m, w, o, a, e, n
  [0.95, 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'],   // full width: M, W
];
// upright or mirrored only, never turned: the legend is wrong, not the keycap
const TURNS = ['scaleX(1)', 'scaleX(1)', 'scaleX(-1)'];
const pick = (s) => s[Math.floor(Math.random() * s.length)];

export function scramble(root, selector) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = [...root.querySelectorAll(selector)].filter((el) => !el.closest('a, button')).map((el) => {
    const text = el.textContent;
    const letters = [];
    for (const node of [...el.childNodes]) {
      if (node.nodeType !== 3) continue;
      const box = document.createElement('span');
      box.setAttribute('aria-hidden', 'true');
      for (const ch of node.textContent) {
        if (/\s/.test(ch)) { box.append(ch); continue; }
        const s = document.createElement('span');
        s.className = 'sl';
        s.textContent = ch;
        box.append(s);
        letters.push(s);
      }
      node.replaceWith(box);
    }
    const plain = document.createElement('span');
    plain.className = 'sr-only';
    plain.textContent = text;
    el.append(plain);
    return { el, letters, busy: false };
  }).filter((t) => t.letters.length);

  // the glyphs that fit this letter: measured once, as its width in em
  const fit = (s) => {
    if (s._fit) return s._fit;
    const w = s.getBoundingClientRect().width / parseFloat(getComputedStyle(s).fontSize);
    return (s._fit = POOLS.filter(([min]) => w >= min * 0.9).map(([, g]) => g).join('') || POOLS[0][1]);
  };
  const set = (s, on) => {
    if (!on) { s.classList.remove('is-x'); return; }
    s.dataset.g = pick(fit(s));
    s.style.setProperty('--r', pick(TURNS));
    s.classList.add('is-x');
  };
  // a glitch: the letters go wrong together, hold, stutter once or twice, and come right together
  const hit = (t) => {
    t.busy = true;
    const n = Math.max(1, Math.round(t.letters.length * (0.1 + Math.random() * 0.2)));
    const chosen = [...t.letters].sort(() => Math.random() - 0.5).slice(0, n);
    const on = () => chosen.forEach((s) => set(s, true)), off = () => chosen.forEach((s) => set(s, false));
    const hold = 2400 + Math.random() * 1600, stutters = 1 + Math.floor(Math.random() * 2);
    on();
    let at = hold;
    for (let k = 0; k < stutters; k++) {
      setTimeout(off, at); at += 60 + Math.random() * 90;
      setTimeout(on, at); at += 120 + Math.random() * 220;
    }
    setTimeout(() => { off(); t.busy = false; }, at);
  };
  (function tick() {
    setTimeout(() => {
      if (!document.hidden) {
        const seen = targets.filter((t) => { const r = t.el.getBoundingClientRect(); return !t.busy && r.bottom > 0 && r.top < innerHeight; });
        if (seen.length) hit(pick(seen));
      }
      tick();
    }, 1600 + Math.random() * 2600);
  })();
}
