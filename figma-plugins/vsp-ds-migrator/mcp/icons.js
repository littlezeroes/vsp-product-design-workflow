// use_figma body. Injected above: PAGES, MODE ('own' | 'inst'), KM ({hugeName:{S,F}}), ICO (Set of Iconography keys used in file)
const MAP = {
  'iconswaps/add': 'add-01', 'iconswaps/qrcode': 'qr-code', 'iconswaps/search': 'search-01', 'iconswapb/search': 'search-01', 'magnifier': 'search-01',
  'iconswaps/chevronright': 'arrow-right-01', 'arrow-right': 'arrow-right-01', 'iconswaps/drag': 'drag-drop-vertical', 'iconswaps/cancel': 'cancel-01',
  'iconswaps/cancelcircle': 'cancel-circle', 'iconswaps/viewoff': 'view-off', 'iconswaps/smartphone': 'smart-phone-01', 'xmark': 'cancel-01',
  'chevron-left': 'arrow-left-01', 'check': 'tick-02', 'minus': 'minus-sign', 'filter': 'filter', 'triangle-warning': 'alert-02', 'ic.chevrondown': 'arrow-down-01',
};
const NAV = { 'home': 'home-08', 'transfer': 'circle-arrow-data-transfer-horizontal', 'giao dịch': 'invoice-03', 'tài khoản': 'user-circle' };
const DETACH_ONLY = new Set(['icons', 'search glass']);
const hex8 = (c, a) => '#' + [c.r, c.g, c.b, a === undefined ? 1 : a].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const GT = cols.find((c) => c.name.trim() === 'Global Themes'), PR = cols.find((c) => c.name.trim() === 'Primitive Colors');
async function valIn(v, c, modeName) {
  const m = c.modes.find((x) => x.name === modeName) || c.modes[0];
  let raw = v.valuesByMode[m.modeId], d = 0;
  while (raw && raw.type === 'VARIABLE_ALIAS' && d++ < 8) { const t = await figma.variables.getVariableByIdAsync(raw.id); const tc = await figma.variables.getVariableCollectionByIdAsync(t.variableCollectionId); const tm = tc.modes.find((x) => x.name === modeName) || tc.modes[0]; raw = t.valuesByMode[tm.modeId]; }
  return raw;
}
const FG = [], PRIM = [];
for (const id of GT.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); if (v.resolvedType !== 'COLOR') continue; const a = await valIn(v, GT, 'VSP Light'); if (a && a.r !== undefined) FG.push({ v, hex: hex8(a, a.a), fg: v.name.startsWith('Foreground/') }); }
FG.sort((a, b) => b.fg - a.fg);
for (const id of PR.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); const a = await valIn(v, PR, ''); if (a && a.r !== undefined) PRIM.push({ v, hex: hex8(a, a.a) }); }
const colorVar = (hex) => (FG.find((e) => e.hex === hex) || PRIM.find((e) => e.hex === hex) || {}).v || null;

const compCache = new Map();
const importKey = async (key) => { if (!compCache.has(key)) { let c = null; try { c = await figma.importComponentByKeyAsync(key); } catch (e) { c = null; } compCache.set(key, c); } return compCache.get(key); };
const rnameOf = (mc) => (mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent.name : mc.name).trim();
const vpOf = (mc) => { try { return mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.variantProperties || {} : {}; } catch (e) { return {}; } };
const isHuge = (mc) => { try { return ICO.has(mc.key) || (mc.parent && mc.parent.type === 'COMPONENT_SET' && (ICO.has(mc.parent.key) || /^Style=/.test(mc.name))); } catch (e) { return false; } };
const isIconName = (nm) => nm === 'iconsystem' || nm === 'icon' || nm in MAP || DETACH_ONLY.has(nm);

function findColor(root) {
  const q = [root];
  let best = null;
  while (q.length) {
    const n = q.shift();
    if (n.visible === false) continue;
    if (n !== root && (n.type === 'BOOLEAN_OPERATION' || n.type === 'VECTOR' || n.type === 'ELLIPSE' || n.type === 'RECTANGLE')) {
      for (const key of ['fills', 'strokes']) {
        const ps = n[key];
        if (Array.isArray(ps)) { const p = ps.find((x) => x.type === 'SOLID' && x.visible !== false); if (p && (key === 'fills' || (n.strokeWeight || 0) > 0)) { best = { c: p.color, a: p.opacity === undefined ? 1 : p.opacity }; break; } }
      }
      if (best) break;
    }
    if ('children' in n) q.push(...n.children);
  }
  return best;
}
function isSolid(root, nm, vp) {
  if (nm === 'filter') return /fill|solid/i.test(JSON.stringify(vp));
  if (nm === 'icon') return /active/i.test(vp.State || '');
  const solid = root.findOne ? root.findOne((x) => x.name === 'solid') : null;
  const stroke = root.findOne ? root.findOne((x) => x.name === 'stroke') : null;
  return !!(solid && solid.visible && !(stroke && stroke.visible));
}
function paintWith(inst, col) {
  if (!col) return 'nocolor';
  const hex = hex8(col.c, col.a);
  const v = colorVar(hex);
  let base = { type: 'SOLID', color: { r: col.c.r, g: col.c.g, b: col.c.b }, opacity: col.a };
  if (v) base = figma.variables.setBoundVariableForPaint(base, 'color', v);
  for (const n of inst.findAll((x) => ['VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE', 'RECTANGLE', 'LINE', 'POLYGON', 'STAR'].includes(x.type))) {
    if (Array.isArray(n.strokes) && n.strokes.length) n.strokes = [base];
    if (Array.isArray(n.fills) && n.fills.length && n.fills.some((p) => p.visible !== false)) n.fills = [base];
  }
  return v ? v.name : 'RAW ' + hex;
}

