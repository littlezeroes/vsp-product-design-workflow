"use client";

import { useEffect, useState } from "react";

export type Role = "officer" | "cskh" | "auditor";

export const ROLE_META: Record<
  Role,
  { label: string; canUnmask: boolean; defaultUnmasked: boolean; desc: string }
> = {
  officer: {
    label: "Officer",
    canUnmask: true,
    defaultUnmasked: true,
    desc: "Full access · phones unmasked by default",
  },
  cskh: {
    label: "CSKH",
    canUnmask: true,
    defaultUnmasked: false,
    desc: "Masked by default · can unmask on demand",
  },
  auditor: {
    label: "Auditor",
    canUnmask: false,
    defaultUnmasked: false,
    desc: "Always masked · cannot reveal",
  },
};

const KEY = "t360.role";

export function useRole(): [Role, (r: Role) => void] {
  const [role, setRole] = useState<Role>("officer");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(KEY)) as Role | null;
    if (saved && saved in ROLE_META) setRole(saved);
  }, []);

  const update = (r: Role) => {
    setRole(r);
    localStorage.setItem(KEY, r);
    // Notify other tabs / components of role change
    window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: r }));
  };

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue && e.newValue in ROLE_META) {
        setRole(e.newValue as Role);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return [role, update];
}
