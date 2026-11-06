// Shared editorial palette harmonized with resin icons: ruby, ivory, champagne, aqua and emerald.
const root = "/vinclub-assets/illustrations/editorial-color-v3";
export const illustrationAssets = {
  ride: `${root}/ride.webp`,
  food: `${root}/food.webp`,
  flight: `${root}/flight.webp`,
  shopping: `${root}/shopping.webp`,
  bills: `${root}/bills.webp`,
  insurance: `${root}/insurance.webp`,
  escape: `${root}/escape.webp`,
  wellness: `${root}/wellness.webp`,
  weekend: `${root}/weekend.webp`,
  winmart: `${root}/winmart.webp`,
  apartment: `${root}/apartment-depth-v2.webp`,
} as const;
export type IllustrationName = keyof typeof illustrationAssets;
