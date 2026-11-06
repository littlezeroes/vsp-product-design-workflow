const {chromium}=require('@playwright/test');
const names=['deposit','transfer','withdraw','scan','bill','insurance','credit','bank','electricity','internet'];
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:1100}});
 const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});
 await page.goto('http://localhost:3000/vinclub-dualsurface',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!document.querySelector('iframe')?.contentDocument?.querySelector('.ds-spaces'));
 await page.waitForTimeout(1600);
 const frame=page.frameLocator('iframe');
 await frame.getByRole('button',{name:'Thanh toán',exact:true}).first().click();
 await frame.locator('.ds-payment-shortcuts img').first().waitFor();
 const palette=await frame.locator('.ds-payment-theme').first().evaluate(el=>({background:getComputedStyle(el).backgroundColor,foreground:getComputedStyle(el).color}));
 if(!palette.background.match(/rgb\((8|18), (8|18), (8|18)\)/))throw Error(`Payment is not black: ${palette.background}`);
 await frame.getByRole('button',{name:'Ẩn số dư',exact:true}).click();
 if(!(await frame.locator('.ds-payment-amount').textContent()).includes('••'))throw Error('Hide balance failed');
 await frame.getByRole('button',{name:'Hiện số dư',exact:true}).click();
 await frame.getByRole('button',{name:'Tài khoản của tôi',exact:true}).click();
 await frame.locator('.ds-account-sheet').waitFor();
 await frame.locator('.ds-account-sheet').getByRole('button',{name:'Đóng',exact:true}).click();
 await page.getByRole('button',{name:/Config icon/}).click();
 await page.locator('.icon-config-choice').first().waitFor();
 for(let i=0;i<10;i++){
  await page.locator('.icon-config-choice').nth(i).click();
  await frame.locator(`.ds-payment-shortcuts img[data-approach="${i}"]`).first().waitFor();
  await page.waitForFunction(id=>{const images=Array.from(document.querySelector('iframe').contentDocument.querySelectorAll('.ds-payment-shortcuts img'));return images.length===8&&images.every(img=>Number(img.dataset.approach)===id&&img.complete&&img.naturalWidth>0);},i);
  for(const name of names){const response=await page.request.get(`http://localhost:3000/vinclub-assets/payment-icons/${i}/${name}.webp`);if(!response.ok())throw Error(`Missing ${i}/${name}`);}
 }
 await page.locator('.icon-config-choice').nth(1).click();
 await page.getByRole('button',{name:/Config icon/}).click();
 await frame.locator('.ds-payment-balance').scrollIntoViewIfNeeded();
 await page.waitForTimeout(250);
 await page.screenshot({path:'output/vinclub-payment-black.png',fullPage:true});
 await frame.locator('.ds-payment-sheet').scrollIntoViewIfNeeded();
 await page.screenshot({path:'output/vinclub-payment-black-transactions.png',fullPage:true});
 console.log({palette,options:10,assets:100,hideBalance:'passed',accounts:'passed',errors});
 await browser.close();if(errors.length)throw Error(errors.join('\n'));
})().catch(e=>{console.error(e);process.exit(1)});
