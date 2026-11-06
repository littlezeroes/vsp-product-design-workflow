import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parseSplashOption } from "../vinclub-options";
import SplashScreen from "../splash-screen";
import "../splash.css";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  return { title: brand === "vinclub" ? "VinClub · Splash" : "VinPay by VSF · Splash", description: "Brand splash animation." };
}
export default async function BrandSplashPage({
  params,
  searchParams,
}: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ option?: string }>;
}) {
  const { brand } = await params;
  if (brand !== "vinclub" && brand !== "vinpay") notFound();
  const query = await searchParams;
  return <SplashScreen brand={brand} option={parseSplashOption(query.option)} />;
}
