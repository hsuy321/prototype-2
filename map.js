// Map (landing page): Google Maps + numbered pins. index.html?focus=2 zooms to number 2.
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
      this.el.innerHTML = `<a href="text.html?id=${p.id}">${p.id}</a>`;
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
