// Map page: the directory (first column) and Google Maps with numbered pins.
// index.html?focus=3 opens zoomed in on number 3; otherwise the map fits every number.
const dir = document.getElementById('dir');
const byId = id => PROJECTS.find(p => String(p.id) === String(id));
let map;
const phone = matchMedia('(max-width: 800px)'); // same width as the phone rules in style.css
const pos = p => ({ lat: p.lat, lng: p.lng }); // plain lat/lng, the only shape Google Maps is given
buildDir(dir);

// A number on the map and its directory entry share two states (the entry goes from gray to black):
// hot = hovered on either side, on = selected (click a number or a title; click empty map to deselect)
let selected = null;
const itemOf = id => dir.querySelector(`.dir-item[data-id="${id}"]`);
const flag = (id, cls, on) => itemOf(id).classList.toggle(cls, on);
const select = id => {
  if (selected != null) flag(selected, 'on', false);
  selected = id;
  if (id != null) { flag(id, 'on', true); itemOf(id).scrollIntoView({ block: 'nearest' }); }
};
const zoomTo = p => {
  select(p.id);
  if (map) { map.setZoom(17); map.panTo(pos(p)); }
};

dir.addEventListener('mouseover', e => { const it = e.target.closest('.dir-item'); if (it) flag(it.dataset.id, 'hot', true); });
dir.addEventListener('mouseout', e => { const it = e.target.closest('.dir-item'); if (it) flag(it.dataset.id, 'hot', false); });
dir.addEventListener('click', e => {
  const a = e.target.closest('.dir-title');
  if (!a || !map) return; // map not loaded yet: the link reloads the page zoomed in
  e.preventDefault();
  zoomTo(byId(a.parentNode.dataset.id));
});

// Hover "View": that project's image appears over the map, where it sits on the Index page.
const preview = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'preview' }));
dir.addEventListener('mouseover', e => {
  if (!e.target.closest('.dir-info')) return;
  preview.innerHTML = `<div id="stage"><div class="inner"><div id="hero">${mediaHTML(byId(e.target.closest('.dir-item').dataset.id))}</div></div></div>`;
  preview.classList.add('on');
});
dir.addEventListener('mouseout', e => { if (e.target.closest('.dir-info')) preview.classList.remove('on'); });
addEventListener('pageshow', () => preview.classList.remove('on'));

loadGoogle().then(() => {
  map = new google.maps.Map(document.getElementById('gmap'), {
    center: { lat: 40.7484, lng: -73.9857 }, zoom: 15, minZoom: 2,
    disableDefaultUI: true, gestureHandling: 'greedy', clickableIcons: false,
    styles: mapStyle(labelBand(15))
  });

  // labels change with zoom (see labelBand in shared.js)
  let band = labelBand(15);
  map.addListener('zoom_changed', () => {
    const b = labelBand(map.getZoom());
    if (b !== band) { band = b; map.setOptions({ styles: mapStyle(b) }); }
  });

  // Numbers: white on a black circle. Click one to zoom to it (on a phone it opens that Index page).
  class Pin extends google.maps.OverlayView {
    constructor(p) {
      super();
      this.pos = new google.maps.LatLng(p.lat, p.lng);
      this.el = document.createElement('div');
      this.el.className = 'pin';
      this.el.style.position = 'absolute';
      this.el.innerHTML = `<a href="checklist.html?id=${p.id}">${p.id}</a>`;
      this.el.addEventListener('mouseenter', () => flag(p.id, 'hot', true));
      this.el.addEventListener('mouseleave', () => flag(p.id, 'hot', false));
      // computer: zoom to it. phone: the link opens its Index page
      this.el.addEventListener('click', e => { if (!phone.matches) { e.preventDefault(); zoomTo(p); } });
      google.maps.OverlayView.preventMapHitsFrom(this.el); // a click on a number is not a click on the map
    }
    onAdd() { this.getPanes().overlayMouseTarget.appendChild(this.el); }
    draw() {
      const pt = this.getProjection().fromLatLngToDivPixel(this.pos);
      this.el.style.left = pt.x + 'px'; this.el.style.top = pt.y + 'px';
    }
    onRemove() { this.el.remove(); }
  }
  PROJECTS.filter(placed).forEach(p => new Pin(p).setMap(map));

  const focus = byId(new URLSearchParams(location.search).get('focus'));
  if (focus) {
    map.setCenter(pos(focus));
    map.setZoom(17);
    select(focus.id);
  } else { // start zoomed out just far enough to show every number
    // fit every placed number in view. Redone if the map box changes size before anyone touches the map
    // (the box can still be changing size right as the page loads, which leaves the fit off-center)
    let touched = false;
    const fit = () => {
      const here = PROJECTS.filter(placed);
      if (here.length < 2) { // 0 or 1 numbers: nothing to fit, so use a fixed view
        map.setCenter(here.length ? pos(here[0]) : map.getCenter());
        map.setZoom(15);
        return;
      }
      const all = new google.maps.LatLngBounds();
      here.forEach(p => all.extend(pos(p)));
      map.fitBounds(all, 48); // 48px of room so no circle touches the edge
      google.maps.event.addListenerOnce(map, 'idle', () => { if (!touched && map.getZoom() > 16) map.setZoom(16); }); // tight cluster: don't zoom to rooftops
    };
    fit();
    ['pointerdown', 'wheel', 'keydown'].forEach(t => document.getElementById('gmap').addEventListener(t, () => { touched = true; }, { passive: true }));
    new ResizeObserver(() => { if (!touched) fit(); }).observe(document.getElementById('gmap'));
  }
  map.addListener('click', () => select(null)); // click empty map: deselect

  // the directory lists only the numbers on screen right now
  let queued = false;
  const filterDir = () => {
    queued = false;
    const bounds = map.getBounds();
    if (bounds) dir.querySelectorAll('.dir-item').forEach(el => { el.hidden = !bounds.contains(pos(byId(el.dataset.id))); });
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(filterDir); } };
  map.addListener('bounds_changed', queue);
  map.addListener('idle', queue);
}).catch(e => console.error('Google Maps failed to load. Check the key in config.js.', e));
