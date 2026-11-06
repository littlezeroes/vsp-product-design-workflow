# Trading Bots Onboarding — web port

Reference: https://nativecook.dev/blocks/trading-bots-onboarding/
Source: https://github.com/Native-Cook/native-cook/tree/main/react-native/src/blocks/onboarding/trading-bots-onboarding
Retrieved: 2026-11-06. Original source snapshots: `output/trading-bots-source/`.

This route ports the six original scene components, flow reducer, glyph paths, palette,
402 × 874 point geometry, counters and spring parameters to Next.js. Original PNG assets
are in `public/trading-bots/`. No additional dependencies were installed.

- `native.tsx`: native flex styles and interactions mapped to DOM, using the host Button.
- `motion.tsx`: analytic damped springs using the source mass, stiffness and damping;
  native cubic timing curves evaluated on requestAnimationFrame.
- `skia.tsx`: Skia paths/gradients to SVG, the original wallet/orb shader expressions to GLSL.
- `characters.tsx`: original character body assets and measured vector eye geometry.
- `page.tsx`: original six-stage flow, CTA, Pro focus handoff, local detail sheets.

Open `/trading-bots-onboarding`. Optional query parameters follow the demo:
`step=0…5`, `holdFocus=1`, `autoplay=1`. Default autoplay is off.
Right click Back/progress for the scene picker. Controls work with pointer and keyboard.
System `prefers-reduced-motion` skips animated counters and card motion.

Platform differences: browser system font replaces SF Pro; Lucide glyphs replace SF Symbols;
SVG anti-aliasing/blur and WebGL output can differ from Skia/Metal. Native platform billing,
haptics and authentication are not provided; reference details remain local demo sheets.
This is editable web UI, not a video or screenshot used as the screen.

Verification: six scene screenshots, navigation, carousel selection, allocation keyboard
adjustment, risk selection, toggles, Pro focus, detail sheets, compact viewport and reduced
motion in Playwright. Full-repository typecheck has pre-existing errors outside this route;
check route diagnostics independently. No claim of zero-pixel difference to native video.
