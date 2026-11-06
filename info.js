// Information page: images/information/01.jpg ... 34.jpg cycle in the background with a soft crossfade.
(() => {
  const DIR = 'images/information/';   // folder with the images
  const COUNT = 34;                    // how many images
  const HOLD = 5000;                   // ms each image rests
  const FADE = 2600;                   // ms crossfade

  const src = n => `${DIR}${String(n).padStart(2, '0')}.jpg`;
  const mk = () => {
    const d = document.createElement('div');
    d.className = 'ibg'; d.style.transitionDuration = FADE + 'ms';
    document.body.appendChild(d);
    return d;
  };
  const A = mk(), B = mk();
  let front = A, bag = [];

  const next = () => { // shuffled: every image shows once before any repeats
    if (!bag.length) {
      bag = Array.from({ length: COUNT }, (_, i) => i + 1);
      for (let i = bag.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
    }
    return bag.pop();
  };
  const load = n => new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(n); im.onerror = no; im.src = src(n); });
  const pick = async () => {
    for (let t = 0; t < 6; t++) { try { return await load(next()); } catch (e) {} }
    return null;
  };
  const wait = ms => new Promise(r => setTimeout(r, ms));

  (async () => {
    let n = await pick();
    if (!n) return;
    front.style.backgroundImage = `url(${src(n)})`;
    front.classList.add('on');
    for (;;) {
      const pending = pick();            // load the next one while this one rests
      await wait(HOLD);
      n = await pending;
      if (!n) return;
      const back = front === A ? B : A;  // new image fades in over the old one
      back.style.transitionDuration = '0ms';
      back.classList.remove('on');
      back.style.zIndex = -1; front.style.zIndex = -2;
      back.style.backgroundImage = `url(${src(n)})`;
      void back.offsetWidth;
      back.style.transitionDuration = FADE + 'ms';
      back.classList.add('on');
      const old = front; front = back;
      await wait(FADE);
      old.style.transitionDuration = '0ms';
      old.classList.remove('on');
    }
  })();
})();
