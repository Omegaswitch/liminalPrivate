// Click a render or kit picture to see it larger. The picture itself travels: it grows from where it sits on the page to the
// middle of the screen (and shrinks back), so the eye follows one object instead of a pop-up appearing. Built on the Web
// Animations API with transform and opacity only, one easing, and closing is the same animation played backwards, so
// closing (or clicking again) halfway through is as smooth as finishing. The larger file, where there is one, loads in while
// it opens and is swapped in once decoded. Inside, Previous / Next (or the arrow keys, or a swipe) step through the
// other pictures of the same section, so the kits can be looked through one after another.
import { mirrorize } from './mirror.js';

const OPEN_MS = 760, CLOSE_RATE = 1.35, EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function createLightbox({ canOpen = () => true, onOpen = () => {}, onClose = () => {} } = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const box = document.createElement('div');
  box.className = 'lb'; box.hidden = true;
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Larger picture');
  box.innerHTML = '<div class="lb-back"></div><figure class="lb-fig"><div class="lb-frame"><img class="lb-img" alt=""></div></figure>'
    + '<button type="button" class="lb-close" aria-label="Close">Close</button>'
    + '<button type="button" class="lb-step lb-prev" aria-label="Previous picture">Prev</button>'
    + '<button type="button" class="lb-step lb-next" aria-label="Next picture">Next</button>';
  document.body.append(box);
  mirrorize(box);
  const back = box.querySelector('.lb-back'), frame = box.querySelector('.lb-frame'), img = box.querySelector('.lb-img');
  const closeBtn = box.querySelector('.lb-close'), steps = [...box.querySelectorAll('.lb-step')];

  let state = 'closed', anims = [], opener = null, figure = null, group = [];
  const duration = reduced ? 1 : OPEN_MS;

  // shows btn's picture in the frame and builds the travel between its place on the page and the middle of the screen
  function show(btn) {
    opener = btn; figure = btn.parentElement;
    const thumb = figure.querySelector('img'), window_ = figure.getBoundingClientRect(), shown = thumb.getBoundingClientRect();
    const nw = thumb.naturalWidth || 1, nh = thumb.naturalHeight || 1;
    img.src = thumb.currentSrc || thumb.src; img.alt = thumb.alt;   // the picture alone, no caption: the description is for screen readers
    frame.style.setProperty('--ar', nw / nh);
    box.hidden = false;
    const to = frame.getBoundingClientRect();                       // where CSS puts it: centred, as large as fits
    const opts = { duration, easing: EASE, fill: 'both' };
    figure.style.visibility = 'hidden';                             // the travelling copy stands in for it
    loadFull(thumb, btn);

    // stepped to a picture that is off screen: it fades in and out where it is instead of travelling
    if (window_.bottom < 0 || window_.top > innerHeight) {
      return [frame.animate([{ opacity: 0, transform: `translate(${to.width * 0.02}px, ${to.height * 0.02}px) scale(0.96)` }, { opacity: 1, transform: 'none' }], opts),
        img.animate([{ transform: 'none' }, { transform: 'none' }], opts)];
    }

    // frame: the window the thumbnail is seen through, grown to the final size. image: the picture as the thumbnail shows it
    // (cropped and offset by its own frame), brought to fill the frame. Both in the frame's final coordinates.
    const k = window_.width / to.width;
    const c = Math.max(shown.width / nw, shown.height / nh), cw = nw * c, ch = nh * c;        // what the thumbnail really shows
    const cl = shown.left + (shown.width - cw) / 2, ct = shown.top + (shown.height - ch) / 2;
    const frameFrom = `translate(${window_.left - to.left}px, ${window_.top - to.top}px) scale(${k})`;
    const imgFrom = `translate(${(cl - window_.left) / k}px, ${(ct - window_.top) / k}px) scale(${cw / window_.width}, ${ch / window_.height})`;
    return [
      frame.animate([{ transform: frameFrom }, { transform: 'none' }], opts),
      img.animate([{ transform: imgFrom }, { transform: 'none' }], opts),
    ];
  }

  function loadFull(thumb, btn) {
    const full = thumb.dataset.full;                                // the larger file arrives while it opens
    if (!full) return;
    const big = new Image(); big.src = full;
    big.decode().then(() => { if (opener === btn && state !== 'closed') img.src = full; }, () => {});
  }

  function open(btn) {
    if (state !== 'closed' || !canOpen()) return;
    group = [...btn.closest('section').querySelectorAll('.zoom')];  // the pictures of the same section, in page order
    steps.forEach((s) => { s.hidden = group.length < 2; });
    state = 'open'; onOpen();
    const fade = { duration: duration * 0.5, delay: duration * 0.4, easing: 'ease-out', fill: 'both' };
    anims = [
      ...show(btn),
      back.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing: 'ease-out', fill: 'both' }),
      ...[closeBtn, ...steps].map((b) => b.animate([{ opacity: 0 }, { opacity: 1 }], fade)),
    ];
    closeBtn.focus({ preventScroll: true });
  }

  // the next or previous picture of the section: a quick cross-fade in the frame, and the close travels back to its place
  function step(dir) {
    if (state !== 'open' || group.length < 2) return;
    const next = group[(group.indexOf(opener) + dir + group.length) % group.length];
    let out = null;
    const swap = () => {
      out?.cancel();
      anims.slice(0, 2).forEach((a) => a.cancel());
      figure.style.visibility = '';
      const travel = show(next);
      travel.forEach((a) => a.finish());
      anims.splice(0, 2, ...travel);
      if (!reduced) img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
    };
    if (reduced) swap();
    else {
      out = img.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease-in', fill: 'forwards' });
      out.finished.then(() => (state === 'open' ? swap() : out.cancel()), () => {});
    }
  }

  function close() {
    if (state !== 'open') return;
    state = 'closing';
    anims.forEach((a) => { a.updatePlaybackRate(CLOSE_RATE); a.reverse(); });
    anims[0].finished.then(() => {
      if (state !== 'closing') return;                              // opened again meanwhile
      anims.forEach((a) => a.cancel());
      box.hidden = true; state = 'closed';
      figure.style.visibility = '';
      opener.focus({ preventScroll: true }); opener = figure = null;
      onClose();
    }, () => {});
  }

  // clicking again halfway through a close turns it round, smoothly
  function reopen() {
    state = 'open';
    anims.forEach((a) => { a.updatePlaybackRate(1); a.reverse(); });
  }

  document.addEventListener('click', (e) => {
    const zoom = e.target.closest?.('.zoom');
    if (zoom) { e.preventDefault(); open(zoom); return; }
    const s = e.target.closest?.('.lb-step');
    if (s) { step(s.classList.contains('lb-prev') ? -1 : 1); return; }
    if (!box.hidden && (e.target.closest('.lb-close') || !e.target.closest('.lb-frame'))) { state === 'open' ? close() : reopen(); }
  });
  addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if (state === 'open') close(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); step(e.key === 'ArrowLeft' ? -1 : 1); }
    else if (e.key === 'Tab') {                                     // focus stays on the dialog's own buttons
      e.preventDefault();
      const ctl = [closeBtn, ...steps].filter((b) => !b.hidden), i = ctl.indexOf(document.activeElement);
      ctl[(i + (e.shiftKey ? -1 : 1) + ctl.length) % ctl.length].focus({ preventScroll: true });
    }
  }, true);
  // a sideways swipe steps too
  let x0 = null;
  box.addEventListener('touchstart', (e) => { x0 = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });
  // the page behind stays put
  const hold = (e) => { if (!box.hidden) e.preventDefault(); };
  box.addEventListener('wheel', hold, { passive: false });
  box.addEventListener('touchmove', hold, { passive: false });
}
