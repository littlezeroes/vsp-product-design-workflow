/** Stylized Earth texture for the cinematic navigation transition. */
export function globeTexture(ocean:string,land:string,cloud:string) {
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1024;
  const ctx=canvas.getContext('2d')!;ctx.fillStyle=ocean;ctx.fillRect(0,0,2048,1024);
  const continents=[
    [[-168,68],[-140,72],[-120,58],[-105,52],[-82,50],[-60,56],[-52,45],[-80,25],[-98,17],[-110,28],[-124,42],[-151,58]],
    [[-81,12],[-65,10],[-48,-4],[-35,-8],[-43,-24],[-54,-39],[-68,-55],[-75,-32],[-80,-5]],
    [[-18,35],[8,37],[35,30],[52,12],[40,-12],[28,-34],[17,-35],[8,-12],[-8,5],[-17,20]],
    [[-10,36],[-10,58],[18,70],[42,66],[70,75],[120,72],[170,60],[150,46],[128,38],[120,20],[105,8],[90,22],[78,8],[68,25],[42,30],[30,45],[16,40]],
    [[112,-12],[135,-11],[153,-24],[145,-39],[122,-35],[113,-25]],
    [[-52,60],[-44,82],[-24,80],[-20,68]],[[45,-13],[50,-15],[49,-26],[44,-23]],
    [[130,33],[142,43],[146,42],[138,33]],[[95,5],[110,-6],[130,-8],[140,-5],[118,0]],
  ];
  for(const polygon of continents){ctx.beginPath();polygon.forEach(([lon,lat],i)=>{const x=(lon+180)/360*2048,y=(90-lat)/180*1024;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});ctx.closePath();ctx.fillStyle=land;ctx.fill();}
  // Fine atmospheric bands soften the globe without hiding geography.
  ctx.globalAlpha=.16;ctx.strokeStyle=cloud;ctx.lineWidth=5;
  for(let i=0;i<44;i++){ctx.beginPath();for(let x=0;x<=2048;x+=16){const y=130+i*18+Math.sin(x*.006+i*1.9)*19;if(x)ctx.lineTo(x,y);else ctx.moveTo(x,y);}ctx.stroke();}
  ctx.globalAlpha=.6;ctx.fillStyle=cloud;ctx.fillRect(0,0,2048,40);ctx.fillRect(0,974,2048,50);ctx.globalAlpha=1;
  return canvas;
}
