// Map (landing page): directory in the first column + Google Maps with numbered pins.
// index.html?focus=2 zooms to number 2.

// Directory: number + title. Details = its Checklist entry (hover previews it), Visit = Google Maps.
// Only projects that have lat/lng in data.js are listed, and only the ones on screen right now (see filterDir below).
const dir = document.getElementById('dir');
const byId = id => PROJECTS.find(p => String(p.id) === String(id));
dir.innerHTML = PROJECTS.filter(p => p.lat != null && p.lng != null).map(p => {
  const title = p.title || (p.meta && p.meta[1]) || '';
  const visit = p.maps || `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`; // p.maps in data.js overrides
  return `<div class="dir-item" data-id="${p.id}">` +
    `<a class="dir-title" href="index.html?focus=${p.id}"><span>${p.id}</span><span>${esc(title)}</span></a>` +
    `<div class="dir-sub"><a class="dir-info" href="checklist.html?id=${p.id}">Details</a>, <a href="${visit}" target="_blank" rel="noopener">Visit</a></div></div>`;
}).join('');
// click a number on the map or a title here: the map zooms to it
const zoomTo = p => {
  if (window.mainMap) { mainMap.setZoom(17); mainMap.panTo({ lat: Number(p.lat), lng: Number(p.lng) }); }
};
dir.addEventListener('click', e => {
  const a = e.target.closest('.dir-title');
  if (!a || !window.mainMap) return; // map not loaded yet: the link reloads the page zoomed in
  e.preventDefault();
  zoomTo(byId(a.parentNode.dataset.id));
});
// hover Details: that project's Checklist page appears
dir.addEventListener('mouseover', e => {
  const a = e.target.closest('.dir-info'), from = e.relatedTarget;
  if (!a || !window.PV || (from && from.closest && from.closest('.dir-info') === a)) return;
  PV.showChecklist(byId(a.closest('.dir-item').dataset.id));
});
dir.addEventListener('mouseout', e => {
  const a = e.target.closest('.dir-info'), to = e.relatedTarget;
  if (!a || !window.PV || (to && to.closest && to.closest('.dir-info') === a)) return;
  PV.hide();
});


loadGoogle().then(() => {
  const map = new google.maps.Map(document.getElementById('gmap'), {
    center: { lat: 40.7484, lng: -73.9857 }, zoom: 15, minZoom: 2,
    disableDefaultUI: true, gestureHandling: 'greedy', clickableIcons: false,
    styles: mapStyle(labelBand(15))
  });
  window.mainMap = map; // the hover previews follow this view

  // labels change with zoom (see labelBand in shared.js)
  let band = labelBand(15);
  map.addListener('zoom_changed', () => {
    const b = labelBand(map.getZoom());
    if (b !== band) { band = b; map.setOptions({ styles: mapStyle(b) }); }
  });

  // Numbers as plain HTML (white number on a black circle). Click one to zoom to it.
  class Pin extends google.maps.OverlayView {
    constructor(p) {
      super();
      this.pos = new google.maps.LatLng(Number(p.lat), Number(p.lng));
      this.el = document.createElement('div');
      this.el.className = 'pin';
      this.el.style.position = 'absolute';
      this.el.innerHTML = `<a href="#">${p.id}</a>`;
      google.maps.OverlayView.preventMapHitsFrom(this.el); // a click on a number is not a click on the map
      this.el.addEventListener('click', e => { e.preventDefault(); zoomTo(p); });
    }
    onAdd() { this.getPanes().overlayMouseTarget.appendChild(this.el); }
    draw() {
      const pt = this.getProjection().fromLatLngToDivPixel(this.pos);
      this.el.style.left = pt.x + 'px'; this.el.style.top = pt.y + 'px';
    }
    onRemove() { this.el.remove(); }
  }
  PROJECTS.filter(p => p.lat != null && p.lng != null).forEach(p => {
    try { new Pin(p).setMap(map); }
    catch (e) { console.warn('Pin failed for project', p.id, p, e); }
  });

  const focus = new URLSearchParams(location.search).get('focus');
  const p = PROJECTS.find(p => String(p.id) === focus);
  if (p && p.lat != null) { map.setCenter({ lat: Number(p.lat), lng: Number(p.lng) }); map.setZoom(17); }

  // the directory lists only the numbers on screen right now
  const items = [...dir.querySelectorAll('.dir-item')].map(el => ({ el, pos: { lat: Number(byId(el.dataset.id).lat), lng: Number(byId(el.dataset.id).lng) } }));
  let queued = false;
  const filterDir = () => {
    queued = false;
    const b = map.getBounds();
    if (b) items.forEach(({ el, pos }) => { el.hidden = !b.contains(pos); });
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(filterDir); } };
  map.addListener('bounds_changed', queue);
  map.addListener('idle', queue);

  google.maps.event.addListenerOnce(map, () => { if (window.PV) PV.warmMask(); });
  map.addListener('idle', () => { if (window.PV) PV.sync(); }); // keeps the nav hover mask loaded where you are
}).catch(e => console.error('Google Maps failed to load. Check the key in config.js.', e));
