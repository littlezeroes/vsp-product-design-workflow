import type { MeshPhysicalMaterialParameters } from "three";

/** Proposed decor extension; not yet synced to the Figma DLS.
 * Pair one dominant family with one secondary family and neutral surfaces.
 * Resolve colorToken on the owning element with getComputedStyle in the browser.
 * Use subtle CSS tokens for UI backgrounds, semantic foreground tokens for text.
 */
export const decorColorTokens = {
  sand: "--decor-sand",
  clay: "--decor-clay",
  butter: "--decor-butter",
  sage: "--decor-sage",
  lagoon: "--decor-lagoon",
  denim: "--decor-denim",
  lilac: "--decor-lilac",
  rose: "--decor-rose",
} as const;

export type DecorColor = keyof typeof decorColorTokens;

/** Starting points for MeshPhysicalMaterial, tuned further under shared lighting.
 * Felt and paper need authored texture/normal maps for visible fibers or grain.
 * Frosted glass needs an environment and geometry thickness to read correctly.
 * Keep metal for small accents rather than applying it to every mesh.
 */
export const decorMaterialPresets = {
  ceramic: { metalness: 0, roughness: 0.65, clearcoat: 0.12, clearcoatRoughness: 0.5 },
  frostedGlass: { metalness: 0, roughness: 0.35, transmission: 0.8, thickness: 0.6, ior: 1.45 },
  paper: { metalness: 0, roughness: 0.95 },
  stone: { metalness: 0, roughness: 0.85 },
  felt: { metalness: 0, roughness: 1, sheen: 0.3, sheenRoughness: 1 },
  satin: { metalness: 0, roughness: 0.4, clearcoat: 0.2, clearcoatRoughness: 0.45 },
  metalAccent: { metalness: 0.8, roughness: 0.28 },
} as const satisfies Record<string, MeshPhysicalMaterialParameters>;

export const decorStarterPalette = {
  primary: { colorToken: decorColorTokens.sand, material: "stone" },
  secondary: { colorToken: decorColorTokens.sage, material: "ceramic" },
  warmAccent: { colorToken: decorColorTokens.clay, material: "ceramic" },
  glassAccent: { colorToken: decorColorTokens.lagoon, material: "frostedGlass" },
} as const;
