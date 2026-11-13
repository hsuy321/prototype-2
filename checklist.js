// Checklist page: location + image fixed, the 30 titles scroll behind. checklist.html?id=3 (no id = 1)
(() => {
  const $ = id => document.getElementById(id);
  const id = new URLSearchParams(location.search).get('id');
  const p = PROJECTS.find(p => String(p.id) === id) || PROJECTS[0];
  history.scrollRestoration = 'manual';


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
  btn.addEventListener('click', e => { e.preventDefault(); setInfo(!open); setStage(); align(entries.querySelector('.entry.on'), false); }); // text moves to make room

  // The list starts right under the fixed block. The space after the last thesis is only as big as
  // needed to still scroll the last entry up under the image.
  const setStage = () => {
    const last = entries.lastElementChild;
    const need = innerHeight - stage.offsetHeight - last.offsetHeight - parseFloat(getComputedStyle(last).marginBottom);
    list.style.setProperty('--stage-h', stage.offsetHeight + 'px');
    document.documentElement.style.scrollPaddingTop = stage.getBoundingClientRect().bottom + 'px'; // snap point: right under the image
    list.style.setProperty('--pad-b', Math.max(need, 0) + 1 + 'px');
  };
  // scroll so an entry sits directly under the image
  const align = (el, smooth) => {
    const top = el.getBoundingClientRect().top + scrollY - stage.getBoundingClientRect().bottom;
    scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
  };

  // the entry sitting under the image is the current one: scrolling swaps image, details and map link
  let cur = String(p.id);
  const show = q => {
    cur = String(q.id);
    entries.querySelectorAll('.entry').forEach(e => e.classList.toggle('on', e.dataset.id === cur));
    $('hero').innerHTML = mediaHTML(archiveSrc(q), `onerror="this.style.display='none'"`);
    $('meta').innerHTML = metaHTML(q);
    stage.querySelector('#loc a:last-child').href = 'index.html?focus=' + q.id;
    try { history.replaceState(null, '', 'checklist.html?id=' + q.id); } catch (err) {}
  };
  let tick = false;
  const sync = () => {
    tick = false;
    const line = stage.getBoundingClientRect().bottom;
    const el = [...entries.children].find(e => { const r = e.getBoundingClientRect(); return r.top + r.height / 2 > line; });
    if (el && el.dataset.id !== cur) show(PROJECTS.find(q => String(q.id) === el.dataset.id));
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(sync); } }, { passive: true });

  // the image box has a fixed 8:5 shape, so the layout can be set right away
  setStage();
  align(entries.querySelector('.entry.on'), false);
  document.body.classList.add('ready');
  addEventListener('resize', () => { setStage(); align(entries.querySelector('.entry.on'), false); });
})();
