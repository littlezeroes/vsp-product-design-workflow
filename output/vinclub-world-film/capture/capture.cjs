// Fresh capture of /vinclub-dualsurface + /vinclub-duo for "Cả thế giới trong tay bạn".
// Rule: top-level surfaces + 3D showcases only. No bottom sheets, no deep buttons (bills, checkout…).
// Usage: node capture.cjs [clipId,clipId]
const {chromium}=require('/Users/huykieu/Documents/vsp-ui/node_modules/@playwright/test');
const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const ROOT=path.resolve(__dirname,'..'),RAW=path.join(ROOT,'capture/raw'),CLIPS=path.join(ROOT,'clips');
const BASE='http://localhost:3000';
const only=process.argv[2]?process.argv[2].split(','):null;
const manifestFile=path.join(CLIPS,'manifest.json');
const manifest=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile)):{};

const TAP_CSS=`nextjs-portal{display:none!important}
@keyframes wf-ring{0%{opacity:.95;transform:translate(-50%,-50%) scale(.4)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.9)}}
@keyframes wf-dot{0%{opacity:.9;transform:translate(-50%,-50%) scale(1)}60%{opacity:.75;transform:translate(-50%,-50%) scale(.82)}100%{opacity:0;transform:translate(-50%,-50%) scale(.7)}}
.wf-ring,.wf-dot{position:fixed;border-radius:50%;pointer-events:none;z-index:2147483647}
.wf-ring{width:46px;height:46px;border:2px solid rgba(255,255,255,.95);box-shadow:0 0 0 1px rgba(0,0,0,.18),0 6px 18px rgba(0,0,0,.18);animation:wf-ring .75s cubic-bezier(.2,.7,.2,1) forwards}
.wf-dot{width:30px;height:30px;background:rgba(255,255,255,.55);backdrop-filter:blur(2px);box-shadow:0 0 0 1px rgba(0,0,0,.12);animation:wf-dot .6s ease-out forwards}`;

