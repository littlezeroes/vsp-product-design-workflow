const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

async function check(browser, base = 'http://localhost:3000', out = '/tmp/vinclub-redesign-qa') {
  fs.mkdirSync(out, { recursive: true });
  const source = fs.readFileSync(path.join(__dirname, '../app/vinclub-redesign/concepts.ts'), 'utf8');
  const slugs = [...source.matchAll(/slug:\s*["']([^"']+)["']/g)].map(match => match[1]);
  assert.equal(slugs.length, 10, 'The catalogue must contain exactly 10 variants');
  const errors = [];
  const results = [];
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  async function overflow(label) {
    const metrics = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, content:document.querySelector(".redesign-content")?.scrollWidth, contentWidth:document.querySelector(".redesign-content")?.clientWidth }));
    if(metrics.content!==undefined) assert.ok(metrics.content<=metrics.contentWidth+1, `${label}: inner content overflow ${JSON.stringify(metrics)}`);
    assert.ok(metrics.document <= metrics.width + 1, `${label}: horizontal overflow ${JSON.stringify(metrics)}`);
  }
  async function tokens(label) {
    const metrics = await page.getByTestId('app-preview').evaluate(phone => {
      const css = getComputedStyle(phone);
      const resolve = name => { const probe = document.createElement('span'); probe.style.color = `var(${name})`; phone.append(probe); const value = getComputedStyle(probe).color; probe.remove(); return value; };
      const primary = [...phone.querySelectorAll('button')].filter(button => button.querySelector(':scope > span.bg-foreground'));
      const home = [...phone.querySelectorAll('div')].find(el => {const rect = el.getBoundingClientRect(); return rect.width === 139 && rect.height === 5;});
      const card = phone.querySelector('.redesign-card');
      const sections = [...phone.querySelectorAll('section')];
      return { background: css.backgroundColor, foreground: css.color, backgroundToken: resolve('--background'), foregroundToken: resolve('--foreground'), primaryCount: primary.length, primaryHeight: primary[0]?.getBoundingClientRect().height, cardRadius: card ? getComputedStyle(card).borderRadius : null, sections: sections.map(el => {const style=getComputedStyle(el); return [style.paddingLeft, style.paddingRight, style.paddingTop, style.paddingBottom];}), bottomPadding: getComputedStyle(phone.querySelector('.redesign-bottom')).paddingLeft, homeVisible: !!home && home.getBoundingClientRect().bottom <= innerHeight && home.getBoundingClientRect().top >= 0 };
    });
    assert.equal(metrics.background, metrics.backgroundToken, `${label}: semantic background`);
    assert.equal(metrics.foreground, metrics.foregroundToken, `${label}: semantic foreground`);
    assert.equal(metrics.primaryCount, 1, `${label}: one primary`);
    assert.equal(metrics.primaryHeight, 48, `${label}: primary height 48`);
    if (metrics.cardRadius) assert.equal(metrics.cardRadius, '28px', `${label}: card radius 28`);
    for (const section of metrics.sections) assert.deepEqual(section, ['22px', '22px', '24px', '12px'], `${label}: content and section spacing`);
    assert.equal(metrics.bottomPadding, '22px', `${label}: fixed bottom content padding`);
    assert.ok(metrics.homeVisible, `${label}: visible home indicator`);
    return metrics.background;
  }
  try {
    for (const slug of slugs) {
      const response = await page.goto(`${base}/vinclub-redesign/${slug}`, { waitUntil: 'networkidle' });
      assert.ok(response.ok(), `${slug}: HTTP ${response.status()}`);
      await page.getByTestId('app-preview').waitFor();
      await overflow(slug);
      const lightBackground = await tokens(slug);
      const nav = page.getByRole('navigation', { name: 'Điều hướng ứng dụng' });
      const buttons = nav.getByRole('button');
      assert.equal(await buttons.count(), 4, `${slug}: four app navigation buttons`);
      const labels = await buttons.allTextContents();
      for (let index = 0; index < 4; index++) {
        await buttons.nth(index).click();
        await overflow(`${slug}/${labels[index]}`);
        await tokens(`${slug}/${labels[index]}`);
        await page.getByTestId('app-preview').screenshot({ path: path.join(out, `${slug}-tab-${index}.png`) });
      }
      await buttons.first().click();
      const search = page.getByRole('searchbox', { name: 'Tìm trong màn hình' });
      await search.fill('zzzzzz-no-match');
      await page.getByText('Không tìm thấy. Thử từ khóa khác.', { exact: true }).waitFor();
      await search.fill('');
      const control = page.getByTestId('variant-control').first();
      if (await control.count()) { await control.click(); await overflow(`${slug}/interaction`); }
      const save = page.getByRole('button', { name: 'Lưu', exact: true }).first();
      await save.click();
      assert.ok(await page.getByRole('button', { name: 'Đã lưu', exact: true }).first().getAttribute('aria-pressed') === 'true', `${slug}: saves item`);
      await page.getByRole('button', { name: 'Xem chi tiết', exact: false }).first().click();
      await page.getByRole('button', { name: 'Quay lại', exact: true }).waitFor();
      await overflow(`${slug}/detail`);
      await tokens(`${slug}/detail`);
      await page.getByRole('button', { name: 'Quay lại', exact: true }).click();
      await search.waitFor();
      assert.equal(await page.getByTestId('primary-action').count(), 1, `${slug}: single primary action`);
      await page.getByTestId('primary-action').click();
      const name = page.getByRole('textbox', { name: 'Tên người dùng', exact: true });
      if (await name.count()) await name.fill('Minh Anh');
      for (let step = 0; step < 3; step++) {
        if (slug === 'transparent' && step === 2) {
          assert.ok(await page.getByTestId('flow-next').isDisabled(), 'Receipt requires explicit confirmation');
          await page.getByRole('checkbox', {name:'Đã kiểm tra người nhận và phí'}).click();
        }
        await page.getByTestId('flow-next').click();
        await overflow(`${slug}/flow-${step + 1}`);
        await tokens(`${slug}/flow-${step + 1}`);
      }
      await page.getByTestId('flow-confirmation').waitFor();
      await page.screenshot({ path: path.join(out, `${slug}-confirmation.png`), fullPage: true });
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto(`${base}/vinclub-redesign/${slug}`, { waitUntil: 'networkidle' });
      await page.getByTestId('app-preview').waitFor();
      await page.getByRole('button', { name: 'Đổi giao diện', exact: true }).click();
      assert.ok(await page.evaluate(() => document.documentElement.classList.contains('dark')), `${slug}: dark theme enabled`);
      await overflow(`${slug}/dark`);
      assert.notEqual(await tokens(`${slug}/dark`), lightBackground, `${slug}: dark background changes`);
      await page.getByTestId('app-preview').screenshot({ path: path.join(out, `${slug}-dark.png`) });
      await page.getByRole('button', { name: 'Đổi giao diện', exact: true }).click();
      await page.emulateMedia({ colorScheme: 'light' });
      results.push({ slug, tabs: labels, flowSteps: 3, darkMode: true, passed: true });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    const response = await page.goto(`${base}/vinclub-redesign`, { waitUntil: 'networkidle' });
    assert.ok(response.ok(), 'Gallery should load');
    for (const slug of slugs) assert.ok(await page.locator(`a[href="/vinclub-redesign/${slug}"]`).count(), `Gallery links to ${slug}`);
    await overflow('desktop gallery');
    await page.screenshot({ path: path.join(out, 'gallery-desktop.png'), fullPage: true });
    assert.deepEqual(errors, [], 'No browser runtime errors');
  } catch (error) {
    await page.screenshot({ path: path.join(out, 'failure.png'), fullPage: true }).catch(() => {});
    throw error;
  } finally {
    fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify({ date: new Date().toISOString(), results, errors }, null, 2));
    await context.close();
  }
  console.log(`Passed ${results.length} variants, 40 navigation states, 30 flow transitions, dark mode, and desktop gallery. Artifacts: ${out}`);
}

module.exports = check;
if (require.main === module) {
  (async () => {
    const { chromium } = require('@playwright/test');
    const browser = await chromium.launch();
    try { await check(browser, process.argv[2], process.argv[3]); }
    finally { await browser.close(); }
  })().catch(error => { console.error(error); process.exitCode = 1; });
}
