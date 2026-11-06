// use_figma body. Injected above: PAGES (page ids), APPLY (bool), MODE ('own' | 'inst').
// own  = layers not inside any instance (component definitions, frames, docs)
// inst = override layers inside instances of LOCAL components (run after every page finished 'own')
const T0 = Date.now();
const hex8 = (c) => '#' + [c.r, c.g, c.b, c.a === undefined ? 1 : c.a].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const col = (n) => cols.find((c) => c.name.trim() === n);
const GT = col('Global Themes'), PR = col('Primitive Colors'), SP = col('Spacing'), RA = col('Radius'), TY = col('Typography');

const varCache = new Map();
const getVar = async (id) => { if (!varCache.has(id)) varCache.set(id, await figma.variables.getVariableByIdAsync(id)); return varCache.get(id); };
const colCache = new Map();
const getCol = async (id) => { if (!colCache.has(id)) { let c = null; try { c = await figma.variables.getVariableCollectionByIdAsync(id); } catch (e) {} colCache.set(id, c); } return colCache.get(id); };
async function chase(raw, modeName) {
  let d = 0;
  while (raw && raw.type === 'VARIABLE_ALIAS' && d++ < 10) {
    const t = await getVar(raw.id); if (!t) return null;
    const c = await getCol(t.variableCollectionId);
    const m = c && (c.modes.find((x) => x.name === modeName) || c.modes[0]);
    raw = m ? t.valuesByMode[m.modeId] : Object.values(t.valuesByMode)[0];
  }
  return raw;
}
async function valIn(v, c, modeName) { const m = c.modes.find((x) => x.name === modeName) || c.modes[0]; return chase(v.valuesByMode[m.modeId], modeName); }

// ---- local index
const L = { color: [], prim: [], sp: [], ra: [], tySize: [], tyLine: [], tyStr: [] };
for (const id of GT.variableIds) { const v = await getVar(id); if (v.resolvedType !== 'COLOR') continue; const a = await valIn(v, GT, 'VSP Light'), b = await valIn(v, GT, 'VSP Dark'); if (a && a.r !== undefined) L.color.push({ v, light: hex8(a), dark: b && b.r !== undefined ? hex8(b) : null }); }
const PRIM_ORDER = ['Brand/', 'Contextual/', 'Swatches/', 'Neutral/', 'XanhSM/'];
for (const id of PR.variableIds) { const v = await getVar(id); const a = await valIn(v, PR, ''); if (a && a.r !== undefined) L.prim.push({ v, hex: hex8(a), rank: PRIM_ORDER.findIndex((p) => v.name.startsWith(p)) }); }
L.prim.sort((a, b) => a.rank - b.rank);
for (const id of SP.variableIds) { const v = await getVar(id); L.sp.push({ v, n: await valIn(v, SP, '') }); }
for (const id of RA.variableIds) { const v = await getVar(id); L.ra.push({ v, n: await valIn(v, RA, '') }); }
for (const id of TY.variableIds) {
  const v = await getVar(id); const x = await valIn(v, TY, 'VSP');
  if (v.resolvedType === 'FLOAT') (/\s2$/.test(v.name) ? L.tyLine : L.tySize).push({ v, n: x });
  else if (v.resolvedType === 'STRING') L.tyStr.push({ v, s: String(x).trim().toLowerCase() });
}
const plainFirst = (list, n) => { const hits = list.filter((e) => typeof e.n === 'number' && Math.abs(e.n - n) < 0.01); return hits.find((e) => e.v.name === String(n)) || hits.find((e) => !/sec_top/i.test(e.v.name)) || hits[0] || null; };

