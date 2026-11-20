// Index page: the image is fixed at the top and the titles scroll behind it. checklist.html?id=3 starts at 3.
// The title sitting right under the image is the current one; scrolling swaps the image and links.
const $ = id => document.getElementById(id);
const stage = $('stage'), list = $('list'), entries = $('entries');
history.scrollRestoration = 'manual';

entries.innerHTML = PROJECTS.map(p => `<div class="entry" data-id="${p.id}"><span>${p.id}</span><p>${esc(p.title)}</p></div>`).join('');

// Scrolling to a new entry empties the image box (white) and fills it once the new image/video has its first frame.
let swap = 0;
const setHero = p => {
  const t = ++swap, tmp = document.createElement('div');
  $('hero').replaceChildren();
  tmp.innerHTML = mediaHTML(p);
  const el = tmp.firstElementChild;
  const done = () => { if (t !== swap) return; $('hero').replaceChildren(el); if (el.play) el.play().catch(() => {}); };
  el.addEventListener(el.tagName === 'VIDEO' ? 'loadeddata' : 'load', done, { once: true });
  el.addEventListener('error', done, { once: true });
};

// After REST.wait seconds with no scrolling or mouse movement, the video fades into the stock image over REST.fade seconds.
// Any activity brings the video back.
const REST = { wait: 5, fade: 10 };
const hero = $('hero');
hero.style.setProperty('--fade', REST.fade + 's');
let idle;
const wake = () => {
  hero.classList.remove('rest');
  clearTimeout(idle);
  idle = setTimeout(() => hero.classList.add('rest'), REST.wait * 1000);
};
['scroll', 'wheel', 'pointermove', 'pointerdown', 'keydown', 'touchstart'].forEach(t => addEventListener(t, wake, { passive: true }));

let current;
const show = p => {
  current = String(p.id);
  entries.querySelectorAll('.entry').forEach(e => e.classList.toggle('on', e.dataset.id === current));
  setHero(p);
  $('back').href = 'index.html?focus=' + p.id;
  $('directions').href = visitUrl(p);
  history.replaceState(null, '', '?id=' + p.id);
};

// The list starts right under the image, and ends with just enough space to scroll the last title up under it.
const layout = () => {
  const last = entries.lastElementChild, h = stage.getBoundingClientRect().height;
  list.style.setProperty('--stage-h', h + 'px');
  list.style.setProperty('--pad-b', Math.max(innerHeight - h - last.offsetHeight - parseFloat(getComputedStyle(last).marginBottom), 0) + 1 + 'px');
  document.documentElement.style.scrollPaddingTop = h + 'px'; // snap point: right under the image
  scrollTo(0, entries.querySelector('.entry.on').getBoundingClientRect().top + scrollY - h);
};

show(PROJECTS.find(p => String(p.id) === new URLSearchParams(location.search).get('id')) || PROJECTS[0]);
layout();
addEventListener('resize', layout);

let queued = false;
addEventListener('scroll', () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    const line = stage.getBoundingClientRect().bottom;
    const el = [...entries.children].find(e => { const r = e.getBoundingClientRect(); return r.top + r.height / 2 > line; });
    if (el && el.dataset.id !== current) show(PROJECTS.find(p => String(p.id) === el.dataset.id));
  });
}, { passive: true });

wake();

// Once the page has loaded, download every image/video one at a time (nearest the current entry first),
// so each is already in the browser's cache when you scroll to it.
addEventListener('load', async () => {
  const at = PROJECTS.findIndex(p => String(p.id) === current);
  const order = PROJECTS.map((p, i) => [Math.abs(i - at), p]).sort((a, b) => a[0] - b[0]).slice(1);
  for (const [, p] of order) { try { await (await fetch(archiveSrc(p))).blob(); } catch (e) {} }
});

// Full screen: click the image to fill the screen with it.
// Computer: text over the image (5/30 on the left, Close on the right). Click the left or right half, or use the arrow keys, to move between images. Esc or Close leaves.
// Phone: just the full screen image, tap to close.
const phone = matchMedia('(max-width: 800px)');
const full = document.createElement('div');
full.id = 'full';
full.innerHTML = '<p class="bar"><span id="count"></span><a data-go="close">Close</a></p><div class="media"></div>';
document.body.append(full);

let at = 0; // index of the entry shown full screen
const paint = () => {
  full.querySelector('.media').innerHTML = mediaHTML(PROJECTS[at]);
  full.querySelector('#count').textContent = (at + 1) + '/' + PROJECTS.length;
  const m = full.querySelector('.media').firstElementChild;
  if (m && m.play) m.play().catch(() => {});
};
const openFull = () => {
  at = PROJECTS.findIndex(p => String(p.id) === current);
  paint();
  full.classList.add('on');
  document.documentElement.style.overflow = 'hidden'; // the page behind doesn't scroll
  if (full.requestFullscreen) full.requestFullscreen().catch(() => {}); // hides the browser bars where the browser allows it (not iPhone)
};
const closeFull = () => {
  if (!full.classList.contains('on')) return;
  full.classList.remove('on');
  full.querySelector('.media').innerHTML = '';
  document.documentElement.style.overflow = '';
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  if (String(PROJECTS[at].id) !== current) { // moved to another image: the Index page lands on it too
    show(PROJECTS[at]);
    scrollTo(0, entries.querySelector('.entry.on').getBoundingClientRect().top + scrollY - stage.getBoundingClientRect().height);
  }
};
const step = d => { at = (at + d + PROJECTS.length) % PROJECTS.length; paint(); };

$('hero').addEventListener('click', openFull);
full.addEventListener('click', e => {
  if (phone.matches) return closeFull();                     // phone: tap to close, nothing else
  if (e.target.closest('[data-go="close"]')) return closeFull();
  step(e.clientX < innerWidth / 2 ? -1 : 1);                 // computer: left half back, right half forward
});
full.addEventListener('mousemove', e => full.classList.toggle('left', e.clientX < innerWidth / 2)); // picks the cursor
addEventListener('keydown', e => {
  if (!full.classList.contains('on')) return;
  if (e.key === 'Escape') closeFull();
  if (!phone.matches && e.key === 'ArrowLeft') step(-1);
  if (!phone.matches && e.key === 'ArrowRight') step(1);
});
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) closeFull(); });
