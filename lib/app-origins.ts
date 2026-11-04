/** Connected application origins: local development and Vercel production. */
const production = process.env.NODE_ENV === "production";
export const VINPAY_APP_ORIGIN = (process.env.NEXT_PUBLIC_VINPAY_ORIGIN || (production ? "https://vinclub-gam-voc.vercel.app" : "http://localhost:3202")).replace(/\/$/, "");
export const VINCLUB_APP_ORIGIN = (process.env.NEXT_PUBLIC_VINCLUB_ORIGIN || (production ? "https://vsp-ui-beta.vercel.app" : "http://localhost:3250")).replace(/\/$/, "");
export const CORE_APP_ORIGIN = (process.env.NEXT_PUBLIC_CORE_ORIGIN || (production ? "https://vsp-core-wallet.vercel.app" : "http://localhost:3215")).replace(/\/$/, "");
