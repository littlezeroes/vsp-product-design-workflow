import fs from 'node:fs'
import { JSDOM } from 'jsdom'
import * as T from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
globalThis.DOMParser = new JSDOM('').window.DOMParser
const svg=fs.readFileSync('public/brand-splash/vinclub-symbol.svg','utf8')
const root=new DOMParser().parseFromString(svg,'image/svg+xml').documentElement
const [vx,vy,vw,vh]=root.getAttribute('viewBox').split(/[ ,]+/).map(Number)
const cx=vx+vw/2,cy=vy+vh/2
const shapes=new SVGLoader().parse(svg).paths.flatMap(path=>path.toShapes())
const main=[],beads=[]
for(const shape of shapes){const box=new T.Box2().setFromPoints(shape.getPoints(16));const size=box.getSize(new T.Vector2());const center=box.getCenter(new T.Vector2());if(size.length()>40)main.push(shape);else beads.push({position:[(center.x-cx)*.0105,-(center.y-cy)*.0105,.22],radius:(size.x+size.y)/4*.0105})}
const holes=main.flatMap(s=>s.holes.map(h=>{const b=new T.Box2().setFromPoints(h.getPoints(24));const c=b.getCenter(new T.Vector2());const d=b.getSize(new T.Vector2());return{position:[(c.x-cx)*.0105,-(c.y-cy)*.0105,0],radius:(d.x+d.y)/4*.0105}}))
function simplify(points, epsilon) {
 if(points.length<3)return points
 const a=points[0], b=points[points.length-1], dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy
 let maximum=0,index=0
 for(let i=1;i<points.length-1;i++){const p=points[i];const t=den?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/den)):0;const distance=Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);if(distance>maximum){maximum=distance;index=i}}
 if(maximum<=epsilon)return[a,b]
 return [...simplify(points.slice(0,index+1),epsilon).slice(0,-1),...simplify(points.slice(index),epsilon)]
}
for(let i=0;i<main.length;i++)main[i]=new T.Shape(simplify(main[i].getPoints(24),.12))
const geometry=new T.ExtrudeGeometry(main,{depth:42,bevelEnabled:false,steps:1,curveSegments:24})
geometry.translate(-cx,-cy,-21);geometry.scale(.0105,.0105,.0105);geometry.rotateX(Math.PI)
geometry.deleteAttribute('normal');geometry.deleteAttribute('uv')
const merged=mergeVertices(geometry,.00001)
fs.writeFileSync('output/vinclub-prismatic-glass/logo-mesh.json',JSON.stringify({vertices:Array.from(merged.attributes.position.array),indices:Array.from(merged.index.array),beads,holes}))
console.log({main:main.length,beads:beads.length,vertices:merged.attributes.position.count})
