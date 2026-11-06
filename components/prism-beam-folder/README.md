Prism Beam Folder — Native Cook web port

Source:
https://github.com/Native-Cook/native-cook/tree/main/react-native/src/blocks/animations/prism-beam-folder
The five original files are retained as text snapshots in
output/prism-beam-folder/reference/. No dependency or lockfile was changed.

Routes:
- /prism-beam-folder: hold the folder to pour picks; release to finish and close.
- /prism-beam-folder?autoplay=1: the original 8-second, nine-pick loop.

Implementation:
- prismBeamMotion.ts is copied byte-for-byte from the reference. This preserves
  session behavior, geometry, spring formulas, item paths, the 8-second script,
  touch takeover, close-after-last-landing and idle resumption.
- beamShader.ts retains BEAM_SKSL and mechanically translates its types and
  entry point to GLSL. One WebGL shader renders the beam. Display P3 conversion
  is retained on Display P3 drawing buffers; sRGB buffers emit the original
  sRGB palette directly. No CSS gradient is substituted for the beam.
- prismBeamArt.ts retains every reference item/folder path and gradient. Only
  the drawing helpers and native API calls are adapted from Skia to Canvas2D.
- PrismBeamFolder.tsx retains the stage drawing order and source label layout.
  Text stays in the DOM. Existing VSP Button supplies the invisible hold target.
- All colors are the reference palette. No external image or font is required.

Platform adaptations:
This is the existing Next.js app, not a React Native integration. Touch uses
pointer capture; Space/Enter hold/release provides a keyboard equivalent.
Browser vibration is optional and absent on iOS Safari. The stage caps at 480px
on desktop. It uses 54px/34px safe-area equivalents (24px top on short screens).
The project's home indicator is included. Source layout takes precedence over
VSP spacing for this faithful demo. Canvas drawing resolution caps at DPR 2.

Reduced Motion renders scriptFrame(3.8) once, with no animation or interaction.
Its count label is made fully readable rather than frozen mid-crossfade.
WebGL failures produce a visible error instead of a substitute animation.
The demo saves no real grocery data; count and badge clear as in the source.

Verification:
- Scoped ESLint and TypeScript checks pass.
- node scripts/prism-beam-folder-check.cjs checks the runtime shader, manual
  hold/pour/release, item landings, counts, badge, delayed close, pointer cancel,
  keyboard, 320/768/1440px layouts, static Reduced Motion, nine-item autoplay,
  seamless touch takeover and loop restart. BASE_URL defaults to localhost:3000.
- Emulated touch hold/release and live reduced-motion preference changes pass.
- Screenshots are in output/prism-beam-folder/. Visual inspection includes
  the local Native Cook reference video. No strict pixel-diff pass or native
  simulator/device validation is claimed.
- Full-project TypeScript has known unrelated errors from before this port;
  no existing files outside this block were changed.
