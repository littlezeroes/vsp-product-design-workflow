const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.BASE_URL || 'http://localhost:3000';
const out = 'output/prism-beam-folder';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const errors = [];
    const page = await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:2});
    page.on('pageerror', e => errors.push(e.message));
    const root = page.locator('.prism-screen');
    const folder = page.getByRole('button', {name:'Weekend Snacks folder. Hold it to pour your picks in.',exact:true});
    const wait = async (predicate, timeout = 12000) => page.waitForFunction(predicate, undefined, {timeout});
    const rest = () => wait(() => { const d=document.querySelector('.prism-screen')?.dataset; return d?.beam==='0.0000' && d?.count==='0' && d?.holding==='false'; });
    await page.goto(`${base}/prism-beam-folder`);
    await wait(()=>!!document.querySelector('.prism-screen')?.dataset.beam);
    assert.equal(await page.locator('.prism-error').count(),0);
    await page.screenshot({path:`${out}/rest.png`});
    assert.equal(await root.getAttribute('data-beam'),'0.0000');
    const box = await folder.boundingBox(); const x=box.x+box.width/2, y=box.y+box.height/2;
    // Outside the folder never opens the beam.
    await page.mouse.click(30,250); await page.waitForTimeout(300);
    assert.equal(await root.getAttribute('data-holding'),'false');
    // Hold, pour, release; all airborne items must land before closing.
    await page.mouse.move(x,y); await page.mouse.down();
    await wait(()=>Number(document.querySelector('.prism-screen').dataset.count)>=2);
    await page.screenshot({path:`${out}/open.png`});
    assert.equal(await root.getAttribute('data-holding'),'true');
    assert(Number(await root.getAttribute('data-items'))>0);
    assert.equal(await root.getAttribute('data-open'),'1.0000');
    await page.mouse.up(); await page.waitForTimeout(100);
    assert.equal(await root.getAttribute('data-beam'),'1.0000');
    assert.equal(await root.getAttribute('data-holding'),'false');
    await rest(); await page.screenshot({path:`${out}/closed.png`});
    // Pointer cancellation must release the active hold.
    await page.mouse.move(x,y); await page.mouse.down(); await page.waitForTimeout(800);
    await folder.dispatchEvent('pointercancel'); await page.mouse.up();
    await wait(()=>document.querySelector('.prism-screen').dataset.holding==='false'); await rest();
    // Keyboard operates the same press and release model.
    await folder.focus(); await page.keyboard.down('Space');
    await wait(()=>document.querySelector('.prism-screen').dataset.beam==='1.0000');
    assert.equal(await folder.getAttribute('aria-pressed'),'true');
    await page.keyboard.up('Space'); await rest();
    // Responsive layouts retain their content and hit target.
    for (const width of [320,768,1440]) {
      await page.setViewportSize({width,height:width===320?667:900}); await page.waitForTimeout(200);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      const h=await page.locator('.prism-header h1').evaluate(el=>({scroll:el.scrollWidth,width:el.clientWidth}));
      assert(h.scroll<=h.width,'Title is clipped');
      await page.screenshot({path:`${out}/width-${width}.png`});
    }
    // Reduced motion is one static frame, with both autoplay and touch disabled.
    const reduced = await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:2,reducedMotion:'reduce'});
    reduced.on('pageerror',e=>errors.push(e.message));
    await reduced.goto(`${base}/prism-beam-folder?autoplay=1`);
    await reduced.waitForFunction(()=>document.querySelector('.prism-screen')?.dataset.reduced==='true' && document.querySelector('.prism-screen')?.dataset.beam==='1.0000');
    const before=await reduced.locator('.prism-screen').evaluate(el=>({...el.dataset}));
    const shot1=await reduced.locator('.prism-beam').screenshot();
    await reduced.waitForTimeout(900);
    const shot2=await reduced.locator('.prism-beam').screenshot();
    assert(shot1.equals(shot2),'Reduced-motion shader must remain static');
    assert.deepEqual(await reduced.locator('.prism-screen').evaluate(el=>({...el.dataset})),before);
    assert.equal(await reduced.getByRole('button').isDisabled(),true);
    assert.equal(await reduced.locator('.prism-hold > span:first-child').evaluate(el=>getComputedStyle(el).display),'none');
    await reduced.screenshot({path:`${out}/reduced-motion.png`});
    // Autoplay reaches nine, closes, clears, then starts its next loop.
    const auto = await browser.newPage({viewport:{width:393,height:852}});
    auto.on('pageerror',e=>errors.push(e.message)); await auto.goto(`${base}/prism-beam-folder?autoplay=1`);
    await auto.waitForFunction(()=>document.querySelector('.prism-screen')?.dataset.count==='9',{},{timeout:15000});
    await auto.screenshot({path:`${out}/autoplay-nine.png`});
    await auto.waitForFunction(()=>{const d=document.querySelector('.prism-screen').dataset;return d.count==='0' && d.beam==='0.0000';},{},{timeout:10000});
    await auto.waitForFunction(()=>document.querySelector('.prism-screen').dataset.open==='1.0000');
    // Touch takes over an open loop without closing or restarting the beam.
    await auto.mouse.move(196,545); await auto.mouse.down(); await auto.waitForTimeout(120);
    assert.equal(await auto.locator('.prism-screen').getAttribute('data-holding'),'true');
    assert.equal(await auto.locator('.prism-screen').getAttribute('data-beam'),'1.0000');
    assert.equal(await auto.locator('.prism-screen').getAttribute('data-open'),'1.0000');
    await auto.mouse.up();
    await auto.waitForFunction(()=>{const d=document.querySelector('.prism-screen').dataset;return d.count==='0' && d.beam==='0.0000';},{},{timeout:12000});
    await auto.waitForFunction(()=>document.querySelector('.prism-screen').dataset.open==='1.0000');
    assert.deepEqual(errors,[]);
    console.log('PASS: runtime shader, hold/pour/release, landings/count/badge, closing, pointer cancellation, keyboard, responsive widths, static Reduced Motion, nine-item autoplay, seamless touch takeover and loop restart. No runtime errors.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1)});
