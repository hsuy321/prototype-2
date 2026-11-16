Pages
  index.html        Map with the directory in the first column. index.html?focus=3 opens zoomed in on number 3
  checklist.html    Index: image fixed at the top, titles scroll behind it. checklist.html?id=3
  information.html  Information: text, footnotes and one photo (images/information/1.jpg)

Files you edit
  config.js    Google Maps key
  data.js      the projects: number, lat/lng, title, image or video
  style.css    :root at the top: font, type size, margins, tab, circle size
  images/archive/  <id>.jpg (or the file named in data.js)

Code
  shared.js    helpers, Google Maps loader, map style, directory markup
  map.js       map page: pins, directory, hover preview
  checklist.js index page: scroll to switch

Run a local server:  python3 -m http.server 8000
