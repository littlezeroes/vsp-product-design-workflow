const fs = require('fs');
const sharp = require('sharp');
const manifest = JSON.parse(fs.readFileSync(process.argv[2] || 'output/imagegen/daily-icons-v3-manifest.json', 'utf8'));
const paymentFamily=process.argv[3]==='payment';
const travelFamily=process.argv[3]==='travel';
const columns=travelFamily?2:paymentFamily?5:4;
const rows=travelFamily?1:2;
const names=travelFamily?['travel','flight']:paymentFamily?['deposit','transfer','withdraw','scan','bill','insurance','credit','bank','electricity','internet']:['car','food','medical','school','hotel','travel','shopping','payment'];
// Find the main sprite within each cell so neighboring sprites do not leak into exports.
async function spriteBounds(cell) {
  const {data,info}=await sharp(cell).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const seen=new Uint8Array(info.width*info.height);
  let main={count:0};
  const components=[];
  for(let start=0;start<seen.length;start++) {
    if(seen[start]||data[start*4+3]<32)continue;
    const queue=[start];seen[start]=1;
    let minX=info.width,minY=info.height,maxX=0,maxY=0;
    for(let head=0;head<queue.length;head++) {
      const n=queue[head],x=n%info.width,y=Math.floor(n/info.width);
      minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
      const neighbors=[];if(x>0)neighbors.push(n-1);if(x<info.width-1)neighbors.push(n+1);if(y>0)neighbors.push(n-info.width);if(y<info.height-1)neighbors.push(n+info.width);
      for(const next of neighbors)if(!seen[next]&&data[next*4+3]>=32){seen[next]=1;queue.push(next);}
    }
    const component={count:queue.length,minX,minY,maxX,maxY};components.push(component);
    if(queue.length>main.count)main=component;
  }
  if(!main.count)throw Error('Empty sprite cell');
  // Payment symbols can contain detached arrows, QR corners and Wi-Fi arcs.
  if(paymentFamily)for(const part of components){if(part===main||part.count<48||part.minX<3||part.minY<3||part.maxX>info.width-4||part.maxY>info.height-4)continue;main.minX=Math.min(main.minX,part.minX);main.minY=Math.min(main.minY,part.minY);main.maxX=Math.max(main.maxX,part.maxX);main.maxY=Math.max(main.maxY,part.maxY);}
  const left=Math.max(0,main.minX-4),top=Math.max(0,main.minY-4);
  return {left,top,width:Math.min(info.width-1,main.maxX+4)-left+1,height:Math.min(info.height-1,main.maxY+4)-top+1};
}
(async () => {
  for (const {index,path} of manifest) {
    const target = `public/vinclub-assets/${paymentFamily?"payment-icons":"icons-v3"}/${index}`;
    fs.mkdirSync(target, {recursive:true});
    fs.copyFileSync(path, `${target}/${travelFamily?'travel-flight-sheet':'sheet'}.png`);
    const meta = await sharp(path).metadata();
    if (!meta.hasAlpha) throw Error(`Missing alpha: ${index}`);
    await Promise.all(names.map(async (name,i) => {
      const col=i%columns, row=Math.floor(i/columns);
      const left=Math.floor(col*meta.width/columns), top=Math.floor(row*meta.height/rows);
      const width=Math.floor((col+1)*meta.width/columns)-left;
      const height=Math.floor((row+1)*meta.height/rows)-top;
      const cell=await sharp(path).extract({left,top,width,height}).png().toBuffer();
      const bounds=await spriteBounds(cell);
      await sharp(cell).extract(bounds).resize(216,216,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).extend({top:20,bottom:20,left:20,right:20,background:{r:0,g:0,b:0,alpha:0}}).webp({quality:94}).toFile(`${target}/${name}.webp`);
    }));
    console.log(`Saved ${index}: ${names.length} transparent icons`);
  }
})().catch(e => {console.error(e);process.exit(1);});
