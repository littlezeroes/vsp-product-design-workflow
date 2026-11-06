const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const path = require("node:path");
(async () => {
  const out = path.resolve("output/veda");
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("http://localhost:3240/veda", { waitUntil: "networkidle" });
  await page.waitForSelector('.veda-page[data-ready="true"]', {
    timeout: 60000,
  });
  await page.getByRole("button", { name: "Pause motion" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(out, "web-desktop.png") });
  const still1 = await page.locator(".veda-hero-object").screenshot();
  await page.waitForTimeout(300);
  const still2 = await page.locator(".veda-hero-object").screenshot();
  assert(still1.equals(still2), "Pause should freeze the hero sculpture");
  await page.locator("#assemblies").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Orbit", exact: true }).click();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: path.join(out, "web-ring.png") });
  await page.getByRole("button", { name: "Assembly", exact: true }).click();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: path.join(out, "web-assembly.png") });
  assert.equal(
    await page
      .locator("[data-veda-stage=assembly]")
      .getAttribute("data-formation"),
    "assembly"
  );
  await page
    .getByRole("button", { name: "Follow scroll", exact: true })
    .click();
  await page.evaluate(() => {
    const el = document.querySelector("#assemblies");
    scrollTo(0, el.offsetTop + (el.offsetHeight - innerHeight) * 0.85);
  });
  await page.waitForTimeout(1300);
  assert.equal(
    await page
      .locator("[data-veda-stage=assembly]")
      .getAttribute("data-formation"),
    "assembly"
  );
  await page.evaluate(() => {
    const el = document.querySelector("#assemblies");
    scrollTo(0, el.offsetTop);
  });
  await page.waitForTimeout(1300);
  assert.equal(
    await page
      .locator("[data-veda-stage=assembly]")
      .getAttribute("data-formation"),
    "ring"
  );
  await page.locator("#geometry").scrollIntoViewIfNeeded();
  await page
    .getByRole("button", { name: "Reveal geometry", exact: true })
    .click();
  await page.screenshot({ path: path.join(out, "web-geometry.png") });
  await page
    .getByRole("button", { name: "Show surfaces", exact: true })
    .click();
  await page.locator("#materials").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(out, "web-materials.png") });
  const desktopOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3240/veda", { waitUntil: "networkidle" });
  await page.waitForSelector('.veda-page[data-ready="true"]');
  await page.screenshot({ path: path.join(out, "web-mobile.png") });
  const mobileOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth
  );
  await page.locator("#assemblies").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Assembly", exact: true }).click();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: path.join(out, "web-mobile-assembly.png") });
  await page.setViewportSize({ width: 660, height: 372 });
  await page.goto("http://localhost:3240/veda?reference=assembly", {
    waitUntil: "networkidle",
  });
  await page.waitForSelector('.veda-page[data-ready="true"]');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(out, "candidate-assembly-panel.png"),
  });
  const report = {
    functionalPassed:
      errors.length === 0 && !desktopOverflow && !mobileOverflow,
    pauseFreezesHero: true,
    scrollChangesFormation: true,
    errors: [...new Set(errors)],
    desktopOverflow,
    mobileOverflow,
    assets: fs
      .readdirSync("public/veda/models")
      .filter((x) => x.endsWith(".glb"))
      .map((name) => ({
        name,
        bytes: fs.statSync("public/veda/models/" + name).size,
      })),
    note: "Functional checks are independent of visual fidelity. Strict source comparison is recorded separately.",
  };
  fs.writeFileSync(
    path.join(out, "harness.json"),
    JSON.stringify(report, null, 2)
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  if (errors.length || desktopOverflow || mobileOverflow) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
