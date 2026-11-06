const {chromium}=require('@playwright/test');
const fs=require('fs');const path=require('path');const crypto=require('crypto');
const root=path.resolve('public/reports/vinclub-lab-v3');fs.mkdirSync(path.join(root,'screens'),{recursive:true});
(async()=>{const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));const results=[];let signatures=new Set();
for(let ia=1;ia<=10;ia++)for(let ui=1;ui<=10;ui++){
 const item={ia,ui,checks:{}};await page.goto(`http://localhost:3250/vinclub-ia-lab?ia=${ia}&ui=${ui}&embed=1`);await page.waitForSelector(`[data-ia="IA${String(ia).padStart(2,'0')}"][data-ui="${ui}"]`);
 item.checks.mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
 item.checks.onePrimary=await page.locator('[data-variant="primary"]').count()===1;
 item.checks.homeIndicator=await page.locator('.home-bar').isVisible();
 item.checks.headerSectionsBottom=await page.locator('.phone > div').count()>0 && await page.locator('.phone-bottom').count()===1 && await page.locator('[data-block]').count()>0;
 item.checks.tabsValid=(await page.locator('.phone-tabs button').count())>=4;
 const image=await page.screenshot({path:path.join(root,'screens',`IA${String(ia).padStart(2,'0')}-UI${String(ui).padStart(2,'0')}.png`)});signatures.add(crypto.createHash('sha256').update(image).digest('hex'));
 await page.locator('[data-testid="primary-action"]').click();item.checks.primaryOpensDetail=await page.locator('.detail-section').count()===1;
 await page.setViewportSize({width:1440,height:1000});item.checks.desktopOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);await page.setViewportSize({width:390,height:844});
 item.pass=Object.values(item.checks).every(Boolean);results.push(item);
 if(ui===10)console.log('Captured + checked IA',ia);
}
const flows=[];
for(const [name,needle] of [['points','Điểm sắp hết hạn'],['redeem','Đổi quà bằng điểm'],['ticket','Ngày vui VinWonders'],['bundle','Cuối tuần trọn gói'],['o2o','Đảo Ngọc · tham quan nhà mẫu'],['wallet','Mở ví và nguồn tiền']]){
 await page.goto(`http://localhost:3250/vinclub-ia-lab?ia=2&ui=1&embed=1`);await page.waitForSelector('[data-ia]');
 if(name==='wallet')await page.locator('.phone-tabs button').nth(2).click();
 else{let row=page.getByRole('button',{name:new RegExp(needle)});if(!(await row.count())){await page.locator('.phone-tabs button').nth(1).click();row=page.getByRole('button',{name:new RegExp(needle)});}await row.first().click();}
 let valid=true;
 if(name==='o2o'){valid=await page.getByTestId('primary-action').isDisabled();await page.getByLabel('Thông tin liên hệ',{exact:true}).fill('0901234567');await page.getByRole('checkbox',{name:'Đồng ý chia sẻ thông tin'}).check();valid=valid&&await page.getByTestId('primary-action').isEnabled();}
 if(name==='ticket'){await page.getByLabel('Số lượng vé',{exact:true}).selectOption('2');valid=valid&&(await page.locator('.detail-section').innerText()).includes('400.000');}
 if(['points','wallet'].includes(name)){valid=valid&&await page.locator('.detail-section').count()===1;}else{await page.getByTestId('primary-action').click();valid=valid&&(await page.locator('.detail-section').innerText()).includes('Đã ghi nhận trong bản dùng thử');}flows.push({name,pass:valid});
}
await page.goto('http://localhost:3250/vinclub-ia-lab');await page.waitForSelector('[data-ia]');const matrix=await page.locator('.matrix-cell').count()===100;
const report={generatedAt:new Date().toISOString(),scope:'Automated structural and interaction checks, NOT human usability findings',variants:results.length,uniqueScreens:signatures.size,pass:results.every(r=>r.pass)&&flows.every(r=>r.pass)&&errors.length===0&&matrix&&signatures.size===100,results,flows,matrix100:matrix,pageErrors:errors};fs.writeFileSync(path.join(root,'harness-results.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify({pass:report.pass,variants:report.variants,uniqueScreens:report.uniqueScreens,flows}));if(!report.pass)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
