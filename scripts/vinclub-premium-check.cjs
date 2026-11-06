const fs=require('node:fs');const path=require('node:path');
module.exports=async(browser,base,out)=>{
 const results=[],checks=[],errors=[];const ctx=await browser.newContext();const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
 for(const id of ['atlas','daily','dualsurface'])for(const width of [320,390,430]){
  await p.setViewportSize({width,height:844});await p.goto(`${base}/vinclub-premium?solo=1&ia=${id}`,{waitUntil:'domcontentloaded'});await p.locator('[data-phone]').waitFor();
  await p.addStyleTag({content:'.lab-root{visibility:hidden}.lab-phone{visibility:visible;position:fixed;inset:0;width:100vw;height:100dvh;margin:0;border-radius:0;z-index:100}nextjs-portal{display:none}'});
  const images=p.locator('[data-phone] img');for(let i=0;i<await images.count();i++){await images.nth(i).scrollIntoViewIfNeeded();}
  await p.waitForFunction(()=>[...document.querySelectorAll('[data-phone] img')].every(i=>i.complete&&i.naturalWidth>0));
  await p.locator('.lab-scroll').evaluate(el=>el.scrollTop=0);await p.waitForTimeout(700);
  const metrics=await p.locator('[data-phone]').evaluate(require('./vinclub-phone-metrics.cjs'));results.push({id,width,...metrics});
  if(width===390){await p.locator('[data-phone]').screenshot({path:path.join(out,`premium-${id}.png`)});await p.addStyleTag({content:'.lab-phone{position:absolute;inset:auto;left:0;top:0;width:390px;height:auto;min-height:844px}.lab-scroll{overflow:visible;flex:none}.lab-bottom{position:relative}'});await p.locator('[data-phone]').screenshot({path:path.join(out,`premium-${id}-full.png`)});}
 }
 for(const id of ['atlas','daily','dualsurface']){
  await p.setViewportSize({width:1000,height:1100});await p.goto(`${base}/vinclub-premium?solo=1&ia=${id}`);await p.locator('[data-phone]').waitFor();
  await p.getByRole('button',{name:'Mở Học phí',exact:true}).click();await p.getByLabel('Số tiền hoặc điểm').waitFor();await p.getByRole('button',{name:'Đóng tác vụ',exact:true}).click();checks.push({id,task:'Direct mini app entry',passed:true});
  if(id==='daily'){await p.locator('[data-slot=dailyPayment]').getByRole('button',{name:'Payment',exact:true}).click();await p.getByRole('dialog').getByRole('button',{name:'Vay tiền mặt',exact:true}).waitFor();await p.keyboard.press('Escape');checks.push({id,task:'Payment retains four services',passed:true});}
  if(id==='atlas'){await p.getByRole('button',{name:'Mở V-Smart Pay',exact:true}).click();await p.getByRole('dialog').getByRole('button',{name:'Bảo hiểm',exact:true}).waitFor();await p.keyboard.press('Escape');checks.push({id,task:'V-Smart Pay in mini app grid',passed:true});}
  if(id==='dualsurface'){
   await p.getByRole('button',{name:'Hỏi AI · tìm trải nghiệm quanh bạn',exact:true}).click();checks.push({id,task:'AI has no map or 3D',passed:await p.getByRole('dialog').locator('.lab-map,.lab-scene').count()===0});await p.keyboard.press('Escape');
   await p.locator('.lab-spaces').getByRole('button',{name:'Thanh toán',exact:true}).click();await p.locator('[data-slot=payAccount]').waitFor();await p.locator('.lab-spaces').getByRole('button',{name:'Khám phá',exact:true}).click();checks.push({id,task:'Three spaces',passed:await p.locator('[data-phone] [data-module]').count()===2});
  }
 }
 await ctx.close();const report={date:new Date().toISOString(),results,checks,errors};fs.writeFileSync(path.join(out,'premium-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 if(errors.length||checks.some(c=>!c.passed)||results.some(r=>r.scrollOverflow||r.smallTargets.length||r.contrastFailures.length))throw new Error('Premium QA findings — see premium-qa.json');
};
