figma.showUI(__html__, { width: 460, height: 620 });

const norm = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/\[(vsp|vpay)\]|_?\((v2cake|local-bank)\)|🔒|❖/g, '')
    .replace(/[^a-z0-9/]/g, '');

const normProps = (p) => {
  const out = {};
  for (const [k, v] of Object.entries(p || {})) out[norm(k)] = norm(String(v));
  return out;
};

let L = null;
const fontCache = new Set();

async function loadFonts(textNode) {
  if (textNode.characters.length === 0) {
    if (textNode.fontName !== figma.mixed) await loadFont(textNode.fontName);
    return;
  }
  for (const f of textNode.getRangeAllFontNames(0, textNode.characters.length)) await loadFont(f);
}
async function loadFont(f) {
  const k = f.family + '|' + f.style;
  if (fontCache.has(k)) return;
  await figma.loadFontAsync(f);
  fontCache.add(k);
}

async function indexLocal() {
  await figma.loadAllPagesAsync();
  const varByName = new Map();
  for (const v of await figma.variables.getLocalVariablesAsync()) {
    varByName.set(v.resolvedType + '|' + v.name.toLowerCase(), v);
  }
  const styleByName = new Map();
  const lists = [
    ['TEXT', await figma.getLocalTextStylesAsync()],
    ['PAINT', await figma.getLocalPaintStylesAsync()],
    ['EFFECT', await figma.getLocalEffectStylesAsync()],
  ];
  for (const [t, list] of lists) for (const s of list) styleByName.set(t + '|' + s.name.toLowerCase(), s);

  const compByName = new Map();
  const duplicates = [];
  const nodes = figma.root.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] });
  for (const n of nodes) {
    if (n.type === 'COMPONENT' && n.parent && n.parent.type === 'COMPONENT_SET') continue;
    const k = norm(n.name);
    if (compByName.has(k)) duplicates.push(n.name);
    else compByName.set(k, n);
  }
  L = { varByName, styleByName, compByName, duplicates };
}

function pagesFor(scope) {
  return scope === 'all' ? figma.root.children : [figma.currentPage];
}

// Nodes whose id starts with "I" live inside an instance and inherit from their main component,
// so only the definition layers (outside instances) are touched.
async function ownNodes(page, types) {
  await page.loadAsync();
  return types ? page.findAllWithCriteria({ types }) : page.findAll(() => true);
}
const isOwn = (n) => !n.id.startsWith('I');

function bump(map, key, extra) {
  const e = map.get(key) || Object.assign({ count: 0 }, extra);
  e.count++;
  map.set(key, e);
}

function progress(msg) {
  figma.ui.postMessage({ type: 'progress', msg });
}

async function passInstances(scope, mapping, apply) {
  const stats = new Map();
  let swapped = 0;
  for (const page of pagesFor(scope)) {
    progress('Instances · ' + page.name);
    const insts = (await ownNodes(page, ['INSTANCE'])).filter(isOwn);
    for (const inst of insts) {
      const mc = await inst.getMainComponentAsync();
      if (!mc || !mc.remote) continue;
      const isVariant = mc.parent && mc.parent.type === 'COMPONENT_SET';
      const remoteName = isVariant ? mc.parent.name : mc.name;
      const targetName = mapping[remoteName];
      const target = L.compByName.get(norm(targetName || remoteName));
      let dest = null;
      let reason = 'no local component';
      if (target && target.type === 'COMPONENT') {
        dest = target;
      } else if (target && target.type === 'COMPONENT_SET') {
        const want = normProps(isVariant ? mc.variantProperties : {});
        const hits = target.children.filter((c) => {
          const have = normProps(c.variantProperties);
          return Object.entries(want).every(([k, v]) => have[k] === v);
        });
        dest = hits.includes(target.defaultVariant) ? target.defaultVariant : hits[0] || null;
        if (!dest) reason = 'variant not found: ' + JSON.stringify(mc.variantProperties);
      }
      const key = remoteName + (dest ? '' : '  ✗ ' + reason);
      bump(stats, key, { remote: remoteName, target: dest ? (dest.parent.type === 'COMPONENT_SET' ? dest.parent.name : dest.name) : null, page: page.name });
      if (apply && dest) {
        inst.swapComponent(dest);
        swapped++;
      }
    }
  }
  return { stats: [...stats.values()], swapped };
}

const STYLE_FIELDS = [
  ['fillStyleId', 'PAINT', 'setFillStyleIdAsync'],
  ['strokeStyleId', 'PAINT', 'setStrokeStyleIdAsync'],
  ['effectStyleId', 'EFFECT', 'setEffectStyleIdAsync'],
  ['textStyleId', 'TEXT', 'setTextStyleIdAsync'],
];

