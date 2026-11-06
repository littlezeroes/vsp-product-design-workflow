"use client";
import { VINPAY_APP_ORIGIN } from "@/lib/app-origins";
import { useEffect, useRef, useState } from "react";
import { StatusBar } from "@/components/ui/header";
import VinClubSplash from "./vinclub-splash";
import PrismaticLaunch from "./prismatic-launch";
import type { SplashOption } from "./vinclub-options";
import { FixedBottom } from "@/components/ui/fixed-bottom";

function VSymbol({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="233 460 1133 682"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M233 646H662L1044 1058L969 1142H700Z M780 775L1070 460H1366V711L1044 1058V775Z" />
    </svg>
  );
}
function VinPaySplash({ brand }: { brand: "vinclub" | "vinpay" }) {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [motion, setMotion] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<
    "spin" | "waiting" | "zoom" | "circle" | "home"
  >("spin");
  const [homeReady, setHomeReady] = useState(false);
  const name = "VinPay";
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const enabled = !preference.matches;
      setMotion(enabled);
      if (video.current && video.current.readyState >= 2) setReady(true);
      if (enabled) void video.current?.play().catch(() => setPhase("waiting"));
      else video.current?.pause();
    };
    apply();
    preference.addEventListener("change", apply);
    return () => {
      preference.removeEventListener("change", apply);
    };
  }, []);
  useEffect(() => {
    if (!homeReady || motion === null) return;
    if (!motion) setPhase("home");
    else if (phase === "waiting") setPhase("zoom");
  }, [homeReady, motion, phase]);
  return (
    <main
      className="brand-splash"
      data-brand={brand}
      data-motion={motion === true}
      data-phase={phase}
      data-video-ready={ready}
      aria-busy={phase !== "home"}
      aria-label={`${name} đang khởi động`}
    >
      <div className="brand-splash__stage">
        <iframe
          className="brand-splash__home-frame"
          src={`${VINPAY_APP_ORIGIN}/ui-templates/sumeria/vsp?mode=dark&header=revolut&embedded=1`}
          title="Home VinPay"
          onLoad={() => setHomeReady(true)}
          tabIndex={phase === "home" ? 0 : -1}
          inert={phase !== "home"}
          aria-hidden={phase !== "home"}
        />
        <div
          className="brand-splash__screen"
          aria-hidden={phase === "home"}
          inert={phase === "home"}
          onAnimationEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.animationName === "brand-splash-circle-close"
            )
              setPhase("home");
          }}
        >
          <header className="brand-splash__header">
            <StatusBar />
          </header>
          <section
            className="brand-splash__hero px-[22px]"
            onAnimationEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                event.animationName === "brand-splash-logo-expand"
              )
                setPhase("circle");
            }}
            aria-label={`Logo VinClub gold 3D`}
          >
            <h1 className="sr-only">{name}</h1>
            <img
              className="brand-splash__poster"
              src="/brand-splash/vinclub-source-gold-poster.png"
              width={1024}
              height={1024}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
            />
            <video
              ref={video}
              className="brand-splash__video"
              src="/brand-splash/vinclub-one-turn.mp4"
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setReady(true)}
              onPlaying={() => setReady(true)}
              onTimeUpdate={() => setReady(true)}
              onEnded={() => setPhase(homeReady ? "zoom" : "waiting")}
              onError={() => {
                setReady(false);
                setPhase("waiting");
              }}
              aria-hidden="true"
              tabIndex={-1}
            />
          </section>
          <section
            className="brand-splash__identity px-[22px]"
            aria-label={`${name}, by VSF`}
          >
            <div className="brand-splash__wordmark">
              <span className="brand-splash__vinpay">VinPay</span>
            </div>
            <div className="brand-splash__parent">
              <span className="brand-splash__from">by</span>
              <div className="brand-splash__parent-mark">
                <VSymbol />
                <span>VSF</span>
              </div>
            </div>
          </section>
          <FixedBottom className="brand-splash__bottom !absolute !border-0 !bg-transparent !p-0 !shadow-none">
            <div className="brand-splash__home mx-auto h-[5px] w-[139px] rounded-full bg-foreground" />
          </FixedBottom>
          <p className="sr-only" role="status">
            Đang mở {name}…
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SplashScreen({
  brand,
  option,
}: {
  brand: "vinclub" | "vinpay";
  option?: SplashOption;
}) {
  return brand === "vinclub" ? (
    option === "launch" || !option ? <PrismaticLaunch /> : <VinClubSplash option={option} />
  ) : (
    <VinPaySplash brand={brand} />
  );
}
