import type { Metadata } from "next";
import { EnvelopeGiftReveal } from "@/components/envelope-gift-reveal/EnvelopeGiftReveal";

export const metadata: Metadata = {
  title: "Something for you · Envelope Gift Reveal",
  description: "A letter from Nora. Lift the flap to find something for you.",
};

export default async function EnvelopeGiftRevealPage({ searchParams }: { searchParams: Promise<{ autoplay?: string }> }) {
  const { autoplay } = await searchParams;
  return <EnvelopeGiftReveal autoPlay={autoplay === "1"}/>;
}
