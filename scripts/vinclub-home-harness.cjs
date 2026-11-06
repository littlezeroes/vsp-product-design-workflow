#!/usr/bin/env node
/*
 * QA harness for /vinclub-home: renders every approach and layout in light and dark, fails on
 * runtime errors, broken images, sideways overflow or clipped text, and writes contact sheets.
 * Usage: node scripts/vinclub-home-harness.cjs [outDir] [baseUrl]
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const out = path.resolve(process.argv[2] || "output/vinclub-home-harness");
const base = process.argv[3] || "http://localhost:3250/vinclub-home";
const APPROACHES = ["voucher", "stack", "catalog", "award", "offers", "scratch", "pick", "rate", "follow", "draw", "report", "value", "expiry", "gift", "boost", "perk", "staff", "card", "progress", "super"];
const cases = [];
for (const mode of ["light", "dark"]) {
  for (const approach of APPROACHES) for (const layout of [1, 2, 3, 4]) cases.push({ mode, approach, layout, name: `${mode}-${approach}-${layout}` });
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) cases.push({ mode, approach: "stack", query: `skin=${(n % 8) + 1}&style=${(n % 8) + 1}&hook=${n}&pos=${(n % 3) + 1}`, name: `${mode}-stack-opt-${n}` });
  for (const n of [1, 2, 3, 4]) cases.push({ mode, approach: "plan", query: `top=${n}&promote=${n}&unlock=${n}&suggest=${n}`, name: `${mode}-plan-${n}` });
}
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 960 } });
  page.setDefaultTimeout(20000);
  await page.emulateMedia({ reducedMotion: "reduce" }); // screenshots must not catch entrance animations mid-way
  await page.emulateMedia({ reducedMotion: "reduce" }); // screenshots must not catch entrance animations mid-way
  const failures = []; let errors = [];
  page.on("pageerror", error => errors.push(error.message.slice(0, 140)));
  for (const item of cases) {
    errors = [];
    const url = `${base}?approach=${item.approach}&mode=${item.mode}&${item.query || `layout=${item.layout}`}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.locator(".vk-phone .vk-scroll").waitFor();
    await page.waitForTimeout(450);
    const problems = await page.evaluate(() => {
      const found = [];
      const scroll = document.querySelector(".vk-scroll");
      if (scroll.scrollWidth > scroll.clientWidth + 1) found.push(`sideways overflow ${scroll.scrollWidth}`);
      for (const image of document.querySelectorAll(".vk-phone img")) if (image.complete && !image.naturalWidth) found.push(`broken image ${image.getAttribute("src")}`);
      const edge = scroll.getBoundingClientRect();
      for (const node of scroll.querySelectorAll("strong,small,em,b,h2,p")) {
        if (node.closest("[class*=rail],[class*=chips],.vh-more,.vr-fy-rail,.vr-offers,.vr-events,.vr-sheet .vh-v-grid,[data-layout=\"3\"] .vh-v-grid")) continue;
        if (node.getBoundingClientRect().right > edge.right + 1) found.push(`past edge "${node.textContent.slice(0, 28)}"`);
        const parent = node.parentElement.getBoundingClientRect();
        if (node.getBoundingClientRect().right > parent.right + 1) found.push(`spills parent "${node.textContent.slice(0, 28)}"`);
      }
      return found;
    });
    await page.locator(".vk-phone").screenshot({ path: path.join(out, `${item.name}.png`) });
    const all = [...new Set([...errors, ...problems])];
    if (all.length) failures.push({ name: item.name, url, problems: all });
  }
  const sheet = mode => `<h2>${mode}</h2>` + [...APPROACHES, "plan"].map(a => `<div class=r>${cases.filter(c => c.mode === mode && c.approach === a).map(c => `<img src="${c.name}.png">`).join("")}</div>`).join("");
  fs.writeFileSync(path.join(out, "index.html"), `<!doctype html><meta charset=utf-8><title>VinClub Home harness</title><style>body{font:14px sans-serif;background:#e9e7e4;margin:24px}.r{display:flex;gap:12px;margin:0 0 12px}img{width:260px;border-radius:14px}</style>${sheet("light")}${sheet("dark")}`);
  fs.writeFileSync(path.join(out, "report.json"), JSON.stringify({ total: cases.length, failures }, null, 2));
  console.log(`${cases.length} cases, ${failures.length} failed`);
  for (const failure of failures) console.log(`- ${failure.name}: ${failure.problems.join("; ")}`);
  await browser.close();
  process.exit(failures.length ? 1 : 0);
})().catch(error => { console.error(error.message); process.exit(2); });
