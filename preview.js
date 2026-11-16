// Hover preview: hover "View" in the map directory and that project's image appears over the map.
(() => {
  const el = document.createElement('div');
  el.id = 'pv-content'; el.className = 'pv';
  document.body.appendChild(el);

  const hide = () => el.classList.remove('on');
  const show = p => { // just the image, in the same spot it has on the Checklist page
    el.innerHTML = `<div id="stage"><div class="inner"><p id="loc" style="visibility:hidden">&nbsp;</p><div id="hero">${mediaHTML(archiveSrc(p), `onerror="this.style.display='none'"`)}</div></div></div>`;
    el.classList.add('on');
  };
  addEventListener('pageshow', hide);

  window.PV = { showChecklist: show, hide };
})();
