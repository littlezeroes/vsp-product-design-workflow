import type { Metadata } from "next";
import { PrismBeamFolder } from "@/components/prism-beam-folder/PrismBeamFolder";

export const metadata: Metadata = {
  title: "Prism Beam Folder · Larder",
  description: "Hold the Weekend Snacks folder to pour your picks through a prism beam.",
};

export default async function PrismBeamFolderPage({ searchParams }: { searchParams: Promise<{ autoplay?: string }> }) {
  const { autoplay } = await searchParams;
  return <PrismBeamFolder autoPlay={autoplay === "1"}/>;
}
