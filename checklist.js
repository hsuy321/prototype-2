// Index page: the image is fixed at the top and the titles scroll behind it. checklist.html?id=3 starts at 3.
// The title sitting right under the image is the current one; scrolling swaps the image and links.
const $ = id => document.getElementById(id);
const stage = $('stage'), list = $('list'), entries = $('entries');
history.scrollRestoration = 'manual';

entries.innerHTML = PROJECTS.map(p => `<div class="entry" data-id="${p.id}"><span>${p.id}</span><p>${esc(p.title)}</p></div>`).join('');

let current;
const show = p => {
  current = String(p.id);
  entries.querySelectorAll('.entry').forEach(e => e.classList.toggle('on', e.dataset.id === current));
  $('hero').innerHTML = mediaHTML(p);
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
