'use client'

import { useEffect, useRef, useState } from 'react'
import { PrismaticFilm } from './prismatic-film'
import type { GlassId } from './glass-options'

type GlassSceneProps = { look: GlassId; replay: number; paused: boolean; duration: number; motion?: 'liquid'; exiting?: boolean; onComplete?: () => void; onExitComplete?: () => void }

export function GlassScene(props: GlassSceneProps) {
  if (props.look === 'jewel-glass') return <PrismaticFilm replay={props.replay} paused={props.paused} exiting={props.exiting} onComplete={props.onComplete} onExitComplete={props.onExitComplete} />
  return <LegacyGlassScene {...props} />
}

function LegacyGlassScene({ look, replay, paused, duration, motion, onComplete }: GlassSceneProps) {
  const host = useRef<HTMLDivElement>(null)
  const complete = useRef(onComplete)
  useEffect(() => { complete.current = onComplete }, [onComplete])
  const playing = useRef(!paused)
  const restart = useRef(replay)
  const [status, setStatus] = useState('Đang dựng kính 3D…')
  useEffect(() => { playing.current = !paused }, [paused])
  useEffect(() => { restart.current = replay }, [replay])
  useEffect(() => {
    const element = host.current
    if (!element) return
    let disposed = false
    let cleanup = () => {}
    void (async () => {
      const [T, { SVGLoader }] = await Promise.all([import('three'), import('three/addons/loaders/SVGLoader.js')])
      const response = await fetch('/brand-splash/vinclub-symbol.svg')
      if (!response.ok) throw new Error('Không tải được logo')
      const svg = await response.text()
      if (disposed) return
      const palette = getComputedStyle(element.closest('.glass-studies')!)
      const color = (name: string) => palette.getPropertyValue(`--glass-${name}`).trim()
      const jewel = look === 'jewel-glass'
      const pearl = look === 'nacre-prism'
      const prism = look === 'smoked-prism' || pearl || jewel
      const dark = prism || look === 'obsidian-liquid'
      const acrylic = look === 'acrylic-layers'
      const liquid = look === 'liquid-prism' || look === 'obsidian-liquid'
      const liquidMotion = liquid || motion === 'liquid'
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.4))
      renderer.toneMapping = T.ACESFilmicToneMapping
      renderer.toneMappingExposure = dark ? 1.05 : .9
      element.appendChild(renderer.domElement)
      renderer.domElement.setAttribute('aria-label', `Logo VinClub 3D — ${look}`)
      renderer.domElement.setAttribute('role', 'img')
      const scene = new T.Scene()
      scene.background = new T.Color(color(jewel ? 'paper' : dark ? 'ink' : 'paper'))
      const camera = new T.PerspectiveCamera(32, 1, .1, 100)
      camera.position.set(0, 0, 9.5)
      const pmrem = new T.PMREMGenerator(renderer)
      const room = new T.Scene()
      room.background = new T.Color(color('ink'))
      // Luminous cards form long reflections across curved bevels and glass thickness.
      for (let i = 0; i < 3; i++) {
        const card = new T.Mesh(new T.PlaneGeometry(i === 1 ? (jewel ? .65 : 4.2) : .65, 8), new T.MeshBasicMaterial({ color: new T.Color(color((jewel ? ['silver', 'white', 'white'] : ['cyan', 'white', 'violet'])[i])).multiplyScalar(i === 1 ? 6 : 4), side: T.DoubleSide }))
        card.position.set((i - 1) * 4, 1, 4)
        card.lookAt(0, 0, 0)
        room.add(card)
      }
      if (jewel) {
        const spectrum = ['spectrum-red', 'spectrum-orange', 'spectrum-yellow', 'spectrum-green', 'spectrum-blue', 'spectrum-indigo', 'spectrum-violet']
        spectrum.forEach((name, i) => {
          const strip = new T.Mesh(new T.PlaneGeometry(.35, 5), new T.MeshBasicMaterial({ color: new T.Color(color(name)).multiplyScalar(1.5), side: T.DoubleSide }))
          strip.position.set(-3.3 + i * 1.1, 1.7 - i * .35, 3.5)
          strip.lookAt(0, 0, 0); room.add(strip)
        })
      }
      const environment = pmrem.fromScene(room, .04)
      scene.environment = environment.texture
      scene.environmentIntensity = dark ? 1.5 : 1.1
      scene.add(new T.HemisphereLight(color('white'), color('night'), 1.2))
      const key = new T.DirectionalLight(color('white'), 4)
      key.position.set(-3, 5, 5); scene.add(key)
      const rim = new T.PointLight(color(jewel ? 'white' : 'violet'), jewel ? 18 : 45, 20)
      rim.position.set(3, 1, 2); scene.add(rim)
      const cyan = new T.PointLight(color(jewel ? 'silver' : 'cyan'), jewel ? 18 : 45, 20)
      cyan.position.set(-3, -1, 3); scene.add(cyan)
      const data = new SVGLoader().parse(svg)
      const shapes = data.paths.flatMap(path => path.toShapes())
      let geometry: InstanceType<typeof T.BufferGeometry> = new T.ExtrudeGeometry(shapes, { depth: jewel ? 64 : acrylic ? 15 : 30, bevelEnabled: true, bevelSegments: jewel ? 8 : liquid ? 5 : 2, steps: 1, bevelSize: jewel ? 5 : prism ? 3.2 : 2, bevelThickness: jewel ? 7 : prism ? 5 : 3.2, curveSegments: jewel ? 12 : 6 })
      geometry.computeBoundingBox()
      const svgCenter = geometry.boundingBox!.getCenter(new T.Vector3())
      geometry.center(); geometry.scale(.0105, .0105, .0105); geometry.rotateX(Math.PI); geometry.computeVertexNormals()
      if (jewel) {
        const { makeLiquidGeometry } = await import('./liquid-glass-geometry')
        geometry = await makeLiquidGeometry(geometry, svg, svgCenter)
        if (disposed) { geometry.dispose(); renderer.dispose(); renderer.domElement.remove(); environment.dispose(); pmrem.dispose(); return }
      }
      let filmMap: InstanceType<typeof T.DataTexture> | undefined
      if (pearl) {
        const size = 256
        const pixels = new Uint8Array(size * size * 4)
        for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
          const u = x / (size - 1), v = y / (size - 1)
          // Thickness variation produces broad interference bands across the glass.
          const film = .5 + .32 * Math.sin((u * .85 + v * .7) * Math.PI * 2) + .12 * Math.sin(v * 8 + u * 4)
          const index = (y * size + x) * 4
          pixels[index] = pixels[index + 1] = pixels[index + 2] = Math.round(Math.max(0, Math.min(1, film)) * 255)
          pixels[index + 3] = 255
        }
        filmMap = new T.DataTexture(pixels, size, size)
        filmMap.magFilter = T.LinearFilter; filmMap.minFilter = T.LinearFilter; filmMap.needsUpdate = true
        const position = geometry.attributes.position
        const uv = new Float32Array(position.count * 2)
        for (let i = 0; i < position.count; i++) { uv[i * 2] = (position.getX(i) + 1.8) / 3.6; uv[i * 2 + 1] = (position.getY(i) + 1.8) / 3.6 }
        geometry.setAttribute('uv', new T.BufferAttribute(uv, 2))

      }
      const basePositions = geometry.attributes.position.array.slice()
      const group = new T.Group(); scene.add(group)
      const materials: InstanceType<typeof T.MeshPhysicalMaterial>[] = []
      const meshes: InstanceType<typeof T.Mesh>[] = []
      for (let i = 0; i < (acrylic ? 3 : 1); i++) {
        const material = new T.MeshPhysicalMaterial({
          color: color(jewel ? 'white' : acrylic ? ['cyan', 'violet', 'coral'][i] : dark ? 'gold-smoke' : 'cyan'),
          transparent: jewel,
          depthWrite: !jewel,
          metalness: jewel ? 0 : dark ? .12 : 0,
          roughness: jewel ? .012 : dark ? .06 : .035,
          transmission: jewel ? 1 : dark ? .94 : acrylic ? .91 : .98,
          thickness: jewel ? .7 : acrylic ? .2 : .65,
          ior: jewel ? 1.33 : prism ? 1.9 : 1.52,
          dispersion: jewel ? .65 : pearl ? 1.05 : look === 'obsidian-liquid' ? .05 : acrylic ? .22 : .95,
          iridescence: jewel ? 0 : pearl ? .85 : look === 'obsidian-liquid' ? .08 : dark ? .55 : acrylic ? .2 : .85,
          iridescenceIOR: pearl ? 1.65 : 1.65, iridescenceThicknessRange: pearl ? [260, 460] : [180, 550],
          iridescenceThicknessMap: filmMap || null,
          clearcoat: jewel ? 0 : pearl ? .65 : 1, clearcoatRoughness: .035,
          attenuationColor: new T.Color(color(jewel ? 'white' : dark ? 'gold-light' : 'cyan')),
          attenuationDistance: jewel ? 8 : dark ? 3 : 1.5,
          envMapIntensity: jewel ? .6 : 1.5,
        })
        if (jewel) {
          material.onBeforeCompile = shader => {
            shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
              float liquidFresnel = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 1.65);
              diffuseColor.a = 0.12 + liquidFresnel * 0.88;
              #include <opaque_fragment>
            `)
          }
          material.customProgramCacheKey = () => 'liquid-glass-fresnel-v1'
        }
        const mesh = new T.Mesh(geometry, material)
        group.add(mesh); meshes.push(mesh); materials.push(material)
      }
      let backdropTexture: InstanceType<typeof T.CanvasTexture> | undefined
      let backdropGeometry: InstanceType<typeof T.PlaneGeometry> | undefined
      let backdropMaterial: InstanceType<typeof T.MeshBasicMaterial> | undefined
      let backdrop: InstanceType<typeof T.Mesh> | undefined
      if (jewel) {
        const board = document.createElement('canvas'); board.width = board.height = 1024
        const context = board.getContext('2d')!
        context.fillStyle = color('paper'); context.fillRect(0, 0, 1024, 1024)
        const glow = context.createRadialGradient(530, 520, 20, 530, 520, 480)
        glow.addColorStop(0, color('white')); glow.addColorStop(1, color('paper'))
        context.fillStyle = glow; context.fillRect(0, 0, 1024, 1024)
        // Sparse studio strips make the displacement through the lens visible.
        context.save(); context.filter = 'blur(42px)'; context.globalAlpha = .16; context.fillStyle = color('smoke')
        context.translate(512, 512); context.rotate(-.4); context.fillRect(-100, -600, 180, 1200); context.restore()
        backdropTexture = new T.CanvasTexture(board); backdropTexture.colorSpace = T.SRGBColorSpace
        backdropGeometry = new T.PlaneGeometry(12, 12)
        backdropMaterial = new T.MeshBasicMaterial({ map: backdropTexture, toneMapped: false })
        backdrop = new T.Mesh(backdropGeometry, backdropMaterial); backdrop.position.z = -1.5; scene.add(backdrop)
      }
      const droplets: InstanceType<typeof T.Mesh>[] = []
      const dropletGeometry = new T.SphereGeometry(1, 24, 16)
      if (liquidMotion) for (let i = 0; i < 7; i++) {
        const mesh = new T.Mesh(dropletGeometry, materials[0]); scene.add(mesh); droplets.push(mesh)
      }
      const resize = () => { const w = element.clientWidth; const h = element.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); if (backdrop) { const viewHeight = 2 * Math.tan(T.MathUtils.degToRad(camera.fov / 2)) * (camera.position.z - backdrop.position.z); backdrop.scale.set(viewHeight * camera.aspect / 12, viewHeight / 12, 1) } }
      const observer = new ResizeObserver(resize); observer.observe(element); resize()
      const reduced = matchMedia('(prefers-reduced-motion: reduce)')
      let elapsed = reduced.matches ? duration : 0
      let previous = 0
      let renderedElapsed = -1
      let completed = false
      let revision = restart.current
      let visible = true
      const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting }); intersection.observe(element)
      const ease = (v: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, v)), 3)
      renderer.setAnimationLoop((time: number) => {
        const delta = previous ? (time - previous) / 1000 : 0; previous = time
        if (revision !== restart.current) { revision = restart.current; elapsed = reduced.matches ? duration : 0; renderedElapsed = -1; completed = false }
        if ((!visible && !reduced.matches) || document.hidden) return
        if (playing.current && !reduced.matches) elapsed = Math.min(duration + .5, elapsed + delta)
        if (renderedElapsed === elapsed) return
        renderedElapsed = elapsed
        const p = Math.min(1, elapsed / duration)
        const enter = ease(p / .8)
        group.rotation.set(0, 0, 0)
        group.position.set(0, .05, 0)
        group.scale.setScalar(1)
        if (prism) { group.rotation.x = .08 * enter; group.rotation.y = (1 - enter) * -1.15 + .24; group.rotation.z = (1 - enter) * -.12; group.scale.setScalar(.85 + enter * .15) }
        if (look === 'liquid-prism') { group.rotation.x = .06 * enter; group.rotation.y = (1 - enter) * .65 + .16; group.scale.setScalar(.3 + enter * .7) }
        if (look === 'obsidian-liquid') { group.scale.setScalar(1 + (1 - enter) * 1.3); group.rotation.x = -.08 * enter; group.rotation.y = (1 - enter) * -.55 - .2; group.rotation.z = (1 - enter) * .16 }
        if (acrylic) {
          group.rotation.y = -.4 * enter; group.rotation.x = -.07 * enter
          meshes.forEach((mesh, i) => { const offset = 1 - ease((p - i * .07) / .7); mesh.position.set((i - 1) * (offset * 2 + .065), (1 - i) * offset * .65, (i - 1) * (.22 + offset * .5)) })
        }
        if (motion === 'liquid') {
          const turn = ease(p / .94)
          group.rotation.set(.1 * Math.sin(p * Math.PI) + .06 * enter, -(1 - turn) * (jewel ? 1.2 : .65) + .24 * enter, 0)
          group.scale.setScalar(jewel ? .82 + enter * .18 : .3 + enter * .7)
        }
        if (liquidMotion && !jewel) {
          const position = geometry.attributes.position
          for (let i = 0; i < position.count; i++) {
            const x = basePositions[i * 3], y = basePositions[i * 3 + 1], z = basePositions[i * 3 + 2]
            const wave = Math.sin(y * 4 + p * 12) * Math.sin(x * 3 + p * 9) * (1 - enter) * (jewel ? 0 : .1)
            position.setXYZ(i, x + wave, y, z + wave)
          }
          position.needsUpdate = true
        }
        if (liquidMotion) {
          droplets.forEach((drop, i) => { const a = i / 7 * Math.PI * 2 + p * .7; const travel = 1 - ease(p / .7); drop.position.set(Math.cos(a) * (1.3 + travel * 1.4), Math.sin(a) * (1.2 + travel * 1.1), .4); drop.scale.setScalar((.1 + (i % 3) * .035) * travel); drop.visible = travel > .005 })
        }
        rim.position.x = 4 - ease(p) * 7
        cyan.position.y = -2 + ease(p) * 5
        if (backdrop) backdrop.position.x = Math.sin(p * Math.PI) * .35
        renderer.render(scene, camera)
        if (p === 1 && !completed) { completed = true; complete.current?.() }
      })
      setStatus('')
      cleanup = () => {
        observer.disconnect(); intersection.disconnect(); renderer.setAnimationLoop(null)
        geometry.dispose(); backdropGeometry?.dispose(); backdropMaterial?.dispose(); backdropTexture?.dispose(); filmMap?.dispose(); dropletGeometry.dispose(); materials.forEach(m => m.dispose())
        room.traverse(object => { if (object instanceof T.Mesh) { object.geometry.dispose(); const mats = Array.isArray(object.material) ? object.material : [object.material]; mats.forEach(m => m.dispose()) } })
        environment.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove()
      }
    })().catch(() => { if (!disposed) setStatus('Không khởi tạo được WebGL. Hãy tải lại hoặc bật tăng tốc đồ họa.') })
    return () => { disposed = true; cleanup() }
  }, [look, duration, motion])
  return <><div className="glass-phone__stage" ref={host} />{status && <p role="status" className="glass-phone__loading">{status}</p>}</>
}
