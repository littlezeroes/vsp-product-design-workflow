// use_figma body. Injected above: PAGES
const isHuge = (c) => { try { return c && c.parent && c.parent.type === 'COMPONENT_SET' && /^Style=/.test(c.name); } catch (e) { return false; } };
const vCache = new Map();
const badVar = async (id) => {
  if (!id || id.indexOf('/') < 0) return false;
  if (!vCache.has(id)) {
    let v = null; try { v = await figma.variables.getVariableByIdAsync(id); } catch (e) {}
    let bad = true;
    if (v && v.remote) { let c = null; try { c = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId); } catch (e) {} bad = !(c && c.name === 'Sematic Colors'); }
    else if (v && !v.remote) bad = false;
    vCache.set(id, bad);
  }
  return vCache.get(id);
};
const sCache = new Map();
const localStyles = [...await figma.getLocalTextStylesAsync(), ...await figma.getLocalPaintStylesAsync(), ...await figma.getLocalEffectStylesAsync(), ...await figma.getLocalGridStylesAsync()];
const styleFix = async (id) => { // returns undefined if fine, else replacement id ('' = detach)
  if (!id || id === figma.mixed) return undefined;
  if (!sCache.has(id)) {
    let s = null; try { s = await figma.getStyleByIdAsync(id); } catch (e) {}
    if (s && !s.remote) sCache.set(id, undefined);
    else { const nm = s ? s.name : null; const t = nm && localStyles.find((x) => x.type === s.type && x.name.toLowerCase() === nm.toLowerCase()); sCache.set(id, t ? t.id : ''); }
  }
  return sCache.get(id);
};
const fontCache = new Set();
const loadFonts = async (t) => { const fs = t.characters.length ? t.getRangeAllFontNames(0, t.characters.length) : (t.fontName !== figma.mixed ? [t.fontName] : []); for (const f of fs) { const k = f.family + f.style; if (!fontCache.has(k)) { await figma.loadFontAsync(f); fontCache.add(k); } } };
const S = { pageModes: 0, vars: 0, styles: 0, instDetached: 0, instReverted: 0, instLeft: [], errors: [] };
async function fixPaintArr(paints) {
  let ch = false; const out = [];
  for (const p of paints) {
    let q = p;
    const a = p.boundVariables && p.boundVariables.color;
    if (a && await badVar(a.id)) { q = figma.variables.setBoundVariableForPaint(q, 'color', null); ch = true; S.vars++; }
    if (q.gradientStops && q.gradientStops.some((s) => s.boundVariables && s.boundVariables.color)) {
      const stops = [];
      for (const s of q.gradientStops) { if (s.boundVariables && s.boundVariables.color && await badVar(s.boundVariables.color.id)) { stops.push({ position: s.position, color: s.color }); ch = true; S.vars++; } else stops.push(s); }
      q = { ...q, gradientStops: stops };
    }
    out.push(q);
  }
  return ch ? out : null;
}
async function fixNode(n) {
  // styles
  for (const [f, setter] of [['fillStyleId', 'setFillStyleIdAsync'], ['strokeStyleId', 'setStrokeStyleIdAsync'], ['effectStyleId', 'setEffectStyleIdAsync'], ['gridStyleId', 'setGridStyleIdAsync'], ['textStyleId', 'setTextStyleIdAsync']]) {
    if (!(f in n)) continue;
    const id = n[f];
    if (id === figma.mixed && n.type === 'TEXT') {
      const segField = f === 'textStyleId' ? 'textStyleId' : f === 'fillStyleId' ? 'fillStyleId' : null;
      if (!segField) continue;
      for (const seg of n.getStyledTextSegments([segField])) { const r = await styleFix(seg[segField]); if (r !== undefined) { await loadFonts(n); if (segField === 'textStyleId') await n.setRangeTextStyleIdAsync(seg.start, seg.end, r); else await n.setRangeFillStyleIdAsync(seg.start, seg.end, r); S.styles++; } }
      continue;
    }
    const r = await styleFix(id);
    if (r !== undefined) { if (n.type === 'TEXT') await loadFonts(n); await n[setter](r); S.styles++; }
  }
  // text ranges
  if (n.type === 'TEXT') {
    for (const seg of n.getStyledTextSegments(['boundVariables', 'fills'])) {
      for (const [f, a] of Object.entries(seg.boundVariables || {})) { if (a && a.id && await badVar(a.id)) { await loadFonts(n); n.setRangeBoundVariable(seg.start, seg.end, f, null); S.vars++; } }
      const np = await fixPaintArr(seg.fills || []); if (np) { await loadFonts(n); n.setRangeFills(seg.start, seg.end, np); }
    }
  }
  // node-level
  for (const [field, val] of Object.entries(n.boundVariables || {})) {
    if (field === 'fills' || field === 'strokes') { if (n[field] === figma.mixed) continue; const np = await fixPaintArr(n[field]); if (np) { if (n.type === 'TEXT') await loadFonts(n); n[field] = np; } }
    else if (field === 'effects') { let ch = false; const nx = []; for (const e of n.effects) { let c = e; for (const [k, a] of Object.entries(e.boundVariables || {})) { if (a && await badVar(a.id)) { c = figma.variables.setBoundVariableForEffect(c, k, null); ch = true; S.vars++; } } nx.push(c); } if (ch) n.effects = nx; }
    else if (field === 'componentProperties') { for (const [p, a] of Object.entries(val || {})) { if (a && await badVar(a.id)) { try { const cur = n.componentProperties[p].value; n.setProperties({ [p]: cur }); S.vars++; } catch (e) {} } } }
    else if (val && val.type === 'VARIABLE_ALIAS') { if (await badVar(val.id)) { const cur = n[field]; if (n.type === 'TEXT') await loadFonts(n); n.setBoundVariable(field, null); try { if (cur !== undefined && cur !== figma.mixed) n[field] = cur; } catch (e) {} S.vars++; } }
    else if (Array.isArray(val) && field !== 'fills' && field !== 'strokes') { for (const a of val) if (a && await badVar(a.id)) S.errors.push(n.id + ' array field ' + field); }
  }
  // gradient stops that are bound without node-level boundVariables entry
  for (const k of ['fills', 'strokes']) { if (!(k in n) || !Array.isArray(n[k])) continue; if (n[k].some((p) => p.gradientStops && p.gradientStops.some((s) => s.boundVariables && s.boundVariables.color))) { const np = await fixPaintArr(n[k]); if (np) n[k] = np; } }
}
for (const pid of PAGES) {
  const page = await figma.getNodeByIdAsync(pid);
  await page.loadAsync();
  for (const cid of Object.keys(page.explicitVariableModes || {})) {
    if (cid.indexOf('/') < 0) continue;
    let c = null; try { c = await figma.variables.getVariableCollectionByIdAsync(cid); } catch (e) {}
    try { if (c) page.clearExplicitVariableModeForCollection(c); else page.clearExplicitVariableModeForCollection(cid); S.pageModes++; } catch (e) { S.errors.push(page.name + ' page mode ' + cid.slice(-12) + ': ' + String(e.message).slice(0, 60)); }
  }
  // instances with missing / external mains
  for (let round = 0; round < 5; round++) {
    let ch = 0;
    for (const inst of page.findAllWithCriteria({ types: ['INSTANCE'] })) {
      if (inst.removed) continue;
      let mc = null; try { mc = await inst.getMainComponentAsync(); } catch (e) {}
      if (mc && (!mc.remote || isHuge(mc))) continue;
      try {
        if (!inst.id.startsWith('I')) { inst.detachInstance(); S.instDetached++; ch++; continue; }
        const cp = await figma.getNodeByIdAsync(inst.id.split(';').pop());
        let t = null;
        if (cp && cp.type === 'INSTANCE') { const m2 = await cp.getMainComponentAsync(); if (m2 && (!m2.remote || isHuge(m2))) t = m2; }
        else if (cp && cp.type === 'COMPONENT') t = cp;
        if (t) { inst.swapComponent(t); S.instReverted++; ch++; } else S.instLeft.push(page.name + ' ' + inst.id + ' ' + (mc ? mc.name : 'missing'));
      } catch (e) { S.errors.push(inst.id + ' ' + String(e.message).slice(0, 80)); }
    }
    if (!ch) break;
  }
  for (const n of page.findAll(() => true)) {
    for (const cid of Object.keys(n.explicitVariableModes || {})) {
      if (cid.indexOf('/') < 0) continue;
      let c = null; try { c = await figma.variables.getVariableCollectionByIdAsync(cid); } catch (e) {}
      if (c && c.name === 'Sematic Colors') continue;
      try { if (c) n.clearExplicitVariableModeForCollection(c); else n.clearExplicitVariableModeForCollection(cid); S.pageModes++; } catch (e) {}
    }
    try { await fixNode(n); } catch (e) { if (S.errors.length < 20) S.errors.push(page.name + ' ' + n.id + ' ' + String(e.message).slice(0, 90)); }
  }
}
S.instLeft = S.instLeft.slice(0, 15);
S.errors = S.errors.slice(0, 15);
return S;
