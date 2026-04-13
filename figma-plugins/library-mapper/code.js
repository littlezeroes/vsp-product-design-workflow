// Library Mapper — No API needed
// Step 1: Run in library file → Export components
// Step 2: Run in design file → Swap by name match

figma.showUI(__html__, { width: 480, height: 560 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-library") {
    await exportLibrary();
  }
  if (msg.type === "swap") {
    await swapInstances();
  }
  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};

// ─── EXPORT: run in LIBRARY file ────────────────────────────────

async function exportLibrary() {
  const catalog = {};
  let count = 0;

  for (const page of figma.root.children) {
    await figma.setCurrentPageAsync(page);

    // Component Sets + their variants
    const sets = page.findAll(n => n.type === "COMPONENT_SET");
    for (const cs of sets) {
      for (const c of cs.children) {
        if (c.type === "COMPONENT") {
          const key = cs.name + "::" + c.name;
          catalog[key] = c.key;
          count++;
        }
      }
    }

    // Standalone components
    const standalones = page.findAll(n =>
      n.type === "COMPONENT" && (!n.parent || n.parent.type !== "COMPONENT_SET")
    );
    for (const c of standalones) {
      catalog[c.name] = c.key;
      count++;
    }

    figma.ui.postMessage({ type: "export-progress", page: page.name, count });
  }

  // Save to clientStorage (persists across files)
  await figma.clientStorage.setAsync("library-catalog", catalog);
  await figma.clientStorage.setAsync("library-name", figma.root.name);
  await figma.clientStorage.setAsync("library-count", count);

  figma.ui.postMessage({ type: "export-done", count, fileName: figma.root.name });
}

// ─── SWAP: run in DESIGN file ───────────────────────────────────

async function swapInstances() {
  // Load catalog from storage
  const catalog = await figma.clientStorage.getAsync("library-catalog");
  if (!catalog || Object.keys(catalog).length === 0) {
    figma.ui.postMessage({ type: "swap-error", error: "No library exported yet. Open the library file and click Export first." });
    return;
  }

  const cache = {};
  let swapped = 0, skipped = 0, broken = 0, alreadyOk = 0;
  const pageResults = [];
  const unmatchedNames = {};
  const pages = figma.root.children;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    await figma.setCurrentPageAsync(page);
    const instances = page.findAll(n => n.type === "INSTANCE");
    if (instances.length === 0) continue;

    let pageSw = 0;

    for (const inst of instances) {
      let mc;
      try { mc = inst.mainComponent; } catch (e) { broken++; continue; }
      if (!mc || !mc.remote) { skipped++; continue; }

      // Build lookup key
      let setName = null;
      try {
        if (mc.parent && mc.parent.type === "COMPONENT_SET") setName = mc.parent.name;
      } catch (e) {}

      const lookupKey = setName ? setName + "::" + mc.name : mc.name;
      const newKey = catalog[lookupKey];

      if (!newKey) {
        if (!unmatchedNames[lookupKey]) unmatchedNames[lookupKey] = 0;
        unmatchedNames[lookupKey]++;
        skipped++;
        continue;
      }
      if (mc.key === newKey) { alreadyOk++; continue; }

      try {
        if (!cache[newKey]) cache[newKey] = await figma.importComponentByKeyAsync(newKey);
        inst.swapComponent(cache[newKey]);
        swapped++;
        pageSw++;
      } catch (e) { broken++; }
    }

    if (pageSw > 0) pageResults.push({ page: page.name, swapped: pageSw });

    figma.ui.postMessage({
      type: "swap-progress",
      pageIndex: i + 1,
      totalPages: pages.length,
      page: page.name,
      swapped,
    });
  }

  // Top unmatched
  const topUnmatched = Object.entries(unmatchedNames)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name, count]) => ({ name, count }));

  figma.ui.postMessage({
    type: "swap-done",
    swapped, skipped, broken, alreadyOk,
    pages: pageResults,
    unmatched: topUnmatched,
  });
}
