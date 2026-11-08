// Nav hover previews.
//   hover Map          : the map's land appears over the current page; roads and water are see-through
//   hover Checklist    : the Checklist page appears in place of the current content, starting at thesis 1
//   hover Details (map directory): that project's Checklist page
//   hover Information  : its text appears in place of the current content (no background images until you click in)
// Hover a number on the map: that project's archive image/video shows through the roads and water.
(() => {
  const body = document.body, root = document.documentElement;
  const cur = body.dataset.page; // map | checklist | info
  const TARGETS = { 'index.html': 'map', 'checklist.html': 'checklist', 'information.html': 'info' };
  const VIEW = { center: { lat: 40.7484, lng: -73.9857 }, zoom: 15 };

  const mk = id => {
    const d = document.createElement('div');
    d.id = id; d.className = 'pv';
    body.appendChild(d);
    return d;
  };
  const mediaEl = mk('pv-media'), maskEl = mk('pv-mask'), pinsEl = mk('pv-pins'), contentEl = mk('pv-content');
  maskEl.innerHTML = '<div class="pvmap"></div>';
  const all = [mediaEl, maskEl, pinsEl, contentEl];

  let token = 0, wantBg = false;
  const hide = () => {
    token++;
    all.forEach(e => e.classList.remove('on'));
    root.classList.remove('pvm');
    const v = mediaEl.querySelector('video'); if (v) v.pause();
    wantBg = false;
    body.classList.remove('pvnav');
    // the page background goes back to white after the fade
    setTimeout(() => { if (!wantBg) root.classList.remove('pvbg'); }, 280);
  };

  // mask map: land white, roads and water black. Created on first use, so no extra map load unless you hover.
  let mask = null;
  const ensureMask = () => {
    if (mask) return mask.ready;
    mask = {};
    mask.ready = loadGoogle().then(() => new Promise(res => {
      mask.map = new google.maps.Map(maskEl.firstChild, Object.assign({}, VIEW, {
        minZoom: 2, disableDefaultUI: true, gestureHandling: 'none', keyboardShortcuts: false,
        clickableIcons: false, backgroundColor: '#ffffff', styles: MASK_STYLE
      }));
      let done = false;
      const fin = () => { if (!done) { done = true; res(); } };
      google.maps.event.addListenerOnce(mask.map, 'tilesloaded', fin);
      setTimeout(fin, 2500);
    }));
    return mask.ready;
  };
  const syncView = () => { // on the map page, match the map you are looking at
    const main = window.mainMap;
    if (mask && mask.map && main) { mask.map.setCenter(main.getCenter()); mask.map.setZoom(main.getZoom()); }
  };
  // numbers are copied into a layer above the mask, at the same screen positions
  const snapshotPins = () => {
    pinsEl.innerHTML = '';
    const main = window.mainMap, proj = main && main.getProjection(), b = main && main.getBounds();
    if (!proj || !b) return;
    const ne = b.getNorthEast(), sw = b.getSouthWest();
    const tl = proj.fromLatLngToPoint(new google.maps.LatLng(ne.lat(), sw.lng()));
    const scale = Math.pow(2, main.getZoom());
    PROJECTS.filter(p => p.lat != null && p.lng != null).forEach(p => {
      const pt = proj.fromLatLngToPoint(new google.maps.LatLng(Number(p.lat), Number(p.lng)));
      const d = document.createElement('div');
      d.className = 'pin';
      d.style.cssText = `position:absolute;left:${(pt.x - tl.x) * scale}px;top:${(pt.y - tl.y) * scale}px`;
      d.innerHTML = `<a>${p.id}</a>`;
      pinsEl.appendChild(d);
    });
  };

  // Information page text (just its text, not the cycling background)
  let infoHTML = null;
  const info = () => infoHTML || (infoHTML = fetch('information.html').then(r => r.text()).then(src => {
    const m = new DOMParser().parseFromString(src, 'text/html').querySelector('main');
    return m ? m.outerHTML : '';
  }).catch(() => ''));

  // Checklist page for one project, with its thesis right under the image (like the real page)
  const renderChecklist = p => {
    contentEl.scrollTop = 0;
    contentEl.innerHTML = textMarkup(p);
    const stage = contentEl.querySelector('#stage'), list = contentEl.querySelector('#list');
    const last = list.querySelector('.entry:last-child');
    list.style.setProperty('--stage-h', stage.offsetHeight + 'px');
    list.style.setProperty('--pad-b', Math.max(innerHeight - stage.offsetHeight - last.offsetHeight - parseFloat(getComputedStyle(last).marginBottom), 0) + 1 + 'px');
    const on = list.querySelector('.entry.on');
    contentEl.scrollTop = on.getBoundingClientRect().top - stage.getBoundingClientRect().bottom;
    contentEl.classList.add('on');
  };
  const showChecklist = p => { hide(); renderChecklist(p); }; // hover "More Information" in the map directory

  const show = t => {
    hide();
    const my = token, ok = () => my === token;
    if (t === cur) return;
    body.classList.add('pvnav'); // hides the map directory while another page is previewed
    if (t === 'map') {
      ensureMask().then(() => { if (ok()) { syncView(); maskEl.classList.add('on'); } }).catch(() => { });
    } else if (t === 'checklist') {
      renderChecklist(PROJECTS[0]);
    } else if (t === 'info') {
      info().then(html => {
        if (!ok() || !html) return;
        contentEl.innerHTML = html;
        contentEl.classList.add('on');
      });
    }
  };

  // hover a number on the map: that project's archive image or video shows through the roads and water
  const loadMedia = src => new Promise((res, rej) => {
    const el = document.createElement(isVideo(src) ? 'video' : 'img');
    if (isVideo(src)) { el.muted = true; el.loop = true; el.autoplay = true; el.playsInline = true; el.onloadeddata = () => res(el); }
    else el.onload = () => res(el);
    el.onerror = rej;
    el.src = src;
  });
  const showMedia = src => {
    hide();
    const my = token;
    Promise.all([ensureMask(), loadMedia(src)]).then(([, el]) => {
      if (my !== token) return;
      syncView(); snapshotPins();
      mediaEl.innerHTML = ''; mediaEl.appendChild(el);
      if (el.play) el.play().catch(() => { });
      wantBg = true; root.classList.add('pvbg', 'pvm');
      mediaEl.classList.add('on'); maskEl.classList.add('on'); pinsEl.classList.add('on');
    }).catch(() => { }); // no file for this project: nothing happens
  };

  document.querySelectorAll('#nav a').forEach(a => {
    const t = TARGETS[a.getAttribute('href')];
    if (!t) return;
    a.addEventListener('mouseenter', () => show(t));
    a.addEventListener('mouseleave', hide);
  });
  addEventListener('pageshow', hide);

  // the map page loads the mask ahead of time and keeps it in step with the map, so the hover is instant
  window.PV = { warmMask: () => ensureMask().catch(() => { }), sync: syncView, showMedia, showChecklist, hide };
})();
