// Map (landing page): directory in the first column + Google Maps with numbered pins.
// index.html?focus=2 zooms to number 2.

// Directory: number + title. Click the title to zoom to its number, hover it to preview the archive image
// (same as hovering the number). Details = its Checklist entry (hover previews it), Visit = Google Maps.
// Only projects that have lat/lng in data.js are listed.
const dir = document.getElementById('dir');
const byId = id => PROJECTS.find(p => String(p.id) === String(id));
dir.innerHTML = PROJECTS.filter(p => p.lat != null && p.lng != null).map(p => {
  const title = p.title || (p.meta && p.meta[1]) || '';
  const visit = p.maps || `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`; // p.maps in data.js overrides
  return `<div class="dir-item" data-id="${p.id}">` +
    `<a class="dir-title" href="index.html?focus=${p.id}"><span>${p.id}</span><span>${esc(title)}</span></a>` +
    `<div class="dir-sub"><a class="dir-info" href="checklist.html?id=${p.id}">Details</a>, <a href="${visit}" target="_blank" rel="noopener">Visit</a></div></div>`;
}).join('');
const toggle = document.getElementById('dir-toggle'); // Hide directory / Show directory (open by default)
toggle.addEventListener('click', e => {
  e.preventDefault();
  const off = document.body.classList.toggle('dir-off');
  toggle.textContent = off ? 'Show directory' : 'Hide directory';
  if (window.PV) PV.hide();
});
const dirTitle = e => { const a = e.target.closest('.dir-title'); return a && byId(a.parentNode.dataset.id); };
dir.addEventListener('click', e => {
  const p = dirTitle(e);
  if (!p || !window.mainMap) return; // map not loaded yet: the link reloads the page zoomed in
  e.preventDefault();
  if (window.PV) PV.hide();
  mainMap.setZoom(17);
  mainMap.panTo({ lat: Number(p.lat), lng: Number(p.lng) });
});
// hover the title: archive image behind the map. hover Details: its Checklist page.
const SEL = '.dir-title, .dir-info';
dir.addEventListener('mouseover', e => {
  const a = e.target.closest(SEL), from = e.relatedTarget;
  if (!a || !window.PV || (from && from.closest && from.closest(SEL) === a)) return;
  const p = byId(a.closest('.dir-item').dataset.id);
  if (a.classList.contains('dir-info')) PV.showChecklist(p); else PV.showMedia(archiveSrc(p));
});
dir.addEventListener('mouseout', e => {
  const a = e.target.closest(SEL), to = e.relatedTarget;
  if (!a || !window.PV || (to && to.closest && to.closest(SEL) === a)) return;
  PV.hide();
});

loadGoogle().then(() => {
  const map = new google.maps.Map(document.getElementById('gmap'), {
    center: { lat: 40.7484, lng: -73.9857 }, zoom: 15, minZoom: 2,
    disableDefaultUI: true, gestureHandling: 'greedy', clickableIcons: false,
    styles: MAP_STYLE
  });
  window.mainMap = map; // the hover previews follow this view

  // Numbered pins as plain HTML so they can use the site type and the white outline.
  // Hover a number: its archive image/video shows through the roads and water.
  class Pin extends google.maps.OverlayView {
    constructor(p) {
      super();
      this.pos = new google.maps.LatLng(Number(p.lat), Number(p.lng));
      this.el = document.createElement('div');
      this.el.className = 'pin';
      this.el.style.position = 'absolute';
      this.el.innerHTML = `<a href="checklist.html?id=${p.id}">${p.id}</a>`;
      this.el.addEventListener('mouseenter', () => window.PV && PV.showMedia(archiveSrc(p)));
      this.el.addEventListener('mouseleave', () => window.PV && PV.hide());
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

  google.maps.event.addListenerOnce(map, 'idle', () => { if (window.PV) PV.warmMask(); });
  map.addListener('idle', () => { if (window.PV) PV.sync(); }); // keeps the hover mask loaded where you are
}).catch(e => console.error('Google Maps failed to load. Check the key in config.js.', e));
