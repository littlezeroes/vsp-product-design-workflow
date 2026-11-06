// Params injected above: PAGE_ID (string), APPLY (bool), MAP ({components,styles,variables})
const norm = (s) => (s || '').toLowerCase().replace(/\[(vsp|vpay)\]|_?\((v2cake|local-bank)\)|🔒|❖/g, '').replace(/[^a-z0-9/]/g, '');
const normProps = (p) => { const o = {}; for (const [k, v] of Object.entries(p || {})) o[norm(k)] = norm(String(v)); return o; };
const fontCache = new Set();
const loadFont = async (f) => { const k = f.family + '|' + f.style; if (!fontCache.has(k)) { await figma.loadFontAsync(f); fontCache.add(k); } };
const loadFonts = async (t) => { if (t.characters.length === 0) { if (t.fontName !== figma.mixed) await loadFont(t.fontName); return; } for (const f of t.getRangeAllFontNames(0, t.characters.length)) await loadFont(f); };

const varByName = new Map();
for (const v of await figma.variables.getLocalVariablesAsync()) varByName.set(v.resolvedType + '|' + v.name.toLowerCase(), v);
const styleByName = new Map();
for (const [t, l] of [['TEXT', await figma.getLocalTextStylesAsync()], ['PAINT', await figma.getLocalPaintStylesAsync()], ['EFFECT', await figma.getLocalEffectStylesAsync()]]) for (const s of l) styleByName.set(t + '|' + s.name.toLowerCase(), s);

const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);
// Local components are indexed from a list passed in (COMPS: [{id,name}]) because other pages are not loaded.
const compByName = new Map();
for (const c of COMPS) if (!compByName.has(norm(c.name))) compByName.set(norm(c.name), c.id);

const isOwn = (n) => !n.id.startsWith('I');
const stats = { inst: {}, style: {}, vari: {} };
const bump = (bucket, key, target) => { const e = bucket[key] || (bucket[key] = { n: 0, to: target }); e.n++; };
const mutated = new Set();
const errors = [];

// Pass 1: instances
for (const inst of page.findAllWithCriteria({ types: ['INSTANCE'] }).filter(isOwn)) {
  const mc = await inst.getMainComponentAsync();
  if (!mc || !mc.remote) continue;
  const isVar = mc.parent && mc.parent.type === 'COMPONENT_SET';
  const rname = isVar ? mc.parent.name : mc.name;
  const tid = compByName.get(norm(MAP.components[rname] || rname));
  let dest = null, why = 'no-local';
  if (tid) {
    const t = await figma.getNodeByIdAsync(tid);
    if (t.type === 'COMPONENT') dest = t;
    else {
      const want = normProps(isVar ? mc.variantProperties : {});
      const hits = t.children.filter((c) => { const h = normProps(c.variantProperties); return Object.entries(want).every(([k, v]) => h[k] === v); });
      dest = hits.includes(t.defaultVariant) ? t.defaultVariant : hits[0] || null;
      if (!dest) why = 'variant-miss';
    }
  }
  bump(stats.inst, rname + (dest ? '' : ' ✗' + why), dest ? (dest.parent.type === 'COMPONENT_SET' ? dest.parent.name : dest.name) : null);
  if (APPLY && dest) { try { inst.swapComponent(dest); mutated.add(inst.id); } catch (e) { errors.push(inst.id + ' swap ' + e.message); } }
}

// Pass 2 + 3: styles and variables on definition layers
const all = page.findAll(() => true).filter(isOwn);
const styleCache = new Map();
const getStyle = async (id) => { if (!styleCache.has(id)) styleCache.set(id, await figma.getStyleByIdAsync(id)); return styleCache.get(id); };
const varCache = new Map();
const getVar = async (id) => { if (!varCache.has(id)) varCache.set(id, await figma.variables.getVariableByIdAsync(id)); return varCache.get(id); };
const localVar = async (alias) => {
  const v = await getVar(alias.id);
  if (!v || !v.remote) return null;
  const t = varByName.get(v.resolvedType + '|' + (MAP.variables[v.name] || v.name).toLowerCase());
  bump(stats.vari, v.resolvedType + ' ' + v.name, t ? 'ok' : null);
  return t || null;
};
const FIELDS = [['fillStyleId', 'setFillStyleIdAsync'], ['strokeStyleId', 'setStrokeStyleIdAsync'], ['effectStyleId', 'setEffectStyleIdAsync'], ['textStyleId', 'setTextStyleIdAsync']];

