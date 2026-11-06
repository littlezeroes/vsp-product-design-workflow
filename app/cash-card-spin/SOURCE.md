# Cash App card spin on scroll

Reference: https://60fps.design/appsites/cash-app-3d-card-spin-on-scroll-interaction
Original: https://design.cash.app/card
Inspected: 2026-11-06.

The original site returns a regional-unavailability page in this environment. No original
3D model, texture, font or source animation code was available. This route reconstructs
the interaction from the public 60fps video, with original editable SVG drawings of the
observed acid/white doodle, camo, pink, purple, prism and plain card styles.

CSS 3D cards have distinct front/back faces. Native scroll drives pitch, yaw, roll,
depth, brightness and visibility directly; no autoplay or video is used as UI.
Grid View chooses a card and returns to that scroll position. Reduced motion removes
rotation and perspective motion while preserving browsing.

Route: `/cash-card-spin`. No dependencies added. Verification and reference snapshots:
`output/cash-card-spin/`. Layout/artwork/lighting are approximations, not a verified
pixel-perfect reproduction. The reference video includes phone/Safari chrome, which
is excluded from this full-browser implementation.
