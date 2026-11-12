// Map (landing page): directory in the first column + Google Maps with numbered pins.
// index.html?focus=2 zooms to number 2.

// Directory (markup in shared.js): Details = its Checklist page (hover previews it), Visit = Google Maps.
// Only the places on screen right now are listed (see filterDir below).
const dir = document.getElementById('dir');
const byId = id => PROJECTS.find(p => String(p.id) === String(id));
buildDir(dir);
// Two states link a number on the map with its directory entry (both go black, otherwise gray):
//   hot = hovered on either side, on = selected (click a number or a title; click empty map to deselect)
const pinEls = {}; // id -> the number's <a>, filled in below
let selected = null;
const itemOf = id => dir.querySelector(`.dir-item[data-id="${id}"]`);
const flag = (id, cls, on) => {
  if (pinEls[id]) pinEls[id].classList.toggle(cls, on);
  const it = itemOf(id);
  if (it) it.classList.toggle(cls, on);
};
const select = id => {
  if (selected != null) flag(selected, 'on', false);
  selected = id;
  if (id != null) { flag(id, 'on', true); const it = itemOf(id); if (it) it.scrollIntoView({ block: 'nearest' }); }
};
// click a number on the map or a title here: select it and zoom to it
const zoomTo = p => {
  select(p.id);
  if (window.mainMap) { mainMap.setZoom(17); mainMap.panTo({ lat: Number(p.lat), lng: Number(p.lng) }); }
};
dir.addEventListener('mouseover', e => {
  const it = e.target.closest('.dir-item'), from = e.relatedTarget;
  if (it && !(from && from.closest && from.closest('.dir-item') === it)) flag(it.dataset.id, 'hot', true);
});
dir.addEventListener('mouseout', e => {
  const it = e.target.closest('.dir-item'), to = e.relatedTarget;
  if (it && !(to && to.closest && to.closest('.dir-item') === it)) flag(it.dataset.id, 'hot', false);
});
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
  window.mainMap = map;

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
      pinEls[p.id] = this.el.firstChild;
      this.el.addEventListener('mouseenter', () => flag(p.id, 'hot', true));
      this.el.addEventListener('mouseleave', () => flag(p.id, 'hot', false));
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
  if (p && p.lat != null) { map.setCenter({ lat: Number(p.lat), lng: Number(p.lng) }); map.setZoom(17); select(p.id); }
  map.addListener('click', () => select(null)); // click empty map: deselect

  // the directory lists only the numbers on screen right now
  let queued = false;
  const filterDir = () => {
    queued = false;
    const b = map.getBounds();
    if (b) dir.querySelectorAll('.dir-item').forEach(el => { const p = byId(el.dataset.id); el.hidden = !b.contains({ lat: Number(p.lat), lng: Number(p.lng) }); });
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(filterDir); } };
  map.addListener('bounds_changed', queue);
  map.addListener('idle', queue);

}).catch(e => console.error('Google Maps failed to load. Check the key in config.js.', e));
