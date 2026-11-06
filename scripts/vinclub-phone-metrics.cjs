module.exports=phone=>{
   const scroll=phone.querySelector('.lab-scroll'),bottom=phone.querySelector('.lab-bottom').getBoundingClientRect();
   const buttons=[...phone.querySelectorAll('button:not(:disabled)')].filter(b=>b.getClientRects().length&&b.getBoundingClientRect().width>0).map(b=>{const r=b.getBoundingClientRect();return {name:b.getAttribute('aria-label')||b.textContent,width:r.width,height:r.height,visible:r.bottom>0&&r.top<bottom.top};});
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
  };
