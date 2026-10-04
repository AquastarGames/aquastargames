(() => {
  const out = { viewport: { w: innerWidth, h: innerHeight, dpr: devicePixelRatio } };
  out.horizontalOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  out.doc = { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
  // all header/nav interactive elements
  const header = document.querySelector('header') || document.querySelector('nav');
  const items = [];
  if (header) {
    header.querySelectorAll('a, button, [role="button"]').forEach(el => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      items.push({
        tag: el.tagName.toLowerCase(),
        text: (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40),
        display: cs.display, visibility: cs.visibility, opacity: cs.opacity,
        ariaExpanded: el.getAttribute('aria-expanded'),
        w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top)
      });
    });
  }
  out.headerItems = items;
  // any hamburger-like button anywhere
  const btns = [];
  document.querySelectorAll('button, [aria-expanded], [aria-label*="menu" i]').forEach(el => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden') {
      btns.push({ tag: el.tagName.toLowerCase(), aria: el.getAttribute('aria-label'), expanded: el.getAttribute('aria-expanded'), text: (el.innerText || '').trim().slice(0, 30), cls: (typeof el.className === 'string' ? el.className : '').slice(0, 50), w: Math.round(r.width), h: Math.round(r.height) });
    }
  });
  out.visibleButtons = btns.slice(0, 20);
  // header height, hero text blocks legibility / tap target sizes
  const small = [];
  document.querySelectorAll('a, button').forEach(el => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (cs.display !== 'none' && r.width > 0 && (r.height < 32 || r.width < 24) && r.top < 2000) {
      small.push({ text: (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) });
    }
  });
  out.smallTapTargets = small.slice(0, 12);
  out.h1 = (document.querySelector('h1') || {}).innerText || null;
  out.h1Rect = (() => { const h = document.querySelector('h1'); if (!h) return null; const r = h.getBoundingClientRect(); const cs = getComputedStyle(h); return { w: Math.round(r.width), fontSize: cs.fontSize, color: cs.color, lineHeight: cs.lineHeight }; })();
  return out;
})()