const S = { swapped: {}, detached: {}, colors: {}, propDefaults: 0, skippedInsideInstance: {}, errors: [] };
const bump = (o, k) => (o[k] = (o[k] || 0) + 1);
const editedProps = new Set();

async function handle(inst, canDetach) {
  const mc = await inst.getMainComponentAsync();
  if (!mc || !mc.remote || isHuge(mc)) return false;
  const nm = rnameOf(mc).toLowerCase();
  if (!isIconName(nm)) return false;
  const vp = vpOf(mc);
  let target = null, src = inst, label = nm;
  if (DETACH_ONLY.has(nm)) target = null;
  else if (nm === 'icon') { const t = (vp.Type || '').toLowerCase(); target = NAV[t] ? { set: NAV[t], solid: isSolid(inst, nm, vp) } : null; label = 'icon/' + t; }
  else if (nm === 'iconsystem') {
    const inner = inst.findOne((x) => x.type === 'INSTANCE');
    const imc = inner ? await inner.getMainComponentAsync() : null;
    if (imc && isHuge(imc)) { target = { comp: imc }; label = 'iconsystem>' + rnameOf(imc); }
    else if (imc) { const inm = rnameOf(imc).toLowerCase(); label = 'iconsystem>' + inm; if (MAP[inm]) target = { set: MAP[inm], solid: isSolid(inner, inm, vpOf(imc)) }; src = inner; }
  } else target = { set: MAP[nm], solid: isSolid(inst, nm, vp) };

  let comp = null;
  if (target && target.comp) comp = target.comp;
  else if (target && KM[target.set]) comp = await importKey(target.solid ? KM[target.set].F : KM[target.set].S);

  if (!comp) {
    if (!canDetach) { bump(S.skippedInsideInstance, label); return false; }
    inst.detachInstance(); bump(S.detached, label); return true;
  }
  const w0 = inst.width, h0 = inst.height;
  const col = findColor(src);
  const propRef = inst.componentPropertyReferences && inst.componentPropertyReferences.mainComponent;
  inst.swapComponent(comp);
  if (Math.abs(inst.width - w0) > 0.5 || Math.abs(inst.height - h0) > 0.5) { try { inst.rescale(w0 / inst.width); } catch (e) { try { inst.resize(w0, h0); } catch (e2) {} } }
  for (const cid of Object.keys(inst.explicitVariableModes || {})) { try { const c = await figma.variables.getVariableCollectionByIdAsync(cid); if (c && c.remote) inst.clearExplicitVariableModeForCollection(c); } catch (e) {} }
  bump(S.colors, paintWith(inst, col));
  bump(S.swapped, label + ' → ' + rnameOf(comp) + (target.comp ? '' : target.solid ? ' (Solid)' : ' (Stroke)'));
  if (propRef && canDetach) {
    let owner = inst.parent;
    while (owner && owner.type !== 'COMPONENT' && owner.type !== 'COMPONENT_SET' && owner.type !== 'PAGE') owner = owner.parent;
    if (owner && owner.type === 'COMPONENT' && owner.parent && owner.parent.type === 'COMPONENT_SET') owner = owner.parent;
    const k = owner && owner.id + '|' + propRef;
    if (owner && owner.type !== 'PAGE' && !editedProps.has(k)) {
      try { owner.editComponentProperty(propRef, { defaultValue: comp.id }); editedProps.add(k); S.propDefaults++; } catch (e) { S.errors.push('prop ' + propRef + ' on ' + owner.name + ': ' + String(e.message).slice(0, 80)); editedProps.add(k); }
    }
  }
  return true;
}

for (const pid of PAGES) {
  const page = await figma.getNodeByIdAsync(pid);
  await page.loadAsync();
  for (let round = 0; round < 5; round++) {
    const cands = [];
    const walk = async (n, inLocal) => {
      if (n.type === 'INSTANCE') {
        const mc = await n.getMainComponentAsync();
        if (mc && mc.remote) { if ((MODE === 'own' && !inLocal) || (MODE === 'inst' && inLocal)) cands.push(n); return; }
        if ('children' in n) for (const c of n.children) await walk(c, true);
        return;
      }
      if ('children' in n) for (const c of n.children) await walk(c, inLocal);
    };
    for (const c of page.children) await walk(c, false);
    let changed = 0;
    for (const inst of cands) {
      try { if (!inst.removed && await handle(inst, MODE === 'own')) changed++; } catch (e) { S.errors.push(page.name + ' ' + inst.id + ': ' + String(e.message).slice(0, 120)); }
    }
    if (!changed || MODE === 'inst') break;
  }
}
const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
return { mode: MODE, totals: { swapped: sum(S.swapped), detached: sum(S.detached), skippedInsideInstance: sum(S.skippedInsideInstance), propDefaults: S.propDefaults }, errorCount: S.errors.length, errors: S.errors.slice(0, 15), swapped: S.swapped, detached: S.detached, colors: S.colors, skippedInsideInstance: S.skippedInsideInstance };
