#!/usr/bin/env node
/**
 * Scrape all device NFC location images from nfc-guides.kalapa.vn.
 *
 * Usage:
 *   npm i -D playwright
 *   node app/tools/scrape-kalapa-nfc.mjs [--out ./nfc-images]
 *
 * Output:
 *   - ./nfc-images/<brand>/<model>.jpg
 *   - ./nfc-images/index.json   (full catalog)
 */

import { chromium } from "playwright"
import fs from "node:fs/promises"
import path from "node:path"

const OUT_DIR = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : "./nfc-images"

const BASE = "https://nfc-guides.kalapa.vn"

function safe(name) {
  return name.replace(/[^\p{L}\p{N}._-]+/gu, "_").slice(0, 120)
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
    locale: "vi-VN",
  })
  const page = await ctx.newPage()

  // Capture XHR responses to see if the site uses an API
  const apiCalls = []
  page.on("response", async (res) => {
    const url = res.url()
    const ct = res.headers()["content-type"] || ""
    if (
      url.includes(".kalapa.vn") &&
      (ct.includes("application/json") || url.includes("/api/"))
    ) {
      try {
        const json = await res.json()
        apiCalls.push({ url, json })
      } catch {}
    }
  })

  console.log("→ loading homepage…")
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60_000 })

  // Try common selectors for brand / device dropdowns
  const dropdowns = await page.$$("select")
  console.log(`  found ${dropdowns.length} <select> elements`)

  // Try to enumerate brand select
  let brandOptions = []
  if (dropdowns.length > 0) {
    brandOptions = await dropdowns[0].$$eval("option", (opts) =>
      opts
        .map((o) => ({ value: o.value, label: o.textContent.trim() }))
        .filter((o) => o.value && o.label)
    )
  }

  console.log(`  brands: ${brandOptions.length}`)
  brandOptions.forEach((b) => console.log("    -", b.label))

  const catalog = []

  for (const brand of brandOptions) {
    console.log(`\n→ brand: ${brand.label}`)
    const brandDir = path.join(OUT_DIR, safe(brand.label))
    await fs.mkdir(brandDir, { recursive: true })

    // Select brand
    await dropdowns[0].selectOption({ value: brand.value })
    await page.waitForTimeout(800)

    // Re-query model select (should now be populated)
    const allSelects = await page.$$("select")
    const modelSelect = allSelects[1] // assume 2nd select = model
    if (!modelSelect) {
      console.log("  no model select found, skipping")
      continue
    }
    const modelOptions = await modelSelect.$$eval("option", (opts) =>
      opts
        .map((o) => ({ value: o.value, label: o.textContent.trim() }))
        .filter((o) => o.value && o.label)
    )

    console.log(`  models: ${modelOptions.length}`)

    for (const m of modelOptions) {
      try {
        await modelSelect.selectOption({ value: m.value })
        await page.waitForTimeout(700)

        // Try clicking a "Kiểm tra" / Check button
        const btn = await page.$(
          'button:has-text("Kiểm tra"), button:has-text("Xem"), button[type="submit"]'
        )
        if (btn) {
          await btn.click().catch(() => {})
          await page.waitForTimeout(900)
        }

        // Find result image — heuristics: largest <img> inside main content
        const imgUrl = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll("img"))
          // prefer ones with "phone" / "nfc" in src or alt
          const ranked = imgs
            .map((i) => ({
              src: i.currentSrc || i.src,
              w: i.naturalWidth || i.width || 0,
              h: i.naturalHeight || i.height || 0,
              alt: i.alt || "",
            }))
            .filter((x) => x.src && x.w > 200 && x.h > 200)
            .sort((a, b) => b.w * b.h - a.w * a.h)
          return ranked[0]?.src || null
        })

        if (!imgUrl) {
          console.log(`    ✗ ${m.label}: no image`)
          continue
        }

        const ext = path.extname(new URL(imgUrl, BASE).pathname) || ".jpg"
        const fileName = `${safe(m.label)}${ext}`
        const filePath = path.join(brandDir, fileName)

        // Download via fetch through the browser context (carries cookies / referer)
        const buf = await page.evaluate(async (u) => {
          const r = await fetch(u, { credentials: "include" })
          const ab = await r.arrayBuffer()
          return Array.from(new Uint8Array(ab))
        }, imgUrl)
        await fs.writeFile(filePath, Buffer.from(buf))

        catalog.push({
          brand: brand.label,
          model: m.label,
          imageUrl: imgUrl,
          file: path.relative(OUT_DIR, filePath),
        })
        console.log(`    ✓ ${m.label}`)
      } catch (e) {
        console.log(`    ✗ ${m.label}: ${e.message}`)
      }
    }
  }

  await fs.writeFile(
    path.join(OUT_DIR, "index.json"),
    JSON.stringify(catalog, null, 2),
    "utf8"
  )
  await fs.writeFile(
    path.join(OUT_DIR, "_api-calls.json"),
    JSON.stringify(apiCalls, null, 2),
    "utf8"
  )
  console.log(
    `\n✓ done — ${catalog.length} devices saved to ${OUT_DIR}/index.json`
  )
  console.log(
    `  Inspect _api-calls.json if dropdown logic missed any data — there's likely a JSON API to use directly.`
  )

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
