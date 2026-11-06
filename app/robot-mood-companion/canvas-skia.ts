/* eslint-disable @typescript-eslint/no-unused-vars -- Keep the original Skia call signatures. */
/** Small Canvas2D bridge for the original Native Cook drawing commands. */
export const BlurStyle = { Normal: 0 };
export const PaintStyle = { Stroke: 'stroke' };
export const StrokeCap = { Round: 'round' as CanvasLineCap };
type Rect = { x: number; y: number; width: number; height: number; radius?: number };
class Paint {
 color = '#000'; alpha = 1; stroke = false; width = 1; cap: CanvasLineCap = 'butt'; blur = 0;
 setAntiAlias(_value: boolean) { /* Canvas2D antialiases paths. */ }
 setColor(value: string) { this.color = value; }
 setAlphaf(value: number) { this.alpha = value; }
 setMaskFilter(value: number) { this.blur = value; }
 setStyle(_value: string) { this.stroke = true; }
 setStrokeWidth(value: number) { this.width = value; }
 setStrokeCap(value: CanvasLineCap) { this.cap = value; }
}
class Path {
 native = new Path2D();
 moveTo(x:number,y:number) { this.native.moveTo(x,y); }
 lineTo(x:number,y:number) { this.native.lineTo(x,y); }
 addRect(r: Rect) { this.native.rect(r.x,r.y,r.width,r.height); }
 addArc(r: Rect,start:number,sweep:number) { this.native.ellipse(r.x+r.width/2,r.y+r.height/2,r.width/2,r.height/2,0,start*Math.PI/180,(start+sweep)*Math.PI/180); }
 quadTo(cx:number,cy:number,x:number,y:number) { this.native.quadraticCurveTo(cx,cy,x,y); }
 close() { this.native.closePath(); }
}
export const Skia = {
 Paint: () => new Paint(), Color: (value: string) => value,
 MaskFilter: { MakeBlur: (_style: number, radius: number, _respect: boolean) => radius },
 Path: { Make: () => new Path() },
 XYWHRect: (x: number,y: number,width: number,height: number): Rect => ({x,y,width,height}),
 RRectXY: (r: Rect, rx: number, _ry: number): Rect => ({...r,radius:rx}),
};
export class SkImage {
 constructor(public image: HTMLImageElement) {}
 width() { return this.image.naturalWidth; }
 height() { return this.image.naturalHeight; }
}
export class SkCanvas {
 constructor(private c: CanvasRenderingContext2D) {}
 save() { this.c.save(); } restore() { this.c.restore(); }
 translate(x: number,y: number) { this.c.translate(x,y); }
 rotate(degrees: number,_x: number,_y: number) { this.c.rotate(degrees*Math.PI/180); }
 clipPath(path: Path,_op: number,_aa: boolean) { this.c.clip(path.native); }
 clipRRect(r: Rect,_op: number,_aa: boolean) { const p=new Path2D();p.roundRect(r.x,r.y,r.width,r.height,r.radius??0);this.c.clip(p); }
 private paint(path: Path2D,p: Paint) { const c=this.c;c.save();c.globalAlpha=p.alpha;c.fillStyle=p.color;c.strokeStyle=p.color;c.lineWidth=p.width;c.lineCap=p.cap;c.lineJoin='round';if(p.blur)c.filter=`blur(${p.blur}px)`;if(p.stroke)c.stroke(path);else c.fill(path);c.restore(); }
 drawPath(path: Path,p: Paint) { this.paint(path.native,p); }
 drawOval(r: Rect,p: Paint) { const path=new Path2D();path.ellipse(r.x+r.width/2,r.y+r.height/2,r.width/2,r.height/2,0,0,Math.PI*2);this.paint(path,p); }
 drawImageRect(image: SkImage,src: Rect,dst: Rect,_p: Paint) { this.c.drawImage(image.image,src.x,src.y,src.width,src.height,dst.x,dst.y,dst.width,dst.height); }
}
