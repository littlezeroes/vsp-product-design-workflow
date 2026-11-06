const { chromium } = require("@playwright/test");
const fs = require("node:fs");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch();
  const p = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await p.goto("http://localhost:3240/veda/lab", { waitUntil: "networkidle" });
  await p.waitForSelector('[data-rendered-frame="60"]', { timeout: 60000 });
  await p.screenshot({ path: "output/veda-v3/lab-desktop.png" });
  await p.getByRole("button", { name: "Tiến một frame", exact: true }).click();
  await p.waitForSelector('[data-rendered-frame="61"]');
  assert.equal(await p.locator("#source-frame").inputValue(), "61");
  await p.getByRole("button", { name: "Lùi một frame", exact: true }).click();
  await p.waitForSelector('[data-rendered-frame="60"]');
  for (const frame of [60, 68, 76, 78, 80, 88, 95]) {
    await p.locator("#source-frame").fill(String(frame));
    await p.locator("#source-frame").dispatchEvent("input");
    await p.locator("#source-frame").dispatchEvent("change");
    await p.waitForSelector(`[data-rendered-frame="${frame}"]`);
    await p
      .locator(".veda-study-comparison")
      .screenshot({ path: `output/veda-v3/web-ring-${frame}.png` });
  }
  await p.getByRole("button", { name: "Phát", exact: true }).click();
  await p.waitForTimeout(600);
  await p.getByRole("button", { name: "Dừng", exact: true }).click();
  const stopped = await p.locator("#source-frame").inputValue();
  await p.waitForTimeout(250);
  assert.equal(await p.locator("#source-frame").inputValue(), stopped);
  await p.getByRole("button", { name: "02 · Xếp ngang", exact: true }).click();
  await p.waitForSelector('[data-rendered-frame="315"]');
  await p
    .locator(".veda-study-comparison")
    .screenshot({ path: "output/veda-v3/web-assembly-315.png" });
  await p.getByRole("button", { name: "Tiến một frame", exact: true }).click();
  await p.waitForSelector('[data-rendered-frame="316"]');
  for (const config of [
    {
      name: "03 · Khối đa giác",
      frames: [138, 150, 160, 175],
      initial: 150,
      prefix: "facet",
    },
    {
      name: "04 · Lật logo",
      frames: [455, 459, 460, 464, 465, 469, 470, 480, 495],
      initial: 480,
      prefix: "logos",
    },
  ]) {
    await p.getByRole("button", { name: config.name, exact: true }).click();
    await p.waitForSelector(`[data-rendered-frame="${config.initial}"]`);
    for (const frame of config.frames) {
      await p.locator("#source-frame").fill(String(frame));
      await p.waitForSelector(`[data-rendered-frame="${frame}"]`);
      await p
        .locator(".veda-study-reference img")
        .evaluate((img) => img.decode());
      await p
        .locator(".veda-study-comparison")
        .screenshot({
          path: `output/veda-v3/web-${config.prefix}-${frame}.png`,
        });
    }
  }
  const desktopOverflow = await p.evaluate(
    () => document.documentElement.scrollWidth > innerWidth
  );
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(200);
  await p.screenshot({ path: "output/veda-v3/lab-mobile.png", fullPage: true });
  const mobileOverflow = await p.evaluate(
    () => document.documentElement.scrollWidth > innerWidth
  );
  const report = {
    functionalPassed:
      errors.length === 0 && !desktopOverflow && !mobileOverflow,
    errors,
    desktopOverflow,
    mobileOverflow,
    oneFrameStepMilliseconds: 1000 / 30,
    sourceFramesInventoried: 680,
    observedRingFrames: 41,
    observedStackFrames: 41,
    observedIsolatedFacetFrames: 38,
    observedLogoFrames: 41,
    sourceFramesUsedFor3DStudies: 161,
    qualifications: [
      "Ellipse fit is not exact 3D pose recovery.",
      "Stack arrangement is a hypothesis.",
      "Frame stepping and runtime checks do not certify visual equality.",
    ],
  };
  fs.writeFileSync(
    "output/veda-v3/harness.json",
    JSON.stringify(report, null, 2)
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  if (!report.functionalPassed) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
