import fs from 'node:fs'
import {JSDOM} from 'jsdom'
import {SVGLoader} from 'three/addons/loaders/SVGLoader.js'
import * as T from 'three'
globalThis.DOMParser=new JSDOM('').window.DOMParser
const svg=fs.readFileSync('public/brand-splash/vinclub-symbol.svg','utf8')
const root=new DOMParser().parseFromString(svg,'image/svg+xml').documentElement
const [x,y,w,h]=root.getAttribute('viewBox').split(/[ ,]+/).map(Number)
const shape=new SVGLoader().parse(svg).paths.flatMap(p=>p.toShapes()).find(s=>new T.Box2().setFromPoints(s.getPoints(8)).getSize(new T.Vector2()).length()>40)
const points=shape.getPoints(12)
fs.writeFileSync('output/vinclub-prismatic-glass/metal-outline.json',JSON.stringify(points.slice(0,-1).map(p=>[(p.x-x-w/2)*.0105,-(p.y-y-h/2)*.0105])))
