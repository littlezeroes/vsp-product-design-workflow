// Canonical Visual Library: smoked glass, titanium, brand accent and ivory.
const root = "/vsp-visual-library/illustrations-smoke-glass-v4";
export const illustrationAssets = {
  ride: `${root}/vinclub-illus-ride.poster.png`,
  food: `${root}/vinclub-illus-food.poster.png`,
  flight: `${root}/vinclub-illus-flight.poster.png`,
  shopping: `${root}/vinclub-illus-shopping.poster.png`,
  bills: `${root}/vinclub-illus-bills.poster.png`,
  insurance: `${root}/vinclub-illus-insurance.poster.png`,
  escape: `${root}/vinclub-illus-escape.poster.png`,
  wellness: `${root}/vinclub-illus-wellness.poster.png`,
  weekend: `${root}/vinclub-illus-weekend.poster.png`,
  winmart: `${root}/vinclub-illus-winmart.poster.png`,
  apartment: `${root}/vinclub-illus-apartment.poster.png`,
} as const;
export type IllustrationName = keyof typeof illustrationAssets;
