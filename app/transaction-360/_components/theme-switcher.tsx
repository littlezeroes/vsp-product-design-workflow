"use client";

import { useEffect, useState } from "react";
import { Check, ExternalLink, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PortalButton } from "./portal-button";

type ThemeVars = Record<string, string>;

type ThemePreset = {
  name: string;
  label: string;
  dot: string;
  light: ThemeVars;
  dark: ThemeVars;
};

const ALL_KEYS = [
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--input",
  "--ring",
  "--sidebar",
  "--sidebar-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-ring",
  "--radius",
];

const themes: ThemePreset[] = [
  { name: "default", label: "Default", dot: "#171717", light: {}, dark: {} },
  {
    name: "ocean-blue",
    label: "Ocean Blue",
    dot: "#1da1f2",
    light: {
      "--background": "oklch(1.0000 0 0)",
      "--foreground": "oklch(0.1884 0.0128 248.5103)",
      "--card": "oklch(0.9784 0.0011 197.1387)",
      "--card-foreground": "oklch(0.1884 0.0128 248.5103)",
      "--popover": "oklch(1.0000 0 0)",
      "--popover-foreground": "oklch(0.1884 0.0128 248.5103)",
      "--primary": "oklch(0.6723 0.1606 244.9955)",
      "--primary-foreground": "oklch(1.0000 0 0)",
      "--secondary": "oklch(0.1884 0.0128 248.5103)",
      "--secondary-foreground": "oklch(1.0000 0 0)",
      "--muted": "oklch(0.9222 0.0013 286.3737)",
      "--muted-foreground": "oklch(0.4 0.0128 248.5103)",
      "--accent": "oklch(0.9392 0.0166 250.8453)",
      "--accent-foreground": "oklch(0.6723 0.1606 244.9955)",
      "--destructive": "oklch(0.6188 0.2376 25.7658)",
      "--destructive-foreground": "oklch(1.0000 0 0)",
      "--border": "oklch(0.9317 0.0118 231.6594)",
      "--input": "oklch(0.9809 0.0025 228.7836)",
      "--ring": "oklch(0.6818 0.1584 243.3540)",
      "--radius": "0.75rem",
    },
    dark: {
      "--background": "oklch(0.08 0 0)",
      "--foreground": "oklch(0.9328 0.0025 228.7857)",
      "--card": "oklch(0.2097 0.0080 274.5332)",
      "--card-foreground": "oklch(0.8853 0 0)",
      "--popover": "oklch(0.15 0 0)",
      "--popover-foreground": "oklch(0.9328 0.0025 228.7857)",
      "--primary": "oklch(0.6692 0.1607 245.0110)",
      "--primary-foreground": "oklch(1.0000 0 0)",
      "--secondary": "oklch(0.25 0.0035 219.5331)",
      "--secondary-foreground": "oklch(0.9328 0.0025 228.7857)",
      "--muted": "oklch(0.2090 0 0)",
      "--muted-foreground": "oklch(0.6637 0.0078 247.9662)",
      "--accent": "oklch(0.1928 0.0331 242.5459)",
      "--accent-foreground": "oklch(0.6692 0.1607 245.0110)",
      "--destructive": "oklch(0.6188 0.2376 25.7658)",
      "--destructive-foreground": "oklch(1.0000 0 0)",
      "--border": "oklch(0.2674 0.0047 248.0045)",
      "--input": "oklch(0.3020 0.0288 244.8244)",
      "--ring": "oklch(0.6818 0.1584 243.3540)",
      "--radius": "0.75rem",
    },
  },
  {
    name: "emerald",
    label: "Emerald",
    dot: "#10b981",
    light: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.15 0.02 165)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.15 0.02 165)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.15 0.02 165)",
      "--primary": "oklch(0.65 0.15 163)",
      "--primary-foreground": "oklch(1 0 0)",
      "--secondary": "oklch(0.96 0.02 165)",
      "--secondary-foreground": "oklch(0.2 0.03 165)",
      "--muted": "oklch(0.97 0 0)",
      "--muted-foreground": "oklch(0.5 0.02 165)",
      "--accent": "oklch(0.94 0.05 163)",
      "--accent-foreground": "oklch(0.3 0.1 163)",
      "--destructive": "oklch(0.6 0.22 25)",
      "--border": "oklch(0.92 0.01 165)",
      "--input": "oklch(0.94 0.01 165)",
      "--ring": "oklch(0.65 0.15 163)",
      "--radius": "0.5rem",
    },
    dark: {
      "--background": "oklch(0.12 0.01 165)",
      "--foreground": "oklch(0.95 0.01 165)",
      "--card": "oklch(0.17 0.02 165)",
      "--card-foreground": "oklch(0.95 0.01 165)",
      "--popover": "oklch(0.15 0.02 165)",
      "--popover-foreground": "oklch(0.95 0.01 165)",
      "--primary": "oklch(0.7 0.15 163)",
      "--primary-foreground": "oklch(0.12 0.01 165)",
      "--secondary": "oklch(0.22 0.03 165)",
      "--secondary-foreground": "oklch(0.95 0.01 165)",
      "--muted": "oklch(0.2 0.02 165)",
      "--muted-foreground": "oklch(0.7 0.02 165)",
      "--accent": "oklch(0.25 0.05 163)",
      "--accent-foreground": "oklch(0.85 0.1 163)",
      "--destructive": "oklch(0.65 0.22 25)",
      "--border": "oklch(0.25 0.03 165)",
      "--input": "oklch(0.3 0.04 165)",
      "--ring": "oklch(0.7 0.15 163)",
      "--radius": "0.5rem",
    },
  },
  {
    name: "warm-earth",
    label: "Warm Earth",
    dot: "#b8860b",
    light: {
      "--background": "oklch(0.9818 0.0054 95.0986)",
      "--foreground": "oklch(0.3438 0.0269 95.7226)",
      "--card": "oklch(0.9818 0.0054 95.0986)",
      "--card-foreground": "oklch(0.1908 0.0020 106.5859)",
      "--popover": "oklch(1.0000 0 0)",
      "--popover-foreground": "oklch(0.2671 0.0196 98.9390)",
      "--primary": "oklch(0.6171 0.1375 39.0427)",
      "--primary-foreground": "oklch(1.0000 0 0)",
      "--secondary": "oklch(0.9245 0.0138 92.9892)",
      "--secondary-foreground": "oklch(0.4334 0.0177 98.6048)",
      "--muted": "oklch(0.9341 0.0153 90.2390)",
      "--muted-foreground": "oklch(0.5 0.02 95)",
      "--accent": "oklch(0.9245 0.0138 92.9892)",
      "--accent-foreground": "oklch(0.2671 0.0196 98.9390)",
      "--destructive": "oklch(0.55 0.22 25)",
      "--border": "oklch(0.8847 0.0069 97.3627)",
      "--input": "oklch(0.94 0.01 98)",
      "--ring": "oklch(0.6171 0.1375 39.0427)",
      "--radius": "0.5rem",
    },
    dark: {
      "--background": "oklch(0.2679 0.0036 106.6427)",
      "--foreground": "oklch(0.8074 0.0142 93.0137)",
      "--card": "oklch(0.32 0.0036 106.6427)",
      "--card-foreground": "oklch(0.9818 0.0054 95.0986)",
      "--popover": "oklch(0.3085 0.0035 106.6039)",
      "--popover-foreground": "oklch(0.9211 0.0040 106.4781)",
      "--primary": "oklch(0.6724 0.1308 38.7559)",
      "--primary-foreground": "oklch(1.0000 0 0)",
      "--secondary": "oklch(0.35 0.0054 95)",
      "--secondary-foreground": "oklch(0.9211 0.0040 106.4781)",
      "--muted": "oklch(0.2213 0.0038 106.7070)",
      "--muted-foreground": "oklch(0.7713 0.0169 99.0657)",
      "--accent": "oklch(0.38 0.03 95)",
      "--accent-foreground": "oklch(0.9663 0.0080 98.8792)",
      "--destructive": "oklch(0.6368 0.2078 25.3313)",
      "--border": "oklch(0.3618 0.0101 106.8928)",
      "--input": "oklch(0.4336 0.0113 100.2195)",
      "--ring": "oklch(0.6724 0.1308 38.7559)",
      "--radius": "0.5rem",
    },
  },
  {
    name: "rose-clean",
    label: "Rose",
    dot: "#e11d48",
    light: {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.15 0 0)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.15 0 0)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.15 0 0)",
      "--primary": "oklch(0.62 0.22 15)",
      "--primary-foreground": "oklch(1 0 0)",
      "--secondary": "oklch(0.96 0.01 15)",
      "--secondary-foreground": "oklch(0.2 0 0)",
      "--muted": "oklch(0.96 0 0)",
      "--muted-foreground": "oklch(0.5 0 0)",
      "--accent": "oklch(0.94 0.03 15)",
      "--accent-foreground": "oklch(0.3 0.1 15)",
      "--destructive": "oklch(0.6 0.22 25)",
      "--border": "oklch(0.92 0 0)",
      "--input": "oklch(0.94 0 0)",
      "--ring": "oklch(0.62 0.22 15)",
      "--radius": "0.5rem",
    },
    dark: {
      "--background": "oklch(0.1 0 0)",
      "--foreground": "oklch(0.95 0 0)",
      "--card": "oklch(0.16 0 0)",
      "--card-foreground": "oklch(0.95 0 0)",
      "--popover": "oklch(0.14 0 0)",
      "--popover-foreground": "oklch(0.95 0 0)",
      "--primary": "oklch(0.7 0.22 15)",
      "--primary-foreground": "oklch(0.1 0 0)",
      "--secondary": "oklch(0.22 0 0)",
      "--secondary-foreground": "oklch(0.95 0 0)",
      "--muted": "oklch(0.2 0 0)",
      "--muted-foreground": "oklch(0.7 0 0)",
      "--accent": "oklch(0.25 0.05 15)",
      "--accent-foreground": "oklch(0.85 0.1 15)",
      "--destructive": "oklch(0.65 0.22 25)",
      "--border": "oklch(0.26 0 0)",
      "--input": "oklch(0.3 0 0)",
      "--ring": "oklch(0.7 0.22 15)",
      "--radius": "0.5rem",
    },
  },
];

