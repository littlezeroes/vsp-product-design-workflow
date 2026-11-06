/* eslint-disable @typescript-eslint/no-unused-vars -- Preserve Native Cook's Skia signatures. */
/** Canvas2D translation of the small Skia surface used by the original art.ts. */
type Rect={x:number;y:number;width:number;height:number};
type Color=Float32Array;
type Shader={from:{x:number;y:number};to:{x:number;y:number};colors:Color[]};
const rgba=(c:Color)=>`rgba(${Math.round(c[0]*255)},${Math.round(c[1]*255)},${Math.round(c[2]*255)},${c[3]})`;
export const BlurStyle={Normal:0},ClipOp={Intersect:0},PaintStyle={Stroke:1,Fill:0},TileMode={Clamp:0};
export class SkPaint{
 color:Color=new Float32Array([0,0,0,1]);shader:Shader|null=null;stroke=false;width=1;blur=0;
 setAntiAlias(_v:boolean){} setShader(v:Shader|null){this.shader=v;}setColor(v:Color){this.color=v;}
 setStyle(v:number){this.stroke=v===PaintStyle.Stroke;}setStrokeWidth(v:number){this.width=v;}setMaskFilter(v:number|null){this.blur=v??0;}
}
class Builder{
 path=new Path2D();
 addRRect(r:{rect:Rect;rx:number;ry:number}){this.path.roundRect(r.rect.x,r.rect.y,r.rect.width,r.rect.height,[r.rx]);return this;}
 moveTo(x:number,y:number){this.path.moveTo(x,y);return this;}lineTo(x:number,y:number){this.path.lineTo(x,y);return this;}
 cubicTo(a:number,b:number,c:number,d:number,x:number,y:number){this.path.bezierCurveTo(a,b,c,d,x,y);return this;}
 quadTo(a:number,b:number,x:number,y:number){this.path.quadraticCurveTo(a,b,x,y);return this;}close(){this.path.closePath();return this;}build(){return this.path;}
}
export const Skia={Paint:()=>new SkPaint(),PathBuilder:{Make:()=>new Builder()},Shader:{MakeLinearGradient:(from:Shader['from'],to:Shader['to'],colors:Color[],_positions:null,_mode:number):Shader=>({from,to,colors})},MaskFilter:{MakeBlur:(_style:number,radius:number,_respect:boolean)=>radius}};
export class SkCanvas{
 constructor(private c:CanvasRenderingContext2D){}
 save(){this.c.save();}restore(){this.c.restore();}translate(x:number,y:number){this.c.translate(x,y);}rotate(angle:number,_x:number,_y:number){this.c.rotate(angle*Math.PI/180);}clipPath(p:Path2D,_op:number,_aa:boolean){this.c.clip(p);}
 private draw(path:Path2D,p:SkPaint){const c=this.c;c.save();let fill:string|CanvasGradient=rgba(p.color);if(p.shader){const s=p.shader,g=c.createLinearGradient(s.from.x,s.from.y,s.to.x,s.to.y);s.colors.forEach((color,i)=>g.addColorStop(i/(s.colors.length-1),rgba(color)));fill=g;}c.fillStyle=fill;c.strokeStyle=fill;c.lineWidth=p.width;if(p.blur)c.filter=`blur(${p.blur}px)`;if(p.stroke)c.stroke(path);else c.fill(path);c.restore();}
 drawPath(path:Path2D,p:SkPaint){this.draw(path,p);}drawLine(x:number,y:number,x2:number,y2:number,p:SkPaint){const path=new Path2D();path.moveTo(x,y);path.lineTo(x2,y2);this.draw(path,p);}
 drawRect(r:Rect,p:SkPaint){const path=new Path2D();path.rect(r.x,r.y,r.width,r.height);this.draw(path,p);}
 drawRRect(r:{rect:Rect;rx:number;ry:number},p:SkPaint){const path=new Path2D();path.roundRect(r.rect.x,r.rect.y,r.rect.width,r.rect.height,r.rx);this.draw(path,p);}
 drawOval(r:Rect,p:SkPaint){const path=new Path2D();path.ellipse(r.x+r.width/2,r.y+r.height/2,r.width/2,r.height/2,0,0,Math.PI*2);this.draw(path,p);}
}
