// node render.cjs stills 1,5,14.5          → review/stills/t*.jpg
// node render.cjs video [workers=4]         → build/picture.mp4 (30fps, 1920x1080)
const {chromium}=require('/Users/huykieu/Documents/vsp-ui/node_modules/@playwright/test');
const {spawn,spawnSync}=require('child_process');const fs=require('fs'),path=require('path');
const ROOT=__dirname,FPS=30;
const mode=process.argv[2]||'stills';

async function open(browser){
  const ctx=await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  const p=await ctx.newPage();
  p.on('pageerror',e=>console.log('PAGEERR',e.message));
  p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
  await p.goto('file://'+path.join(ROOT,'comp/index.html'));
  await p.evaluate(()=>window.ready);
  return p;
}
async function renderRange(browser,from,to,out,tag){
  const p=await open(browser);
  const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','image2pipe','-framerate',String(FPS),'-i','-','-c:v','libx264','-preset','medium','-crf','15','-pix_fmt','yuv420p',out],{stdio:['pipe','inherit','inherit']});
  const t0=Date.now();
  for(let f=from;f<to;f++){
    await p.evaluate(t=>window.renderFrame(t),f/FPS);
    const buf=await p.screenshot({type:'jpeg',quality:94});
    if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
    if((f-from)%150===0)console.log(tag,'frame',f,'/',to,((Date.now()-t0)/1000).toFixed(0)+'s');
  }
  ff.stdin.end();await new Promise(r=>ff.on('close',r));await p.close();
}
(async()=>{
  const browser=await chromium.launch({channel:'chrome',args:['--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required']});
  try{
    if(mode==='stills'){
      const p=await open(browser);const dir=path.join(ROOT,'review/stills');fs.mkdirSync(dir,{recursive:true});
      for(const t of process.argv[3].split(',').map(Number)){await p.evaluate(t=>window.renderFrame(t),t);await p.screenshot({path:`${dir}/t${t.toFixed(2)}.jpg`,type:'jpeg',quality:80})}
    }else{
      const workers=+(process.argv[3]||4);const total=await (await open(browser)).evaluate(()=>window.TOTAL);
      const N=Math.round(total*FPS),chunk=Math.ceil(N/workers);fs.mkdirSync(path.join(ROOT,'build'),{recursive:true});
      const parts=[];await Promise.all([...Array(workers)].map((_,i)=>{const a=i*chunk,b=Math.min(N,a+chunk);const out=path.join(ROOT,`build/part${i}.mp4`);parts.push(out);return renderRange(browser,a,b,out,'w'+i)}));
      fs.writeFileSync(path.join(ROOT,'build/parts.txt'),parts.sort().map(f=>`file '${f}'`).join('\n'));
      const r=spawnSync('ffmpeg',['-y','-v','error','-f','concat','-safe','0','-i',path.join(ROOT,'build/parts.txt'),'-c','copy',path.join(ROOT,'build/picture.mp4')]);
      if(r.status)throw Error(String(r.stderr));console.log('picture done');
    }
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
