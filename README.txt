Pages
  index.html        Map (landing page). index.html?focus=3 zooms to number 3
  text.html         Text: location + image fixed, 34 theses scroll behind. text.html?id=3
  information.html  Information: text and citations, images cycling in the background

Files you edit
  config.js    Google Maps key
  data.js      the 34 projects: lat/lng, metadata, location
  text.js      the 34 theses (python3 build-text.py fills it in)
  style.css    :root at the top: type size, margins, gutters, --tab, --gray
  info.js      top of the file: image folder, count, hold and fade times

Images
  images/archive/      1.jpg ... 34.jpg (or .mp4): Text page and the map hover
  images/information/  01.jpg ... 34.jpg: Information page background
  The archive folder name is set once at the top of shared.js (ARCHIVE_DIR).

Other
  shared.js, preview.js, map.js, text-page.js: the code. Hover previews live in preview.js.
Run a local server:  python3 -m http.server 8000
