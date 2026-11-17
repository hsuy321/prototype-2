// Print button on the Index page: makes a two-page 17 x 11 in (landscape) PDF for the title that is showing.
// Page 1: the stock photo, filling the margin box exactly (cropped to fit, so all four margins are 0.5 in). Page 2: the title, Arial 90pt on 100pt leading, centered in the margin box.
// (jsPDF's built-in Helvetica is the PDF standard stand-in for Arial; same letter widths.)
const PRINT = {
  photo: 'images/information/1.jpg', // the stock photo, the same for every title (not the videos)
  width: 17, height: 11,             // inches, landscape
  margin: 0.5,                       // inches, all sides
  size: 90, leading: 100             // points
};

$('print').addEventListener('click', async e => {
  e.preventDefault();
  const tab = window.open('', '_blank'); // opened right now, while the click still counts, and filled in when the PDF is ready
  try {
    const p = PROJECTS.find(q => String(q.id) === current);
    const pt = 72, W = PRINT.width * pt, H = PRINT.height * pt, m = PRINT.margin * pt, bw = W - 2 * m, bh = H - 2 * m;
    const doc = new window.jspdf.jsPDF({ unit: 'pt', format: [W, H], orientation: 'landscape' });

    // page 1: the photo as it is (no re-compression), scaled to cover the whole margin box and cropped to it
    const res = await fetch(PRINT.photo);
    if (!res.ok) throw new Error(PRINT.photo + ' not found');
    const bytes = new Uint8Array(await res.arrayBuffer());
    const { width, height } = doc.getImageProperties(bytes);
    const s = Math.max(bw / width, bh / height);
    doc.saveGraphicsState();
    doc.rect(m, m, bw, bh, null);
    doc.clip();
    doc.discardPath();
    doc.addImage(bytes, bytes[0] === 0x89 ? 'PNG' : 'JPEG', m + (bw - width * s) / 2, m + (bh - height * s) / 2, width * s, height * s);
    doc.restoreGraphicsState();

    // page 2: the title, every line centered, the block centered top to bottom inside the margin.
    // 90pt on 100pt leading; only if it would not fit inside the margin at that size does it shrink (same ratio) until it does.
    doc.addPage([W, H], 'landscape');
    doc.setFont('helvetica', 'normal');
    const cap = 0.716, desc = 0.212; // Helvetica cap height and descender, in em
    let size = PRINT.size, lines;
    for (; ; size--) {
      doc.setFontSize(size);
      lines = doc.splitTextToSize(p.title, bw);
      const wide = Math.max(...lines.map(l => doc.getTextWidth(l)));
      const tall = (lines.length - 1) * size * PRINT.leading / PRINT.size + size * (cap + desc);
      if ((wide <= bw && tall <= bh) || size <= 8) break;
    }
    // the block runs from the cap height of the first line to the baseline of the last, so it looks centered (descenders hang below)
    const lead = size * PRINT.leading / PRINT.size, block = (lines.length - 1) * lead + size * cap;
    lines.forEach((line, i) => doc.text(line, W / 2, m + (bh - block) / 2 + size * cap + i * lead, { align: 'center' }));

    doc.setProperties({ title: p.title });
    const url = doc.output('bloburl');
    if (tab) tab.location.href = url; else window.open(url, '_blank');
  } catch (err) {
    console.error(err);
    if (tab) tab.close();
  }
});
