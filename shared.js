// Shared by every page: image folder, Google Maps loader, map styles, Text page markup.

// Folder with the 34 images/videos for the Text page and the map hover: images/archive/1.jpg ... 34.jpg
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
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#9a9a9a' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] }
];

// Hover preview mask: land is white, roads and water are black.
// Blended over the page (screen), whatever is behind shows through the roads and water only.
window.MASK_STYLE = [
  { elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] }
];

// Text page markup (also used by the Text hover preview): fixed location + image, then the 34 theses.
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
window.attachText = () => {
  if (PROJECTS._text) return;
  PROJECTS._text = true;
  const E = SPECTACLE_TEXT.trim().split(/\n\s*\n/).map(s => s.replace(/\s*\n\s*/g, ' ').trim());
  PROJECTS.forEach((p, i) => { p.text = E[i] || ''; });
};
window.textMarkup = p => {
  attachText();
  const loc = `${p.location ? p.location + ' ' : ''}(<a href="index.html?focus=${p.id}">Map</a>)`; const entries = PROJECTS.map(q =>
    `<a class="entry${q.id === p.id ? ' on' : ''}" href="text.html?id=${q.id}" data-id="${q.id}"><span>${q.id}</span><p>${q.text}</p></a>`).join('');
  return `<div id="stage"><div class="inner"><p id="loc">${loc}</p>` +
    `<div id="hero" title="${p.meta.map(esc).join('&#10;')}">${mediaHTML(archiveSrc(p), `onerror="this.style.display='none'"`)}</div></div></div>` +
    `<main id="list"><div class="content" id="entries">${entries}</div></main>`;
};
