// Shared by every page: media helpers, Google Maps loader, map style, directory markup.

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// The image or video for a project: its `archive` in data.js, else images/archive/<id>.jpg
const archiveSrc = p => p.archive || `images/archive/${p.id}.jpg`;
const mediaHTML = p => {
  const src = archiveSrc(p), hide = `onerror="this.style.display='none'"`;
  return /\.(mp4|webm|mov|m4v)$/i.test(src)
    ? `<video src="${src}" autoplay muted loop playsinline ${hide}></video>`
    : `<img src="${src}" alt="" ${hide}>`;
};

const visitUrl = p => `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;

// Loads the Google Maps script (key in config.js).
const loadGoogle = () => new Promise((resolve, reject) => {
  if (window.google && google.maps && google.maps.Map) return resolve();
  window.__gmReady = resolve;
  const s = document.createElement('script');
  s.async = true; s.onerror = reject;
  s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(GOOGLE_MAPS_KEY) + '&loading=async&callback=__gmReady';
  document.head.appendChild(s);
});

// Map style: no labels, gray roads and water. Labels come back by zoom:
// zoomed out (<= AREA_MAX) neighborhood names, zoomed in (>= STREET_MIN) street names, in between none.
const AREA_MAX = 14, STREET_MIN = 15;
const labelBand = z => z >= STREET_MIN ? 'street' : z <= AREA_MAX ? 'area' : 'none';
const MAP_STYLE = [
  { elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { stylers: [{ saturation: -100 }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e0e0e0' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e0e0e0' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] }
];
const labelInk = f => [
  { featureType: f, elementType: 'labels.text', stylers: [{ visibility: 'on' }] },
  { featureType: f, elementType: 'labels.text.fill', stylers: [{ color: '#E0E0E0' }] },
  { featureType: f, elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }, { weight: 3 }] }
];
const mapStyle = band => band === 'area'
  ? MAP_STYLE.concat(labelInk('administrative'), [{ featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{ visibility: 'off' }] }])
  : band === 'street'
    ? MAP_STYLE.concat(labelInk('road'), [{ featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] }])
    : MAP_STYLE;

// Map page directory: number + title, then View (its Index page) and Directions (Google Maps).
const buildDir = el => {
  el.innerHTML = PROJECTS.map(p =>
    `<div class="dir-item" data-id="${p.id}">` +
    `<a class="dir-title" href="index.html?focus=${p.id}"><span>${p.id}</span><span>${esc(p.title)}</span></a>` +
    `<div class="dir-sub"><a class="dir-info" href="checklist.html?id=${p.id}">View</a>, <a href="${visitUrl(p)}" target="_blank" rel="noopener">Directions</a></div></div>`
  ).join('');
};
