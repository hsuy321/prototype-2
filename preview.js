// Nav hover previews.
//   hover Map          : the map's land appears over the current page; roads and water are see-through
//   hover Text         : the Text page appears in place of the current content, starting at thesis 1
//   hover Information  : its text appears in place of the current content (no background images until you click in)
// Hover a number on the map: that project's archive image/video shows through the roads and water.
(() => {
  const body = document.body, root = document.documentElement;
  const cur = body.dataset.page; // map | text | info
  const TARGETS = { 'index.html': 'map', 'text.html': 'text', 'information.html': 'info' };
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

  const show = t => {
    hide();
    const my = token, ok = () => my === token;
    if (t === cur) return;
    if (t === 'map') {
      ensureMask().then(() => { if (ok()) { syncView(); maskEl.classList.add('on'); } }).catch(() => { });
    } else if (t === 'text') {
      contentEl.innerHTML = textMarkup(PROJECTS[0]);
      const stage = contentEl.querySelector('#stage');
      contentEl.querySelector('#list').style.setProperty('--stage-h', stage.offsetHeight + 'px'); // thesis 1 right under the image
      contentEl.classList.add('on');
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
  window.PV = { warmMask: () => ensureMask().catch(() => { }), sync: syncView, showMedia, hide };
})();
