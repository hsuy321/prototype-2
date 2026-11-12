// Hover preview: hover "Details" in the map directory and that project's Checklist page appears over the map.
(() => {
  const el = document.createElement('div');
  el.id = 'pv-content'; el.className = 'pv';
  document.body.appendChild(el);

  const hide = () => el.classList.remove('on');
  const show = p => { // the project's thesis sits right under the image, like the real page
    el.scrollTop = 0;
    el.innerHTML = textMarkup(p);
    const stage = el.querySelector('#stage'), list = el.querySelector('#list');
    const last = list.querySelector('.entry:last-child');
    list.style.setProperty('--stage-h', stage.offsetHeight + 'px');
    list.style.setProperty('--pad-b', Math.max(innerHeight - stage.offsetHeight - last.offsetHeight - parseFloat(getComputedStyle(last).marginBottom), 0) + 1 + 'px');
    el.scrollTop = list.querySelector('.entry.on').getBoundingClientRect().top - stage.getBoundingClientRect().bottom;
    el.classList.add('on');
  };
  addEventListener('pageshow', hide);

  window.PV = { showChecklist: show, hide };
})();
