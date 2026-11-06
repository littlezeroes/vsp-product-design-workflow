/**
 * Design loop — MEASURE step.
 * Screenshots the phone frame (light + dark, full scroll) and runs a DOM audit
 * for spacing/typography/contrast/touch-target rules. Writes JSON + PNGs to outDir.
 *
 * Usage: node scripts/design-loop/measure.cjs "<url>" <outDir> [label]
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const [,, url, outDir = "output/design-loop", label = "run"] = process.argv;
if (!url) { console.error("url required"); process.exit(2); }
fs.mkdirSync(outDir, { recursive: true });

const AUDIT = () => {
  const phone = document.querySelector(".vk-phone");
  const scroll = phone.querySelector(".vk-scroll");
  const pr = phone.getBoundingClientRect();
  const issues = [];
  const px = v => Math.round(parseFloat(v) || 0);
  const lum = c => { const m = c.match(/\d+(\.\d+)?/g); if (!m) return null; const [r,g,b] = m.map(Number); const f = x => { x/=255; return x <= .03928 ? x/12.92 : ((x+.055)/1.055)**2.4 }; return .2126*f(r)+.7152*f(g)+.0722*f(b); };
  const bgOf = el => { let n = el; while (n && n !== document.body) { const c = getComputedStyle(n).backgroundColor; if (c && !c.endsWith(", 0)") && c !== "transparent") return c; n = n.parentElement; } return "rgb(255,255,255)"; };
  const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.opacity !== "0"; };
  const els = [...scroll.querySelectorAll("*")].filter(vis);
  // 1. text nodes: font sizes, line-height, left edges, contrast
  const fontSizes = {}, leftEdges = {}, families = {};
  const textEls = els.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
  for (const e of textEls) {
    const s = getComputedStyle(e); const r = e.getBoundingClientRect();
    const fs = px(s.fontSize); fontSizes[fs] = (fontSizes[fs] || 0) + 1;
    families[s.fontFamily.split(",")[0]] = (families[s.fontFamily.split(",")[0]] || 0) + 1;
    const left = Math.round(r.left - pr.left); leftEdges[left] = (leftEdges[left] || 0) + 1;
    if (fs < 11) issues.push({ rule: "min-font-11", el: e.className, text: e.textContent.trim().slice(0, 30), fs });
    const fg = lum(s.color), bg = lum(bgOf(e));
    if (fg != null && bg != null) { const ratio = (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05); const big = fs >= 24 || (fs >= 19 && +s.fontWeight >= 700); if (ratio < (big ? 3 : 4.5)) issues.push({ rule: "contrast", el: e.className, text: e.textContent.trim().slice(0, 30), ratio: +ratio.toFixed(2), fs, color: s.color, bg: bgOf(e) }); }
  }
  // 2. touch targets
  for (const b of els.filter(e => e.matches("button,a,[role=button]"))) { const r = b.getBoundingClientRect(); if (r.height < 32 || r.width < 32) issues.push({ rule: "touch-target-32", el: b.className, label: b.getAttribute("aria-label") || b.textContent.trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) }); }
  // 3. radius inventory
  const radii = {}; for (const e of els) { const r = px(getComputedStyle(e).borderTopLeftRadius); if (r) radii[r] = (radii[r] || 0) + 1; }
  // 4. spacing: gaps between direct children of .vr-stack / .vr-mix (vertical rhythm)
  const rhythm = []; for (const wrap of [scroll.querySelector(".vr-stack"), scroll.querySelector(".vr-mix")].filter(Boolean)) { const kids = [...wrap.children].filter(vis); for (let i = 1; i < kids.length; i++) { const a = kids[i-1].getBoundingClientRect(), b = kids[i].getBoundingClientRect(); rhythm.push({ from: kids[i-1].className.split(" ")[0], to: kids[i].className.split(" ")[0], gap: Math.round(b.top - a.bottom) }); } }
  for (const g of rhythm) if (g.gap % 4 !== 0 && g.gap >= 0) issues.push({ rule: "gap-not-4x", ...g });
  // 5. images without alt + overflow
  for (const img of els.filter(e => e.tagName === "IMG")) { if (!img.hasAttribute("alt")) issues.push({ rule: "img-no-alt", src: img.getAttribute("src") }); if (!img.complete || img.naturalWidth === 0) issues.push({ rule: "img-broken", src: img.getAttribute("src") }); }
  for (const e of els) { const r = e.getBoundingClientRect(); if (r.right > pr.right + 1 || r.left < pr.left - 1) { if (getComputedStyle(e).position !== "fixed") issues.push({ rule: "overflow-x", el: e.className.toString().slice(0, 40), left: Math.round(r.left-pr.left), right: Math.round(r.right-pr.left) }); } }
  // 6. headings order
  const hs = [...scroll.querySelectorAll("h1,h2,h3")].map(h => ({ tag: h.tagName, text: h.textContent.trim().slice(0, 40) }));
  return { phone: { w: Math.round(pr.width), h: Math.round(pr.height) }, scrollHeight: scroll.scrollHeight, fontSizes, families, leftEdges, radii, rhythm, headings: hs, issues };
};

(async () => {
  const browser = await chromium.launch();
  const out = { url, label, at: new Date().toISOString(), modes: {} };
  for (const mode of ["light", "dark"]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
    const u = new URL(url); u.searchParams.set("mode", mode); u.searchParams.set("launch", "0");
    await page.goto(u.toString(), { waitUntil: "networkidle" });
    // skip splash if present
    await page.waitForFunction(() => document.querySelector(".vk-page")?.getAttribute("data-ready") === "true", null, { timeout: 15000 }).catch(() => {});
    await page.evaluate(() => { const l = document.querySelector(".vk-launch"); if (l) l.remove(); });
    await page.waitForFunction(() => !document.querySelector(".vk-page[data-home-skeleton]"), null, { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(600);
    const phone = page.locator(".vk-phone");
    await phone.screenshot({ path: path.join(outDir, `${label}-${mode}-fold.png`) });
    // full scroll: expand scroll container
    await page.evaluate(() => { const p = document.querySelector(".vk-phone"); const s = p.querySelector(".vk-scroll"); p.style.height = s.scrollHeight + "px"; s.style.height = "auto"; s.style.overflow = "visible"; });
    await page.waitForTimeout(200);
    await phone.screenshot({ path: path.join(outDir, `${label}-${mode}-full.png`) });
    await page.reload({ waitUntil: "networkidle" });
    await page.evaluate(() => { const l = document.querySelector(".vk-launch"); if (l) l.remove(); });
    await page.waitForFunction(() => !document.querySelector(".vk-page[data-home-skeleton]"), null, { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(400);
    out.modes[mode] = await page.evaluate(AUDIT);
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(outDir, `${label}.json`), JSON.stringify(out, null, 2));
  const summary = Object.entries(out.modes).map(([m, r]) => `${m}: ${r.issues.length} issues (${Object.entries(r.issues.reduce((a, i) => (a[i.rule] = (a[i.rule] || 0) + 1, a), {})).map(([k, v]) => `${k}=${v}`).join(", ")})`).join("\n");
  console.log(summary);
})().catch(e => { console.error(e); process.exit(1); });
