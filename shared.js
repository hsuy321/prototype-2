// Shared by every page: image folder, Google Maps loader, map styles, Checklist page markup.

// Folder with the images/videos for the Checklist page and the map hover: images/archive/1.jpg ... 30.jpg
// To use another folder name, change it here. For one project with a video or another file name,
// add  archive: "images/archive/3.mp4"  to that project in data.js
window.ARCHIVE_DIR = 'images/archive/';
window.archiveSrc = p => p.archive || `${ARCHIVE_DIR}${p.id}.jpg`;
window.isVideo = s => /\.(mp4|webm|mov|m4v)$/i.test(s);
window.mediaHTML = (src, attrs = '') => isVideo(src)
  ? `<video src="${src}" autoplay muted loop playsinline ${attrs}></video>`
  : `<img src="${src}" alt="" ${attrs}>`;

// Loads the Google Maps script once (only when something needs the map).
window.loadGoogle = () => {
  if (window.google && google.maps && google.maps.Map) return Promise.resolve();
  if (window.__gm) return window.__gm;
  window.__gm = new Promise((res, rej) => {
    window.__gmReady = res;
    const s = document.createElement('script');
    s.async = true; s.onerror = rej;
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(GOOGLE_MAPS_KEY) + '&loading=async&callback=__gmReady';
    document.head.appendChild(s);
  });
  return window.__gm;
};

// The map you see
window.MAP_STYLE = [
  { elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { stylers: [{ saturation: -100 }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e0e0e0' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e0e0e0' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] }
];

// Map labels depend on zoom. Zoomed out (<= AREA_MAX): borough / neighborhood names.
// Zoomed in (>= STREET_MIN): street names and numbers. In between: no labels. Change the two numbers to taste.
window.AREA_MAX = 14;
window.STREET_MIN = 15;
window.labelBand = z => z >= STREET_MIN ? 'street' : z <= AREA_MAX ? 'area' : 'none';
const labelInk = f => [
  { featureType: f, elementType: 'labels.text', stylers: [{ visibility: 'on' }] },
  { featureType: f, elementType: 'labels.text.fill', stylers: [{ color: '#E0E0E0' }] },
  { featureType: f, elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }, { weight: 3 }] }
];
window.mapStyle = band => band === 'area'
  ? MAP_STYLE.concat(labelInk('administrative'), [{ featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{ visibility: 'off' }] }])
  : band === 'street'
    ? MAP_STYLE.concat(labelInk('road'), [{ featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] }])
    : MAP_STYLE;

// Directory (first column of the map page, also shown when you hover Map on the other pages):
// number + title, then Details (its Checklist page) and Visit (Google Maps). Only projects with lat/lng are listed.
// p.maps in data.js overrides the Visit link.
window.buildDir = el => {
  el.innerHTML = PROJECTS.filter(p => p.lat != null && p.lng != null).map(p => {
    const title = p.title || (p.meta && p.meta[1]) || '';
    const visit = p.maps || `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
    return `<div class="dir-item" data-id="${p.id}">` +
      `<a class="dir-title" href="index.html?focus=${p.id}"><span>${p.id}</span><span>${esc(title)}</span></a>` +
      `<div class="dir-sub"><a class="dir-info" href="checklist.html?id=${p.id}">Details</a>, <a href="${visit}" target="_blank" rel="noopener">Visit</a></div></div>`;
  }).join('');
};

// Checklist page markup (also used by the Details hover preview). The details list meta in order: #number first, then the rest.: fixed location + image, then the 30 titles.
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// details: everything except the title (the title is the list entry itself)
window.metaHTML = p => p.meta.filter((m, i) => i !== 1).map((m, i) => {
  const n = String(m).match(/^#(\d+)$/); // the #number links to its Adobe Stock page
  return i === 0 && n ? `<p><a href="https://stock.adobe.com/images/id/${n[1]}" target="_blank" rel="noopener">${esc(m)}</a></p>` : `<p>${esc(m)}</p>`;
}).join('');
// open = details panel shown (default). Used by the page and by the hover previews.
window.textMarkup = (p, open = true) => {
  const entries = PROJECTS.map(q =>
    `<div class="entry${q.id === p.id ? ' on' : ''}" data-id="${q.id}"><span>${q.id}</span><p>${esc(q.meta[1])}</p></div>`).join('');
  return `<div id="stage"${open ? ' class="open"' : ''}><div class="inner"><p id="loc"><a id="meta-btn" href="#">${open ? 'Hide' : 'Show'} details</a>, <a href="index.html?focus=${p.id}">View on map</a></p>` +
    `<div id="hero">${mediaHTML(archiveSrc(p), `onerror="this.style.display='none'"`)}</div>` +
    `<div id="meta">${metaHTML(p)}</div></div></div>` +
    `<main id="list"><div class="content" id="entries">${entries}</div></main>`;
};