async function passStyles(scope, mapping, apply) {
  const stats = new Map();
  let fixed = 0;
  const styleCache = new Map();
  const getStyle = async (id) => {
    if (!styleCache.has(id)) styleCache.set(id, await figma.getStyleByIdAsync(id));
    return styleCache.get(id);
  };
  const resolve = (st) => L.styleByName.get(st.type + '|' + (mapping[st.name] || st.name).toLowerCase());

  for (const page of pagesFor(scope)) {
    progress('Styles · ' + page.name);
    for (const n of (await ownNodes(page)).filter(isOwn)) {
      for (const [field, , setter] of STYLE_FIELDS) {
        if (!(field in n)) continue;
        const id = n[field];
        if (id === figma.mixed && field === 'textStyleId') {
          for (const seg of n.getStyledTextSegments(['textStyleId'])) {
            if (!seg.textStyleId) continue;
            const st = await getStyle(seg.textStyleId);
            if (!st || !st.remote) continue;
            const tgt = resolve(st);
            bump(stats, st.type + ' · ' + st.name, { remote: st.name, target: tgt ? tgt.name : null });
            if (apply && tgt) {
              await loadFonts(n);
              await loadFont(tgt.fontName);
              await n.setRangeTextStyleIdAsync(seg.start, seg.end, tgt.id);
              fixed++;
            }
          }
          continue;
        }
        if (!id || id === figma.mixed) continue;
        const st = await getStyle(id);
        if (!st || !st.remote) continue;
        const tgt = resolve(st);
        bump(stats, st.type + ' · ' + st.name, { remote: st.name, target: tgt ? tgt.name : null });
        if (apply && tgt) {
          if (n.type === 'TEXT') await loadFonts(n);
          if (tgt.type === 'TEXT') await loadFont(tgt.fontName);
          await n[setter](tgt.id);
          fixed++;
        }
      }
    }
  }
  return { stats: [...stats.values()], fixed };
}

async function passVariables(scope, mapping, apply) {
  const stats = new Map();
  let fixed = 0;
  let skipped = 0;
  const varCache = new Map();
  const getVar = async (id) => {
    if (!varCache.has(id)) varCache.set(id, await figma.variables.getVariableByIdAsync(id));
    return varCache.get(id);
  };
  const localFor = async (alias) => {
    const v = await getVar(alias.id);
    if (!v || !v.remote) return { remote: false };
    const tgt = L.varByName.get(v.resolvedType + '|' + (mapping[v.name] || v.name).toLowerCase());
    bump(stats, v.resolvedType + ' · ' + v.name, { remote: v.name, target: tgt ? tgt.name : null });
    return { remote: true, tgt };
  };

  for (const page of pagesFor(scope)) {
    progress('Variables · ' + page.name);
    for (const n of (await ownNodes(page)).filter(isOwn)) {
      const bv = n.boundVariables;
      if (!bv) continue;
      let fontsReady = false;
      const ready = async () => {
        if (!fontsReady && n.type === 'TEXT') await loadFonts(n);
        fontsReady = true;
      };

      for (const [field, val] of Object.entries(bv)) {
        if (field === 'fills' || field === 'strokes') {
          const paints = n[field];
          if (paints === figma.mixed) { skipped++; continue; }
          let changed = false;
          const next = [];
          for (const p of paints) {
            const alias = p.boundVariables && p.boundVariables.color;
            if (alias) {
              const r = await localFor(alias);
              if (r.tgt && apply) {
                next.push(figma.variables.setBoundVariableForPaint(p, 'color', r.tgt));
                changed = true;
                continue;
              }
            }
            next.push(p);
          }
          if (changed) { await ready(); n[field] = next; fixed++; }
        } else if (field === 'effects') {
          let changed = false;
          const next = [];
          for (const e of n.effects) {
            let cur = e;
            for (const [ef, alias] of Object.entries(e.boundVariables || {})) {
              const r = await localFor(alias);
              if (r.tgt && apply) { cur = figma.variables.setBoundVariableForEffect(cur, ef, r.tgt); changed = true; }
            }
            next.push(cur);
          }
          if (changed) { n.effects = next; fixed++; }
        } else if (val && !Array.isArray(val) && val.type === 'VARIABLE_ALIAS') {
          const r = await localFor(val);
          if (r.tgt && apply) {
            try { await ready(); n.setBoundVariable(field, r.tgt); fixed++; } catch (e) { skipped++; }
          }
        } else if (Array.isArray(val) || (val && typeof val === 'object')) {
          // textRangeFills, layoutGrids, componentProperties: count only, fix manually
          const aliases = Array.isArray(val) ? val : Object.values(val);
          for (const a of aliases) if (a && a.type === 'VARIABLE_ALIAS') { const r = await localFor(a); if (r.remote) skipped++; }
        }
      }
    }
  }
  return { stats: [...stats.values()], fixed, skipped };
}

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'run') return;
  try {
    progress('Indexing local components, styles, variables…');
    await indexLocal();
    const out = { scope: msg.scope, apply: msg.apply, duplicates: L.duplicates };
    if (msg.passes.includes('instances')) out.instances = await passInstances(msg.scope, msg.mapping.components || {}, msg.apply);
    if (msg.passes.includes('styles')) out.styles = await passStyles(msg.scope, msg.mapping.styles || {}, msg.apply);
    if (msg.passes.includes('variables')) out.variables = await passVariables(msg.scope, msg.mapping.variables || {}, msg.apply);
    figma.ui.postMessage({ type: 'done', out });
    if (msg.apply) figma.notify('VSP DS Migrator: applied. Cmd+Z to undo.');
  } catch (e) {
    figma.ui.postMessage({ type: 'error', msg: String(e && e.stack || e) });
  }
};
