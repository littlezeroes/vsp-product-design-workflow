/* Reproduce IA wireframes, visual combinations and Three.js studies.
   Run: npm run vinclub:concept -- --base=http://localhost:3000
   Requires the Next dev server to be running. */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('@playwright/test');
const config = require('../public/vinclub-lab/config.json');
const base = (process.argv.find(a => a.startsWith('--base=')) || '--base=http://localhost:3000').slice(7);
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'public/vinclub-lab/generated');
fs.mkdirSync(out, { recursive: true });
const cases = config.ia.flatMap(ia => config.visual.map(v => ({ id: `${ia.id}-${v.id}`, ia: ia.id, visual: v.id, recommended: v.suitable.includes(ia.id), url: `${base}/vinclub-lab?solo=1&ia=${ia.id}&visual=${v.id}&stage=visual` })));
const errors = [];
const checks = [];
const artifacts = [];
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    if(process.argv.includes('--premium-only')) {await require('./vinclub-premium-check.cjs')(browser,base,out);return;}
    if(process.argv.includes('--audit-only')) {await require('./vinclub-ux-audit.cjs')(browser,base,out);return;}
    const context = await browser.newContext({ viewport: { width: 1000, height: 1100 } });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    async function load(ia, visual, stage, target=page) {
      await target.goto(`${base}/vinclub-lab?solo=1&ia=${ia}&visual=${visual}&stage=${stage}`, {waitUntil:'domcontentloaded'});
      await target.locator('[data-ready=true]').waitFor();
      await target.locator(`[data-phone][data-ia=${ia}]`).waitFor();
      await target.evaluate(() => document.fonts.ready);
    }
    for (const ia of config.ia) {
      await load(ia.id, 'metal', 'wireframe');
      const moduleNames = await page.locator('[data-phone] [data-module]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-module')));
      if (moduleNames.length !== ia.order.length) throw new Error(`Missing modules: ${ia.id}`);
      await page.locator('[data-phone]').screenshot({ path:path.join(out,`ia-${ia.id}.png`) });
      artifacts.push({stage:'IA',name:ia.name,src:`generated/ia-${ia.id}.png`,url:`/vinclub-lab?solo=1&ia=${ia.id}&stage=wireframe`});
      console.log(`IA ${ia.id}: ${moduleNames.length} modules`);
    }
    for (const c of cases) {
      await load(c.ia,c.visual,'visual');
      await page.locator('[data-phone]').screenshot({path:path.join(out,`${c.id}.png`)});
      artifacts.push({stage:'Visual',name:c.id,src:`generated/${c.id}.png`,url:`/vinclub-lab?solo=1&ia=${c.ia}&visual=${c.visual}&stage=visual`,recommended:c.recommended});
      console.log(`Visual ${c.id}`);
    }
    for (const id of ['atlas','daily','dualsurface']) {
      await load(id,'glass','wireframe');
      const tabs=await page.locator('[data-phone] .lab-spaces').count();
      if (id==='dualsurface' ? tabs!==1 : tabs!==0) throw new Error('Incorrect top navigation');
      if (await page.locator('[data-phone] .lab-direct-app').count() !== (id==='atlas'?9:8)) throw new Error('Missing direct mini apps');
      await page.getByRole('button',{name:'Mở Học phí',exact:true}).click();
      await page.getByLabel('Số tiền hoặc điểm').waitFor();
      await page.getByRole('button',{name:'Đóng tác vụ',exact:true}).click();
      if(id==='dualsurface') await page.getByRole('button',{name:'Hỏi AI · tìm trải nghiệm quanh bạn',exact:true}).click();
      if(id==='dualsurface'){
        if(await page.locator('[data-phone] .lab-scene').count())throw new Error('Unexpected 3D in balanced option');
        checks.push({name:'Balanced AI has no 3D',passed:true});
        continue;
      }
      await page.getByRole('button',{name:'Xem concept 3D',exact:true}).click();
      await page.locator('[data-renderer=three-webgl] canvas').waitFor({timeout:20000});
      await page.getByRole('button',{name:'Bản đồ 2D',exact:true}).click();
      checks.push({name:`${id}: correct top navigation, direct mini apps, tuition entry, 2D/3D toggle`,passed:true});
    }
    // Test the actionable journey, including invalid amount, failure and retry.
    await load('member','metal','interaction');
    await page.locator('[data-phone]').getByRole('button',{name:'Hóa đơn',exact:true}).click();
    await page.getByLabel('Số tiền hoặc điểm').fill('0');
    if (!(await page.getByRole('button',{name:'Tiếp tục',exact:true}).isDisabled())) throw new Error('Invalid amount accepted');
    await page.getByLabel('Số tiền hoặc điểm').fill('150000');
    await page.getByRole('button',{name:'Tiếp tục',exact:true}).click();
    await page.getByRole('button',{name:'Thử trạng thái lỗi',exact:true}).click();
    await page.getByRole('button',{name:'Thử lại',exact:true}).click();
    await page.getByRole('button',{name:'Tiếp tục',exact:true}).click();
    await page.getByRole('button',{name:'Xác nhận demo',exact:true}).click();
    await page.getByText('Đã hoàn tất bản demo',{exact:true}).waitFor();
    await page.locator('[data-phone]').screenshot({path:path.join(out,'interaction-success.png')});
    checks.push({name:'Amount validation → failure → retry → success',passed:true});
    await page.getByRole('button',{name:'Về Home',exact:true}).click();
    await page.locator('[data-phone]').getByRole('button',{name:'Thanh toán',exact:true}).click();
    await page.locator('[data-phone]').getByRole('button',{name:'Khám phá',exact:true}).click();
    checks.push({name:'Three top spaces are actionable',passed:true});
    await page.setViewportSize({width:390,height:844});
    await load('conversation','concierge','wireframe');
    const overflow = await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    if (overflow) throw new Error('Mobile page overflows');
    await page.getByLabel('Nhu cầu',{exact:true}).fill('Tìm voucher cho gia đình');
    await page.getByRole('button',{name:'Nhận gợi ý',exact:true}).click();
    await page.getByText('Gợi ý theo nhu cầu:',{exact:false}).waitFor();
    checks.push({name:'390px layout + conversation action',passed:true});
    await context.close();
    for (const v of config.visual) {
      const ia=v.suitable[0];
      const videoContext = await browser.newContext({viewport:{width:390,height:844},recordVideo:{dir:out,size:{width:390,height:844}}});
      const p = await videoContext.newPage();
      p.on('pageerror',e=>errors.push(e.message));
      await load(ia,v.id,'3d',p);
      await p.addStyleTag({content:'.lab-root {visibility:hidden} .lab-phone {visibility:visible;position:fixed;inset:0;margin:0;width:390px;height:844px;border-radius:0} nextjs-portal {display:none}'});
      await p.locator('[data-renderer=three-webgl] canvas').waitFor({timeout:20000});
      const scene=p.locator('.lab-scene');
      await scene.scrollIntoViewIfNeeded();
      const box=await scene.boundingBox();
      await p.mouse.move(box.x+box.width*.2,box.y+box.height*.3);
      await p.mouse.down();
      await p.mouse.move(box.x+box.width*.8,box.y+box.height*.6,{steps:20});
      await p.mouse.up();
      await p.waitForTimeout(1000);
      await p.locator('[data-phone]').screenshot({path:path.join(out,`3d-${v.id}.png`)});
      await p.waitForTimeout(500);
      const video=p.video();
      await videoContext.close();
      await video.saveAs(path.join(out,`3d-${v.id}.webm`));
      artifacts.push({stage:'3D',name:v.name,src:`generated/3d-${v.id}.png`,video:`generated/3d-${v.id}.webm`,url:`/vinclub-lab?solo=1&ia=${ia}&visual=${v.id}&stage=3d`});
      checks.push({name:`Three.js renderer + pointer: ${v.id}`,passed:true});
      console.log(`Three.js ${v.id}: scene and recording`);
    }
    if(errors.length) throw new Error(errors.join('\n'));
    fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({createdAt:new Date().toISOString(),configVersion:config.version,cases,checks,errors,artifacts},null,2));
    const style=':root{--background:#101214;--foreground:#efefeb;--foreground-secondary:#b4b9ba;--surface:#202529;--accent:#dfc9a2}*{box-sizing:border-box}body{margin:0;background:var(--background);color:var(--foreground);font:15px/1.6 system-ui}main{padding:32px 22px;max-width:1500px;margin:auto}a{color:var(--accent)}h1{font-size:36px}h2{margin-top:45px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:22px}article{background:var(--surface);padding:18px;border-radius:14px}img,video{width:100%;border-radius:14px}p{color:var(--foreground-secondary)}';
    const gallery=['IA','Visual','3D'].map(stage=>`<h2>${stage}</h2><div class="grid">${artifacts.filter(a=>a.stage===stage).map(a=>`<article><a href="${escape(a.url)}"><img loading="lazy" src="${escape(a.src)}" alt="${escape(a.name)}"><h3>${escape(a.name)} ↗</h3></a>${a.recommended?'<p>Phối đáng thử theo recipe</p>':''}${a.video?`<video controls playsinline preload="none" poster="${escape(a.src)}" src="${escape(a.video)}"></video>`:''}</article>`).join('')}</div>`).join('');
    fs.writeFileSync(path.join(root,'public/vinclub-lab/gallery.html'),`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VinClub — Generated IA × Z Gallery</title><style>${style}</style><main><a href="/vinclub-lab">← Về Concept Lab</a><h1>${config.ia.length} khung nhà × ${config.visual.length} visual study.</h1><p>Tự động tạo từ config.json. Visual là study sơ bộ, video là ghi màn hình thử Three.js; chưa phải concept hi-fi/video final.</p><p>${checks.length} kiểm tra đạt · ${config.ia.length} IA · ${cases.length} tổ hợp visual · 5 scene và recording.</p>${gallery}<h2>Interaction / state</h2><img style="max-width:390px" src="generated/interaction-success.png" alt="Trạng thái thành công của flow demo"><p>${config.assumptions.map(escape).join('<br>')}</p></main></html>`);
    console.log(JSON.stringify({gallery:`${base}/vinclub-lab/gallery.html`,artifacts:artifacts.length,checks:checks.length,errors}));
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
