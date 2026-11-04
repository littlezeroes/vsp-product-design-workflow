import { BufferGeometry, Vector3 } from 'three'
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js'

/** Rounded lens faces follow the actual SVG silhouette, including the small droplets. */
export async function makeLiquidGeometry(source: BufferGeometry, svg: string, center: Vector3) {
  const size = 256
  const board = document.createElement('canvas'); board.width = board.height = size
  const image = new Image()
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  try { image.src = url; await image.decode() } finally { URL.revokeObjectURL(url) }
  const context = board.getContext('2d')!
  context.drawImage(image, 0, 0, size, size)
  const alpha = context.getImageData(0, 0, size, size).data
  const distance = new Float32Array(size * size)
  for (let i = 0; i < distance.length; i++) distance[i] = alpha[i * 4 + 3] > 128 ? 10000 : 0
  const diagonal = Math.SQRT2
  for (let y = 1; y < size - 1; y++) for (let x = 1; x < size - 1; x++) {
    const i = y * size + x
    distance[i] = Math.min(distance[i], distance[i - 1] + 1, distance[i - size] + 1, distance[i - size - 1] + diagonal, distance[i - size + 1] + diagonal)
  }
  for (let y = size - 2; y > 0; y--) for (let x = size - 2; x > 0; x--) {
    const i = y * size + x
    distance[i] = Math.min(distance[i], distance[i + 1] + 1, distance[i + size] + 1, distance[i + size + 1] + diagonal, distance[i + size - 1] + diagonal)
  }
  const root = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement
  const [left, top, width, height] = root.getAttribute('viewBox')!.split(/[ ,]+/).map(Number)
  // Smooth the distance field before deriving normals so the glass stays optically smooth.
  for (let pass = 0; pass < 6; pass++) {
    const previous = distance.slice()
    for (let y = 1; y < size - 1; y++) for (let x = 1; x < size - 1; x++) {
      const i = y * size + x
      distance[i] = (previous[i] * 4 + previous[i - 1] + previous[i + 1] + previous[i - size] + previous[i + size]) / 8
    }
  }
  const lensHeight = (localX: number, localY: number) => {
    const u = Math.max(0, Math.min(size - 1.001, (localX / .0105 + center.x - left) / width * (size - 1)))
    const v = Math.max(0, Math.min(size - 1.001, (-localY / .0105 + center.y - top) / height * (size - 1)))
    const x = Math.floor(u), y = Math.floor(v), tx = u - x, ty = v - y
    const i = y * size + x
    const d = ((distance[i] * (1 - tx) + distance[i + 1] * tx) * (1 - ty) + (distance[i + size] * (1 - tx) + distance[i + size + 1] * tx) * ty) / size * width * .0105
    return .07 * (1 - Math.exp(-d / .2))
  }
  const dense = new TessellateModifier(.12, 8).modify(source)
  source.dispose()
  const position = dense.attributes.position
  const normal = dense.attributes.normal
  const smoothNormal = new Vector3()
  const step = .018
  for (let i = 0; i < position.count; i++) {
    if (Math.abs(normal.getZ(i)) < .9) continue
    const x = position.getX(i), y = position.getY(i), sign = Math.sign(normal.getZ(i))
    position.setZ(i, position.getZ(i) + sign * lensHeight(x, y))
    const dx = (lensHeight(x + step, y) - lensHeight(x - step, y)) / (2 * step)
    const dy = (lensHeight(x, y + step) - lensHeight(x, y - step)) / (2 * step)
    smoothNormal.set(-dx, -dy, sign).normalize()
    normal.setXYZ(i, smoothNormal.x, smoothNormal.y, smoothNormal.z)
  }
  dense.deleteAttribute('uv')
  return dense
}