for (const n of all) {
  try {
    for (const [f, setter] of FIELDS) {
      if (!(f in n)) continue;
      const id = n[f];
      if (id === figma.mixed && f === 'textStyleId') {
        for (const seg of n.getStyledTextSegments(['textStyleId'])) {
          if (!seg.textStyleId) continue;
          const st = await getStyle(seg.textStyleId);
          if (!st || !st.remote) continue;
          const t = styleByName.get(st.type + '|' + (MAP.styles[st.name] || st.name).toLowerCase());
          bump(stats.style, st.type + ' ' + st.name, t ? t.name : null);
          if (APPLY && t) { await loadFonts(n); await loadFont(t.fontName); await n.setRangeTextStyleIdAsync(seg.start, seg.end, t.id); mutated.add(n.id); }
        }
        continue;
      }
      if (!id || id === figma.mixed) continue;
      const st = await getStyle(id);
      if (!st || !st.remote) continue;
      const t = styleByName.get(st.type + '|' + (MAP.styles[st.name] || st.name).toLowerCase());
      bump(stats.style, st.type + ' ' + st.name, t ? t.name : null);
      if (APPLY && t) { if (n.type === 'TEXT') await loadFonts(n); if (t.type === 'TEXT') await loadFont(t.fontName); await n[setter](t.id); mutated.add(n.id); }
    }
    const bv = n.boundVariables;
    if (!bv) continue;
    let fontsReady = false;
    const ready = async () => { if (!fontsReady && n.type === 'TEXT') await loadFonts(n); fontsReady = true; };
    for (const [field, val] of Object.entries(bv)) {
      if (field === 'fills' || field === 'strokes') {
        const paints = n[field];
        if (paints === figma.mixed) continue;
        let changed = false; const next = [];
        for (const p of paints) {
          const a = p.boundVariables && p.boundVariables.color;
          const t = a ? await localVar(a) : null;
          if (t && APPLY) { next.push(figma.variables.setBoundVariableForPaint(p, 'color', t)); changed = true; } else next.push(p);
        }
        if (changed) { await ready(); n[field] = next; mutated.add(n.id); }
      } else if (field === 'effects') {
        let changed = false; const next = [];
        for (const e of n.effects) {
          let cur = e;
          for (const [ef, a] of Object.entries(e.boundVariables || {})) { const t = await localVar(a); if (t && APPLY) { cur = figma.variables.setBoundVariableForEffect(cur, ef, t); changed = true; } }
          next.push(cur);
        }
        if (changed) { n.effects = next; mutated.add(n.id); }
      } else if (val && !Array.isArray(val) && val.type === 'VARIABLE_ALIAS') {
        const t = await localVar(val);
        if (t && APPLY) { await ready(); n.setBoundVariable(field, t); mutated.add(n.id); }
      } else if (field === 'textRangeFills' || Array.isArray(val)) {
        for (const a of (Array.isArray(val) ? val : Object.values(val))) if (a && a.type === 'VARIABLE_ALIAS') await localVar(a);
      }
    }
  } catch (e) { errors.push(n.id + ' ' + e.message); }
}

const summarize = (b) => { const ok = [], miss = []; for (const [k, v] of Object.entries(b)) (v.to ? ok : miss).push([v.n, k, v.to]); ok.sort((a, b) => b[0] - a[0]); miss.sort((a, b) => b[0] - a[0]); return { ok: ok.reduce((s, x) => s + x[0], 0), miss: miss.reduce((s, x) => s + x[0], 0), missList: miss.slice(0, 40).map((x) => x[0] + '× ' + x[1]), okTop: ok.slice(0, 8).map((x) => x[0] + '× ' + x[1] + ' → ' + x[2]) }; };
return { page: page.name, apply: APPLY, instances: summarize(stats.inst), styles: summarize(stats.style), variables: summarize(stats.vari), mutatedCount: mutated.size, mutatedNodeIds: [...mutated].slice(0, 200), errors: errors.slice(0, 20) };
