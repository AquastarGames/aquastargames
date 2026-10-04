(() => {
  const out = {};
  out.url = location.href;
  out.title = document.title;
  out.viewport = { w: innerWidth, h: innerHeight };
  out.doc = {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    bodyScrollWidth: document.body ? document.body.scrollWidth : null
  };
  out.horizontalOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  // overflow offenders
  const offenders = [];
  const vw = document.documentElement.clientWidth;
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && typeof el.className === 'string') ? el.className.slice(0, 60) : '',
        left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width)
      });
    }
  });
  out.offenders = offenders.slice(0, 15);
  out.offenderCount = offenders.length;

  // images
  const imgs = Array.from(document.images).map(i => ({
    src: (i.currentSrc || i.src || '').slice(-70),
    ok: i.complete && i.naturalWidth > 0,
    nw: i.naturalWidth, nh: i.naturalHeight,
    w: i.clientWidth, h: i.clientHeight,
    alt: i.alt
  }));
  out.imageCount = imgs.length;
  out.brokenImages = imgs.filter(i => !i.ok);
  out.zeroSizeImages = imgs.filter(i => i.ok && (i.w === 0 || i.h === 0));

  // background images
  const bgBroken = [];
  document.querySelectorAll('*').forEach(el => {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg !== 'none' && bg.includes('url(') && !bg.includes('gradient')) bgBroken.push(bg.slice(0, 90));
  });
  out.backgroundImages = bgBroken.slice(0, 12);

  // palette sampling
  const colorCount = {};
  const bgCount = {};
  const els = document.querySelectorAll('body *');
  const limit = Math.min(els.length, 1500);
  for (let i = 0; i < limit; i++) {
    const cs = getComputedStyle(els[i]);
    colorCount[cs.color] = (colorCount[cs.color] || 0) + 1;
    if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') bgCount[cs.backgroundColor] = (bgCount[cs.backgroundColor] || 0) + 1;
  }
  const top = o => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 12);
  out.topTextColors = top(colorCount);
  out.topBgColors = top(bgCount);

  // yellow-ish detection
  const yellows = [];
  const isYellow = (c) => {
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m) return false;
    const [r, g, b] = [+m[1], +m[2], +m[3]];
    const a = m[4] === undefined ? 1 : parseFloat(m[4]);
    if (a < 0.05) return false;
    return r > 180 && g > 150 && b < 110 && (r - b) > 80 && (g - b) > 60;
  };
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el);
    [['color', cs.color], ['background-color', cs.backgroundColor], ['border-top-color', cs.borderTopColor]].forEach(([k, v]) => {
      if (isYellow(v)) yellows.push({ tag: el.tagName.toLowerCase(), prop: k, val: v, txt: (el.textContent || '').trim().slice(0, 40) });
    });
  });
  out.yellowAccents = yellows.slice(0, 15);
  out.yellowCount = yellows.length;

  out.bodyBg = getComputedStyle(document.body).backgroundColor;
  out.bodyColor = getComputedStyle(document.body).color;
  out.fontFamily = getComputedStyle(document.body).fontFamily;
  out.bodyFontSize = getComputedStyle(document.body).fontSize;
  out.textSample = (document.body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 1200);
  out.textLength = (document.body.innerText || '').length;

  // nav / menu
  const nav = document.querySelector('nav, header');
  if (nav) {
    const cs = getComputedStyle(nav);
    out.nav = { display: cs.display, visible: nav.offsetParent !== null || cs.position === 'fixed', text: (nav.innerText || '').replace(/\s+/g, ' ').slice(0, 300) };
  }
  return out;
})()