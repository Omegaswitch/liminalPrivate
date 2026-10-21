// Hovering anything clickable turns its letters around: each letter is its own box and flips to its mirror image, one
// after another, then flips back. The element keeps its plain text as its accessible name.
export function mirrorize(root = document) {
  root.querySelectorAll('a, button').forEach((el) => {
    if (el.dataset.mirror) return;
    el.dataset.mirror = '1';
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    let i = 0;
    const walk = (node) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === 3) {
          if (!child.textContent.trim()) continue;
          const frag = document.createElement('span');               // one box per run of text, so flex layouts keep the spaces
          frag.className = 'mw';
          for (const ch of child.textContent) {
            if (/\s/.test(ch)) { frag.append(ch); continue; }
            const s = document.createElement('span');
            s.className = 'ml';
            s.setAttribute('aria-hidden', 'true');
            s.style.setProperty('--i', i++);
            s.textContent = ch;
            frag.append(s);
          }
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'svg') walk(child);
      }
    };
    walk(el);
  });
}