function applyVars(vars: ThemeVars) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

function clearVars() {
  const root = document.documentElement;
  for (const key of ALL_KEYS) {
    root.style.removeProperty(key);
  }
}

const STORAGE_KEY = "t360.theme-preset";

export function ThemeSwitcher() {
  const [current, setCurrent] = useState("default");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved !== "default") {
      setCurrent(saved);
      const theme = themes.find((t) => t.name === saved);
      if (theme) {
        const isDark = document.documentElement.classList.contains("dark");
        applyVars(isDark ? theme.dark : theme.light);
      }
    }
  }, []);

  function selectTheme(name: string) {
    clearVars();
    if (name !== "default") {
      const theme = themes.find((t) => t.name === name);
      if (theme) {
        const isDark = document.documentElement.classList.contains("dark");
        applyVars(isDark ? theme.dark : theme.light);
      }
    }
    setCurrent(name);
    localStorage.setItem(STORAGE_KEY, name);
  }

  // Re-apply on dark-mode class toggle
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (current !== "default") {
        const theme = themes.find((t) => t.name === current);
        if (theme) {
          const isDark = document.documentElement.classList.contains("dark");
          applyVars(isDark ? theme.dark : theme.light);
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [current]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PortalButton variant="ghost" size="icon" aria-label="Theme preset">
          <Palette className="h-4 w-4" />
        </PortalButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Theme preset
        </div>
        <DropdownMenuSeparator />
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => selectTheme(theme.name)}
          >
            <span
              className="h-4 w-4 rounded-full border border-border shrink-0 mr-2"
              style={{ backgroundColor: theme.dot }}
            />
            <span className="flex-1 text-sm">{theme.label}</span>
            {current === theme.name && (
              <Check className="h-3.5 w-3.5 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            window.open("https://tweakcn.com/editor/theme", "_blank")
          }
        >
          <ExternalLink className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">tweakcn.com</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
