// Checklist page: location + image fixed, the 34 theses scroll behind. checklist.html?id=3 (no id = thesis 1)
(() => {
  const $ = id => document.getElementById(id);
  const id = new URLSearchParams(location.search).get('id');
  const p = PROJECTS.find(p => String(p.id) === id) || PROJECTS[0];
  history.scrollRestoration = 'manual';

  document.title = `${p.id} | 1 Person, Nature`;

  // Show details / Hide details: open by default; stays as you left it when you go to another thesis
  let open = true;
  try { const v = sessionStorage.getItem('specInfo'); if (v !== null) open = v === '1'; } catch (err) {}
  $('app').innerHTML = textMarkup(p, open);
  const stage = $('stage'), list = $('list'), entries = $('entries'), btn = $('meta-btn');
  const setInfo = on => {
    open = on;
    stage.classList.toggle('open', on);
    btn.textContent = on ? 'Hide details' : 'Show details';
    try { sessionStorage.setItem('specInfo', on ? '1' : '0'); } catch (err) {}
  };
  setInfo(open);
  btn.addEventListener('click', e => { e.preventDefault(); setInfo(!open); setStage(); }); // text moves to make room

  // The list starts right under the fixed block. The space after the last thesis is only as big as
  // needed to still scroll thesis 34 up under the image.
  const setStage = () => {
    const last = entries.lastElementChild;
    const need = innerHeight - stage.offsetHeight - last.offsetHeight - parseFloat(getComputedStyle(last).marginBottom);
    list.style.setProperty('--stage-h', stage.offsetHeight + 'px');
    list.style.setProperty('--pad-b', Math.max(need, 0) + 1 + 'px');
  };
  // scroll so the selected thesis sits directly under the image
  const align = smooth => {
    const el = entries.querySelector('.entry.on');
    const top = el.getBoundingClientRect().top + scrollY - stage.getBoundingClientRect().bottom;
    scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
  };

  // click another thesis: normal page load of that one, and the text slides from where it was.
  // click the current thesis: slide it back under the image.
  entries.addEventListener('click', e => {
    const a = e.target.closest('.entry');
    if (!a) return;
    if (a.dataset.id === String(p.id)) { e.preventDefault(); align(true); return; }
    try { sessionStorage.setItem('specScroll', String(scrollY)); } catch (err) {}
  });

  // the image box has a fixed 8:5 shape, so the layout can be set right away
  setStage();
  let from = null;
  try { from = sessionStorage.getItem('specScroll'); sessionStorage.removeItem('specScroll'); } catch (err) {}
  if (from !== null) {
    scrollTo(0, Number(from)); // where the text was on the previous thesis
    document.body.classList.add('ready');
    requestAnimationFrame(() => requestAnimationFrame(() => align(true)));
  } else {
    align(false);
    document.body.classList.add('ready');
  }
  addEventListener('resize', () => { setStage(); align(false); });
})();