// ---- decisions
const SPACING_F = new Set(['itemSpacing', 'counterAxisSpacing', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'gridRowGap', 'gridColumnGap']);
const RADIUS_F = new Set(['cornerRadius', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']);
const TYPO_F = new Set(['fontSize', 'fontFamily', 'fontStyle', 'fontWeight', 'lineHeight', 'letterSpacing', 'paragraphSpacing', 'paragraphIndent']);
const GENERIC = new Set(['color', 'colors', 'background', 'foreground', 'border', 'default', 'contextual', 'surface', 'alias', 'global', 'mode', 'bg', 'content']);
const words = (s) => new Set(s.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2 && !GENERIC.has(w)));
const ROLE_PREFIX = { fg: ['Foreground/', 'Decor/Foreground/', 'Disabled/Foreground'], bg: ['Background/', 'Component/Background/', 'Decor/Background/', 'Disabled/Background'], border: ['Border/', 'Disabled/Border'], fx: [] };
const remoteDark = async (v) => {
  const c = await getCol(v.variableCollectionId); if (!c) return null;
  const m = c.modes.find((x) => /dark/i.test(x.name) && !/elevated|ic -/i.test(x.name)); if (!m) return null;
  const x = await chase(v.valuesByMode[m.modeId], m.name); return x && x.r !== undefined ? hex8(x) : null;
};
const decided = new Map();
async function pickColor(v, cur, role) {
  const dark = await remoteDark(v);
  const key = v.id + '|' + role + '|' + cur + '|' + dark;
  if (decided.has(key)) return decided.get(key);
  const w = words(v.name);
  let best = null, bs = -1;
  for (const c of L.color) {
    if (c.light !== cur) continue;
    let s = 0;
    if (ROLE_PREFIX[role].some((p) => c.v.name.startsWith(p))) s += 4;
    if (dark && c.dark === dark) s += 3;
    for (const x of words(c.v.name)) if (w.has(x)) s += 1;
    if (s > bs) { bs = s; best = c.v; }
  }
  if (!best) { const p = L.prim.find((e) => e.hex === cur); if (p) best = p.v; }
  decided.set(key, best);
  return best;
}
async function pickFloat(field, cur, rv) {
  if (SPACING_F.has(field)) return (plainFirst(L.sp, cur) || {}).v || null;
  if (RADIUS_F.has(field)) return (plainFirst(L.ra, cur) || {}).v || null;
  if (field === 'fontSize') return (plainFirst(L.tySize, cur) || {}).v || null;
  if (field === 'lineHeight') return (plainFirst(L.tyLine, cur) || {}).v || null;
  return null;
}
async function pickString(field, cur, rv) {
  const s = String(cur).trim().toLowerCase();
  const hits = L.tyStr.filter((e) => e.s === s);
  if (!hits.length) return null;
  const last = rv.name.split('/').pop().toLowerCase();
  return (hits.find((e) => e.v.name.toLowerCase() === last) || hits.find((e) => e.v.name === 'body') || hits[0]).v;
}
// returns { remote:bool, target:Variable|null, cur }
async function decide(alias, node, field, role) {
  const v = await getVar(alias.id);
  if (!v || !v.remote) return { remote: false };
  let cur;
  try { cur = v.resolveForConsumer(node).value; } catch (e) { cur = await chase(Object.values(v.valuesByMode)[0], ''); }
  let target = null;
  if (v.resolvedType === 'COLOR' && cur && cur.r !== undefined) target = await pickColor(v, hex8(cur), role);
  else if (v.resolvedType === 'FLOAT') target = await pickFloat(field, cur, v);
  else if (v.resolvedType === 'STRING') target = await pickString(field, cur, v);
  log(v, field, role, target, cur);
  return { remote: true, target, cur };
}
const LOG = new Map();
function log(v, field, role, target, cur) {
  const shown = cur && cur.r !== undefined ? hex8(cur) : cur;
  const k = v.resolvedType[0] + ' ' + v.name + ' [' + (role || field) + '] ' + shown + ' → ' + (target ? target.name : 'RAW');
  LOG.set(k, (LOG.get(k) || 0) + 1);
}

// ---- styles
const styleCache = new Map();
const getStyle = async (id) => { if (!styleCache.has(id)) { let s = null; try { s = await figma.getStyleByIdAsync(id); } catch (e) {} styleCache.set(id, s); } return styleCache.get(id); };
const localStyles = { TEXT: await figma.getLocalTextStylesAsync(), EFFECT: await figma.getLocalEffectStylesAsync(), PAINT: await figma.getLocalPaintStylesAsync(), GRID: await figma.getLocalGridStylesAsync() };
const STYLE_LOG = new Map();
function mapStyle(st) {
  const byName = localStyles[st.type].find((s) => s.name.toLowerCase() === st.name.toLowerCase());
  let t = byName || null;
  if (!t && st.type === 'TEXT') {
    const lh = (x) => (x.lineHeight && x.lineHeight.unit === 'PIXELS' ? x.lineHeight.value : null);
    t = localStyles.TEXT.find((s) => s.fontSize === st.fontSize && s.fontName.style.toLowerCase() === st.fontName.style.toLowerCase() && lh(s) === lh(st)) || null;
  }
  const k = st.type + ' ' + st.name + ' → ' + (t ? t.name : 'DETACH');
  STYLE_LOG.set(k, (STYLE_LOG.get(k) || 0) + 1);
  return t;
}

// ---- fonts
const fontCache = new Set();
const loadFont = async (f) => { const k = f.family + '|' + f.style; if (!fontCache.has(k)) { await figma.loadFontAsync(f); fontCache.add(k); } };
const loadFonts = async (t) => { if (t.characters.length === 0) { if (t.fontName !== figma.mixed) await loadFont(t.fontName); return; } for (const f of t.getRangeAllFontNames(0, t.characters.length)) await loadFont(f); };

// ---- node fixer
let mutated = 0;
const errors = [];
const paintRole = (n, field) => (field === 'strokes' ? 'border' : n.type === 'TEXT' ? 'fg' : 'bg');
async function fixPaints(n, paints, role) {
  let changed = false; const next = [];
  for (const p of paints) {
    const a = p.boundVariables && p.boundVariables.color;
    if (a) {
      const d = await decide(a, n, 'color', role);
      if (d.remote && APPLY) { next.push(figma.variables.setBoundVariableForPaint(p, 'color', d.target || null)); changed = true; continue; }
    }
    next.push(p);
  }
  return changed ? next : null;
}

async function fixNode(n) {
  // styles (node-level)
  for (const [f, setter] of [['fillStyleId', 'setFillStyleIdAsync'], ['strokeStyleId', 'setStrokeStyleIdAsync'], ['effectStyleId', 'setEffectStyleIdAsync'], ['gridStyleId', 'setGridStyleIdAsync']]) {
    if (!(f in n)) continue;
    const id = n[f]; if (!id || id === figma.mixed) continue;
    const st = await getStyle(id); if (!st || !st.remote) continue;
    const t = mapStyle(st);
    if (APPLY) { if (n.type === 'TEXT') await loadFonts(n); await n[setter](t ? t.id : ''); mutated++; }
  }
  if (n.type === 'TEXT') {
    const segs = n.getStyledTextSegments(['textStyleId', 'fillStyleId']);
    for (const seg of segs) {
      if (seg.textStyleId) {
        const st = await getStyle(seg.textStyleId);
        if (st && st.remote) { const t = mapStyle(st); if (APPLY) { await loadFonts(n); if (t) await loadFont(t.fontName); await n.setRangeTextStyleIdAsync(seg.start, seg.end, t ? t.id : ''); mutated++; } }
      }
      if (seg.fillStyleId) {
        const st = await getStyle(seg.fillStyleId);
        if (st && st.remote) { const t = mapStyle(st); if (APPLY) { await loadFonts(n); await n.setRangeFillStyleIdAsync(seg.start, seg.end, t ? t.id : ''); mutated++; } }
      }
    }
    // variables per text range
    for (const seg of n.getStyledTextSegments(['boundVariables', 'fills', 'textStyleId'])) {
      for (const [f, a] of Object.entries(seg.boundVariables || {})) {
        if (seg.textStyleId && TYPO_F.has(f)) continue;
        if (!a || a.type !== 'VARIABLE_ALIAS') continue;
        const d = await decide(a, n, f, f);
        if (d.remote && APPLY) { await loadFonts(n); n.setRangeBoundVariable(seg.start, seg.end, f, d.target || null); mutated++; }
      }
      const np = await fixPaints(n, seg.fills, 'fg');
      if (np) { await loadFonts(n); n.setRangeFills(seg.start, seg.end, np); mutated++; }
    }
  }
  const bv = n.boundVariables || {};
  for (const [field, val] of Object.entries(bv)) {
    if (n.type === 'TEXT' && (TYPO_F.has(field) || field === 'fills' || field === 'textRangeFills')) continue;
    if (field === 'fills' || field === 'strokes') {
      const paints = n[field]; if (paints === figma.mixed) continue;
      const np = await fixPaints(n, paints, paintRole(n, field));
      if (np) { if (n.type === 'TEXT') await loadFonts(n); n[field] = np; mutated++; }
    } else if (field === 'effects') {
      let changed = false; const next = [];
      for (const e of n.effects) {
        let cur = e;
        for (const [ef, a] of Object.entries(e.boundVariables || {})) {
          const d = await decide(a, n, ef, ef === 'color' ? 'fx' : ef);
          if (d.remote && APPLY) { cur = figma.variables.setBoundVariableForEffect(cur, ef, d.target || null); changed = true; }
        }
        next.push(cur);
      }
      if (changed) { n.effects = next; mutated++; }
    } else if (field === 'componentProperties') {
      for (const [prop, a] of Object.entries(val || {})) {
        const d = await decide(a, n, prop, 'prop');
        if (d.remote && APPLY) { n.setProperties({ [prop]: d.cur }); mutated++; }
      }
    } else if (val && val.type === 'VARIABLE_ALIAS') {
      const d = await decide(val, n, field, field);
      if (d.remote && APPLY) {
        if (n.type === 'TEXT') await loadFonts(n);
        n.setBoundVariable(field, d.target || null);
        if (!d.target) { try { n[field] = d.cur; } catch (e) {} }
        mutated++;
      }
    } else if (Array.isArray(val)) {
      for (const a of val) if (a && a.type === 'VARIABLE_ALIAS') { const d = await decide(a, n, field, field); if (d.remote) errors.push(n.id + ' unhandled array field ' + field); }
    }
  }
}

// ---- walk pages
const perPage = [];
let remoteLeft = 0;
for (const pid of PAGES) {
  const page = await figma.getNodeByIdAsync(pid);
  await page.loadAsync();
  const nodes = [];
  const walk = async (n, ctx) => {
    let childCtx = ctx;
    if (n.type === 'INSTANCE') { const mc = ctx === 'remote' ? null : await n.getMainComponentAsync(); childCtx = ctx === 'remote' || (mc && mc.remote) ? 'remote' : 'local'; }
    nodes.push([n, ctx]);
    if ('children' in n) for (const c of n.children) await walk(c, childCtx);
  };
  for (const c of page.children) await walk(c, 'own');
  let done = 0;
  const before = mutated;
  for (const [n, ctx] of nodes) {
    if (ctx !== (MODE === 'own' ? 'own' : 'local')) continue;
    try { await fixNode(n); } catch (e) { errors.push(page.name + ' ' + n.id + ' ' + String(e.message || e).slice(0, 140)); }
    done++;
  }
  perPage.push([page.name, nodes.length, done, mutated - before]);
}
const top = (m, k) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([s, c]) => c + '× ' + s);
return { apply: APPLY, mode: MODE, ms: Date.now() - T0, mutated, errorCount: errors.length, errors: errors.slice(0, 25), perPage, styles: top(STYLE_LOG, 60), vars: top(LOG, 160), varKinds: LOG.size };