async function session(browser,{viewport,dpr=2,url}){
  const ctx=await browser.newContext({viewport,deviceScaleFactor:dpr});
  const p=await ctx.newPage();p.setDefaultTimeout(20000);
  const cdp=await ctx.newCDPSession(p);
  {const {windowId}=await cdp.send('Browser.getWindowForTarget');await cdp.send('Browser.setWindowBounds',{windowId,bounds:{width:viewport.width+220,height:viewport.height+200}});}
  const s={p,ctx,cdp,viewport,dpr};
  s.wait=n=>p.waitForTimeout(n);
  s.btn=(n,scope=p)=>scope.getByRole('button',{name:n,exact:true}).first();
  s.prepare=async()=>{await p.addStyleTag({content:TAP_CSS});await p.evaluate(()=>document.fonts.ready)};
  s.ripple=async(x,y)=>p.evaluate(({x,y})=>{for(const c of['wf-ring','wf-dot']){const d=document.createElement('div');d.className=c;d.style.left=x+'px';d.style.top=y+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),800)}},{x,y});
  s.tap=async(l,opts={})=>{await l.scrollIntoViewIfNeeded();const b=await l.boundingBox();const x=b.x+(opts.dx??b.width/2),y=b.y+(opts.dy??b.height/2);await s.ripple(x,y);await s.wait(170);await p.mouse.click(x,y);};
  s.drag=async(l,from,to,steps=40)=>{const b=await l.boundingBox();const a=[b.x+b.width*from[0],b.y+b.height*from[1]],z=[b.x+b.width*to[0],b.y+b.height*to[1]];await s.ripple(...a);await p.mouse.move(...a);await p.mouse.down();for(let i=1;i<=steps;i++){const t=i/steps,e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;await p.mouse.move(a[0]+(z[0]-a[0])*e,a[1]+(z[1]-a[1])*e);await s.wait(16)}await p.mouse.up();};
  s.scroll=async(sel,to,ms=1400)=>p.evaluate(({sel,to,ms})=>new Promise(r=>{const e=document.querySelector(sel);const from=e.scrollTop,t0=performance.now();const f=n=>{const t=Math.min(1,(n-t0)/ms),k=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;e.scrollTop=from+(to-from)*k;t<1?requestAnimationFrame(f):r()};requestAnimationFrame(f)}),{sel,to,ms});
  s.type=async(l,text)=>{await l.click();await l.fill('');for(const ch of text){await p.keyboard.type(ch);await s.wait(42+Math.random()*40)}};
  // Records `seconds` of the page via CDP screencast while running `action`.
  s.clip=async(id,seconds,action,crop)=>{
    if(only&&!only.includes(id)){return}
    const dir=path.join(RAW,id);fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
    const frames=[];let t0=null;
    const onFrame=async({data,metadata,sessionId})=>{const ts=metadata.timestamp;if(t0===null)t0=ts;const f=path.join(dir,String(frames.length).padStart(5,'0')+'.jpg');fs.writeFileSync(f,Buffer.from(data,'base64'));frames.push({f,at:ts-t0});cdp.send('Page.screencastFrameAck',{sessionId}).catch(()=>{})};
    cdp.on('Page.screencastFrame',onFrame);
    await cdp.send('Page.startScreencast',{format:'jpeg',quality:92,maxWidth:6000,maxHeight:6000,everyNthFrame:1});
    const start=Date.now();let err;
    // Nudge a repaint so the first frame arrives immediately.
    await p.evaluate(()=>{const d=document.createElement('i');d.style.cssText='position:fixed;width:1px;height:1px;opacity:.01;left:0;top:0';document.body.appendChild(d);setTimeout(()=>d.remove(),60)});
    try{await s.wait(500);if(action)await action();const left=seconds*1000-(Date.now()-start);if(left>0)await s.wait(left)}catch(e){err=e}
    await p.evaluate(()=>{const d=document.createElement('i');d.style.cssText='position:fixed;width:1px;height:1px;opacity:.01;left:0;top:0';document.body.appendChild(d);setTimeout(()=>d.remove(),60)});await s.wait(120);
    await cdp.send('Page.stopScreencast');cdp.off('Page.screencastFrame',onFrame);
    const total=(Date.now()-start)/1000;
    frames.sort((a,b)=>a.at-b.at);if(!frames.length)throw Error('no frames '+id);
    const list=frames.map((fr,i)=>`file '${fr.f}'\nduration ${Math.max(.001,(i+1<frames.length?frames[i+1].at:total)-fr.at).toFixed(4)}`).join('\n')+`\nfile '${frames.at(-1).f}'\n`;
    fs.writeFileSync(path.join(dir,'list.txt'),list);
    crop=crop||{x:0,y:0,w:viewport.width*dpr,h:viewport.height*dpr};
    const vf=[`crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`,'fps=30','scale=trunc(iw/2)*2:trunc(ih/2)*2'].filter(Boolean).join(',');
    const out=path.join(CLIPS,id+'.mp4');
    const r=spawnSync('ffmpeg',['-y','-v','error','-f','concat','-safe','0','-i',path.join(dir,'list.txt'),'-vf',vf,'-c:v','libx264','-preset','slow','-crf','14','-pix_fmt','yuv420p',out],{encoding:'utf8'});
    if(r.status)throw Error(r.stderr);
    manifest[id]={file:id+'.mp4',seconds:+total.toFixed(2),frames:frames.length};fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2));
    console.log('✓',id,frames.length,'frames',total.toFixed(1)+'s',err?'(ERR '+err.message.split('\n')[0]+')':'');
    if(err)throw err;
  };
  if(url){await p.goto(url)}
  return s;
}

