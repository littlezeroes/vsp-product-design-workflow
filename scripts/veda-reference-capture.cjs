const { chromium } = require("@playwright/test");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({
    viewport: { width: 660, height: 372 },
    deviceScaleFactor: 1,
  });
  await p.goto("http://localhost:3240/veda?reference=assembly", {
    waitUntil: "networkidle",
  });
  await p.waitForSelector('[data-ready="true"]');
  await p.waitForTimeout(500);
  await p.screenshot({
    path: process.argv[2] || "output/veda/candidate-assembly-panel.png",
  });
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
