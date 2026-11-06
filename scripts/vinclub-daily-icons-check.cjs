const {chromium}=require('@playwright/test');
const names=['car','food','medical','school','hotel','travel','flight','shopping','payment'];
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:1100}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const version of ['daily','dualsurface']){
  await page.goto(`http://localhost:3000/vinclub-${version}`,{waitUntil:"domcontentloaded"});
  await page.waitForFunction(()=>!!document.querySelector('iframe')?.contentDocument?.querySelector('img[data-approach]'));
  await page.waitForTimeout(1600);
  await page.getByRole('button',{name:/Config icon/}).click();
  await page.locator('.icon-config-choice').first().waitFor();
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('.icon-config img')).every(img=>img.complete&&img.naturalWidth>0));
  const frame=page.frameLocator('iframe');
  const choices=page.locator('.icon-config-choice');
  if(await choices.count()!==10)throw Error(`${version}: expected 10 choices`);
  for(let i=0;i<10;i++){
   await choices.nth(i).click();
   await frame.locator(`img[data-approach="${i}"]`).first().waitFor();
   await page.waitForFunction(()=>(()=>{const img=document.querySelector('iframe').contentDocument.querySelector('img[data-approach]');return img?.complete&&img.naturalWidth>0;})());
   for(const name of names){const response=await page.request.get(`http://localhost:3000/vinclub-assets/icons-v3/${i}/${name}.webp`);if(!response.ok())throw Error(`Missing ${i}/${name}`);}
  }
  await choices.nth(1).click();await page.waitForTimeout(400);
  await page.screenshot({path:`output/vinclub-${version}-icons-v3.png`,fullPage:true});
  await page.getByRole('button',{name:/Config icon/}).click();
  if(version==='daily')await frame.getByRole('button',{name:'Thanh toán',exact:true}).first().click();
  await frame.locator(version==='daily'?'.daily-service-grid':'.ds-services').scrollIntoViewIfNeeded();
  await page.screenshot({path:`output/vinclub-${version}-icons-v3-services.png`,fullPage:true});
  console.log(`${version}: 10 choices, 90 assets, iframe switching passed`);
 }
 await browser.close();if(errors.length)throw Error(errors.join('\n'));
})().catch(e=>{console.error(e);process.exit(1)});
