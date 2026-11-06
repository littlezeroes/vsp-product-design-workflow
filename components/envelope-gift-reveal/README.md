Envelope Gift Reveal — web adaptation of Native Cook

Source: https://github.com/Native-Cook/native-cook/tree/main/react-native/src/blocks/gestures/envelope-gift-reveal
Original source snapshot: output/envelope-gift-reveal/reference/*.txt.

Open /envelope-gift-reveal. Drag upward or press “Lift the flap”. Add to Wallet
resets the demo, matching the original default onShop behavior; it does not add
a pass to an actual wallet. Pass onShop to integrate a real action.

Autoplay defaults off; /envelope-gift-reveal?autoplay=1 enables the original
10-second script. A touch interrupts it, and it resumes after inactivity.
Reduced Motion disables autoplay and uses fades. No packages were added.

Implementation:
- theme.ts preserves the source palette, text, geometry and layout function.
- motion.ts preserves source motion constants, with a web cubic-bezier solver.
- use-envelope.ts ports the single-clock state machine and reference spring.
- EnvelopeScene.tsx ports the Skia paths and layers to SVG/CSS perspective.
- EnvelopeGiftReveal.tsx uses pointer capture, keyboard alternatives, accessible
  labels and live announcements, and composes the existing VSP Button.
- Original four fonts and their OFL licenses are in public/envelope-gift-reveal.
- Paper/linen textures are sampled from the original procedural shader formulas;
  they are not screenshots. Text remains real DOM/SVG text.

Platform differences: SVG/CSS replaces Skia/Reanimated; the linen is a static
393×852 shader sample stretched to the stage; the stage caps at 480px on desktop
and artwork scales down below 372px. Browser vibration is best-effort and is not
available on iOS Safari. There is no Expo/native integration in this Next.js app.
Faithful reference layout intentionally takes precedence over VSP screen spacing.
The project's home indicator is retained at the bottom.

Validation: node scripts/envelope-gift-reveal-check.cjs (dev server on port 3000;
BASE_URL can override). Captures sealed, partial, dragged and revealed states,
responsive widths and reduced motion in output/envelope-gift-reveal. Checks short
and committed drags, spring close, interruptions, pointer cancellation, button,
keyboard, demo reset, flip completion and autoplay; checks runtime errors and
horizontal overflow. Browser validation only; no native device test or strict
pixel-perfect result is claimed. The locally available reference video includes
a phone bezel and a different screen viewport, so no equal-size pixel diff was
performed.

Scoped ESLint and TypeScript checks pass. Full-project TypeScript is blocked by
existing errors outside this block (including app/brand-splash/glass-scene.tsx).
