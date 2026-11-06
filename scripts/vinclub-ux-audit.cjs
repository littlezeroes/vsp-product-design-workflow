const fs=require('node:fs');const path=require('node:path');
module.exports=async function(browser,base,out){
 const results=[];const errors=[];const checks=[];
 const ctx=await browser.newContext();const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const id of ['atlas','daily','dualsurface'])for(const width of [320,390,430])for(const visual of (width===390?['wire','metal','glass','spatial','concierge','luminous']:['wire'])){
  await page.setViewportSize({width,height:844});await page.goto(`${base}/vinclub-lab?solo=1&ia=${id}&stage=${visual==='wire'?'wireframe':'visual'}&visual=${visual==='wire'?'metal':visual}`);await page.locator(`[data-phone][data-ia=${id}]`).waitFor();
  await page.addStyleTag({content:'.lab-root{visibility:hidden}.lab-phone{visibility:visible;position:fixed;inset:0;width:100vw;height:100dvh;margin:0;border-radius:0;z-index:100} nextjs-portal{display:none}'});
  const m=await page.locator('[data-phone]').evaluate(phone=>{
   const scroll=phone.querySelector('.lab-scroll'),bottom=phone.querySelector('.lab-bottom').getBoundingClientRect();
   const buttons=[...phone.querySelectorAll('button:not(:disabled)')].map(b=>{const r=b.getBoundingClientRect();return {name:b.getAttribute('aria-label')||b.textContent,width:r.width,height:r.height,visible:r.bottom>0&&r.top<bottom.top};});
   const apps=[...phone.querySelectorAll('.lab-direct-app')].map(b=>{const r=b.getBoundingClientRect();return {name:b.textContent,fullyVisible:r.bottom<=bottom.top&&r.top>=0}});
   const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');
   const rgba=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].map((v,i)=>i===3?v/255:v/255);};
   const blend=(front,back)=>front.slice(0,3).map((v,i)=>v*front[3]+back[i]*(1-front[3]));
   const luminance=c=>c.reduce((s,v,i)=>s+[.2126,.7152,.0722][i]*(v<=.04045?v/12.92:((v+.055)/1.055)**2.4),0);
   const contrastFailures=[];let contrastChecked=0,gradientExcluded=0;
   for(const node of phone.querySelectorAll('p,h3,h4,button > span:not([aria-hidden])')){
    if(!node.textContent.trim()||node.closest('button:disabled'))continue;
    let bg=[1,1,1],gradient=false;const chain=[];let parent=node;
    while(parent&&parent!==phone.parentElement){chain.unshift(parent);parent=parent.parentElement;}
    for(const el of chain){const st=getComputedStyle(el);if(st.backgroundImage!=='none')gradient=true;bg=blend(rgba(st.backgroundColor),bg);}
    const button=node.closest('button');if(button){const fill=button.querySelector('span[aria-hidden]');if(fill)bg=blend(rgba(getComputedStyle(fill).backgroundColor),bg);}
    if(gradient){gradientExcluded++;continue;}
    const st=getComputedStyle(node);const fg=blend(rgba(st.color),bg);const a=luminance(fg),b=luminance(bg);const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);const large=parseFloat(st.fontSize)>=24||(parseFloat(st.fontSize)>=18.66&&Number(st.fontWeight)>=700);const required=large?3:4.5;contrastChecked++;
    if(ratio+.01<required)contrastFailures.push({text:node.textContent.slice(0,70),ratio:Number(ratio.toFixed(2)),required});
   }
   return {contrastChecked,gradientExcluded,contrastFailures,phoneWidth:phone.getBoundingClientRect().width,scrollOverflow:scroll.scrollWidth>scroll.clientWidth+1,smallTargets:buttons.filter(b=>b.width<44||b.height<44),appsAboveFold:apps.filter(a=>a.fullyVisible).length,miniAppCount:apps.length};
  });results.push({id,width,visual,...m});
  if(width===390&&visual==='wire')await page.locator('[data-phone]').screenshot({path:path.join(out,`ux-${id}-390.png`)});
 }
 // Concrete tasks, not synthetic preferences.
 for(const id of ['atlas','daily','dualsurface']){
  await page.setViewportSize({width:430,height:1000});await page.goto(`${base}/vinclub-lab?solo=1&ia=${id}&stage=wireframe`);await page.locator('[data-phone]').waitFor();
  await page.getByRole('button',{name:'Mở Gọi xe',exact:true}).click();
  checks.push({id,task:'Gọi xe does not show amount form',passed:await page.getByLabel('Số tiền hoặc điểm').count()===0});
  await page.getByRole('button',{name:'Đóng tác vụ',exact:true}).click();
  const entry=page.getByRole('button',{name:'Mở Gọi xe',exact:true});await entry.click();
  await page.keyboard.press('Escape');checks.push({id,task:'Escape closes dialog and restores entry focus',passed:await page.getByRole('dialog').count()===0&&await entry.evaluate(el=>el===document.activeElement)});
  await page.getByRole('button',{name:'Mở Học phí',exact:true}).click();
  checks.push({id,task:'Học phí reaches payment demo',passed:await page.getByLabel('Số tiền hoặc điểm').count()===1});
  await page.getByRole('button',{name:'Đóng tác vụ',exact:true}).click();
  if(id==='daily'){
   await page.locator('[data-slot=dailyPayment]').getByRole('button',{name:'Payment',exact:true}).click();
   checks.push({id,task:'Visible Payment entry opens four V-Smart Pay services',passed:await page.getByRole('dialog').getByRole('button',{name:'Vay tiền mặt',exact:true}).count()===1});
   await page.keyboard.press('Escape');
   const order=await page.locator('[data-phone] .lab-scroll > [data-slot]').evaluateAll(ns=>ns.map(n=>n.dataset.slot));
   checks.push({id,task:'Small VPoint above AI; Payment before mini app grid',passed:order.indexOf('dailyIdentity')<order.indexOf('aiHero')&&order.indexOf('dailyPayment')<order.indexOf('directApps')});
  }
  if(id==='dualsurface'){
   await page.getByRole('button',{name:'Hỏi AI · tìm trải nghiệm quanh bạn',exact:true}).click();
   checks.push({id,task:'Balanced AI has no map or 3D',passed:await page.getByRole('dialog').locator('.lab-map,.lab-scene').count()===0});await page.keyboard.press('Escape');
   await page.getByRole('button',{name:'Thẻ của tôi',exact:true}).click();
   checks.push({id,task:'Membership entry opens membership, not point payment',passed:await page.getByRole('dialog',{name:'Thẻ hội viên',exact:true}).count()===1&&await page.getByLabel('Số tiền hoặc điểm').count()===0});
   await page.keyboard.press('Escape');
   await page.locator('.lab-spaces').getByRole('button',{name:'Khám phá',exact:true}).click();
   const modules=await page.locator('[data-phone] .lab-scroll > [data-slot]').evaluateAll(ns=>ns.map(n=>n.dataset.slot));
   checks.push({id,task:'Khám phá only vouchers and services',passed:modules.length===2&&modules[0]==='vouchers'&&modules[1]==='apps'});
   await page.locator('[data-phone]').screenshot({path:path.join(out,'ux-balanced-explore.png')});
   await page.locator('.lab-spaces').getByRole('button',{name:'Thanh toán',exact:true}).click();
   checks.push({id,task:'Payment tab prioritizes wallet money',passed:await page.locator('[data-slot=payAccount]').count()===1});
   checks.push({id,task:'V-Smart Pay has no ecosystem mini-app grid',passed:await page.locator('[data-phone] .lab-direct-app').count()===0});
   await page.locator('[data-phone]').screenshot({path:path.join(out,'ux-balanced-pay.png')});
  }
  if(id==='atlas'||id==='daily'){
   const slots=await page.locator('[data-phone] .lab-scroll > [data-slot]').evaluateAll(ns=>ns.map(n=>n.dataset.slot));
   checks.push({id,task:'Voucher list is the last Home section',passed:slots.at(-1)==='voucherList'});
   if(id==='atlas'){
    await page.getByRole('button',{name:'Mở V-Smart Pay',exact:true}).click();
    checks.push({id,task:'V-Smart Pay is a mini app with financial services',passed:await page.getByRole('dialog').getByRole('button',{name:'Vay tiền mặt',exact:true}).count()===1});await page.keyboard.press('Escape');
   }else{
    await page.getByRole('button',{name:'Gợi ý dịch vụ',exact:true}).click();checks.push({id,task:'AI opens separately from Map',passed:await page.getByRole('dialog').locator('.lab-map').count()===0});await page.keyboard.press('Escape');
   }
  }
  if(id==='atlas'){
   await page.getByRole('button',{name:'Danh sách',exact:true}).click();
   checks.push({id,task:'Map has equivalent place list',passed:await page.locator('.lab-map-list').getByRole('button').count()===3});
  }
 }
 await ctx.close();const report={date:new Date().toISOString(),method:'Desktop Chromium mobile viewports with isolated phone preview; no user participants',results,checks,errors};
 fs.writeFileSync(path.join(out,'ux-audit.json'),JSON.stringify(report,null,2));require('./vinclub-ux-report.cjs')(out);console.log(JSON.stringify({cases:results.length,overflow:results.filter(x=>x.scrollOverflow).map(x=>[x.id,x.width,x.visual]),smallTargets:results.filter(x=>x.smallTargets.length).map(x=>[x.id,x.width,x.visual,x.smallTargets]),contrast:results.filter(x=>x.contrastFailures.length).map(x=>[x.id,x.visual,x.contrastFailures]),fold:results.filter(x=>x.visual==='wire').map(x=>[x.id,x.width,x.appsAboveFold]),checks,errors},null,2));if(results.some(x=>x.scrollOverflow||x.smallTargets.length||x.contrastFailures.length)||checks.some(x=>!x.passed)||errors.length)throw new Error("UX audit failed; inspect ux-audit.json");return report;
};