(async()=>{
  fs.mkdirSync(CLIPS,{recursive:true});
  const browser=await chromium.launch({channel:'chrome',args:['--enable-webgl','--force-device-scale-factor=2','--ignore-gpu-blocklist','--enable-gpu-rasterization','--autoplay-policy=no-user-gesture-required','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  try{
    // ── Phone app ───────────────────────────────────────────────
    if(!only||only.some(x=>!x.startsWith('duo'))){const s=await session(browser,{viewport:{width:390,height:844}});
    const {p,btn,tap,wait}=s;
    const tab=n=>p.locator('.ds-spaces').getByRole('button',{name:n,exact:true});
    const nav=n=>p.locator('.ds-bottom').getByRole('button',{name:n,exact:true});
    await p.goto(BASE+'/vinclub-dualsurface/ui',{waitUntil:'commit'});
    await s.clip('splash',4.6,async()=>{await p.locator('.vc-gold-splash').waitFor({state:'detached',timeout:15000})});
    await p.locator('.vc-gold-splash').waitFor({state:'detached'});
    await s.prepare();await wait(600);
    await s.clip('home',6.5,async()=>{await wait(900);await s.scroll('.ds-scroll',420,1900);await wait(1100);await s.scroll('.ds-scroll',0,1500)});
    await s.clip('card',8,async()=>{await tap(p.locator('.ds-hero-card'),{dx:40,dy:24});await wait(1800);const r=btn('Phát animation');if(await r.count())await tap(r);await wait(2600)});
    await tap(btn('Quay lại Home'));await wait(900);
    await s.clip('vinpay',5.5,async()=>{await tap(tab('VinPay'));await wait(2200);await s.scroll('.ds-scroll',240,1400)});
    await s.scroll('.ds-scroll',0,10);
    await s.clip('vinlife',6.5,async()=>{await tap(tab('VinLife'));await wait(2600);await s.scroll('.ds-scroll',330,1600)});
    await s.scroll('.ds-scroll',0,10);await tap(tab('VinClub'));await wait(1200);
    await s.clip('ai',11,async()=>{await tap(p.locator('.ds-ai'));await wait(1500);const box=p.locator('.vc-ai-chat textarea, .vc-ai-chat input').first();await s.type(box,'Có ưu đãi nào dành cho tôi hôm nay?');await wait(350);await tap(btn('Gửi tin nhắn'));await wait(4200)});
    await s.clip('ai-voice',5,async()=>{await tap(btn('Nói với AI'));await wait(3200)});
    const stop=btn('Dừng ghi âm');if(await stop.count())await tap(stop);
    await p.goto(BASE+'/vinclub-dualsurface/ui');await p.locator('.vc-gold-splash').waitFor({state:'detached'});await s.prepare();await wait(500);
    await s.clip('explore',8,async()=>{await tap(nav('Trải nghiệm'));await p.locator('.dx-map canvas').waitFor({timeout:30000});await wait(4200)});
    await s.clip('vincom',10,async()=>{await tap(p.locator('.dx-map button[data-place-id=vincom]'));await wait(2600);await tap(btn('Xoay khám phá điểm đến'));await wait(1500);await s.drag(p.locator('.dx-map canvas'),[.72,.5],[.28,.56],55);await wait(1500)});
    const sj=p.locator('.sj-root');
    await s.clip('showroom',8,async()=>{await tap(btn('Xem showroom 3D'));await wait(2600);await tap(btn('Tầng 2 · Technology',sj));await wait(1800);await tap(btn('Tầng 1 · Lifestyle',sj))});
    await s.clip('store',6,async()=>{await tap(sj.getByRole('button',{name:/^Mây Studio/}).first());await wait(1500)});
    await s.clip('product',7.5,async()=>{await tap(btn('Xem sản phẩm',sj));await wait(2600);await tap(btn('Xám sương',sj));await wait(1700);await tap(btn('Trắng ngà',sj))});
    await s.clip('explode',6,async()=>{await tap(btn('Khám phá cấu tạo',sj));await wait(2800);await tap(btn('Lắp lại',sj))});
    await s.clip('cart',4,async()=>{await tap(sj.getByRole('button',{name:/^Thêm vào giỏ/}).first())});
    await tap(btn('Đóng mua sắm'));await wait(800);
    await s.clip('offers',5.5,async()=>{await tap(nav('Ưu đãi'));await wait(2200);await s.scroll('.ds-scroll',300,1500)});
    await s.ctx.close();}

    // ── VinClub Duo (foldable) ─────────────────────────────────
    const d=await session(browser,{viewport:{width:1000,height:1000},dpr:2});
    await d.p.goto(BASE+'/vinclub-duo');await d.wait(6000);await d.prepare();
    await d.p.addStyleTag({content:'.duo-heading,.duo-controls{visibility:hidden!important}body{background:#fff}'});
    const rig=await d.p.locator('.duo-stage').boundingBox();
    const crop={x:0,y:Math.max(0,Math.round((rig.y-30)*2)),w:2000,h:Math.round(Math.min(rig.height+60,1000-rig.y+30)*2)};crop.h-=crop.h%2;console.log('rig',rig);
    const ctl=n=>d.p.locator('.duo-controls button',{hasText:n}).first();
    await d.clip('duo-points',7,async()=>{await ctl('Tích điểm 3D').evaluate(e=>e.click());await d.wait(5500)},crop);
    await d.clip('duo-open',8,async()=>{await ctl('Mở điện thoại').evaluate(e=>e.click());await d.wait(5200)},crop);
    await d.clip('duo-fold',5,async()=>{await ctl('Gập điện thoại').evaluate(e=>e.click());await d.wait(2600)},crop);
    await d.ctx.close();
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
