"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  Folder,
  HelpCircle,
  Layers,
  LayoutDashboard,
  ListOrdered,
  Lock,
  LogOut,
  Moon,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PortalButton } from "./_components/portal-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRole, ROLE_META } from "./_components/use-role";
import { Toaster } from "@/components/ui/sonner";

type NavItem = {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: { title: string; href: string }[];
};

const mainNav: NavItem[] = [
  { title: "Dashboard", href: "#dashboard", icon: LayoutDashboard },
  { title: "Reports", href: "#reports", icon: BarChart3 },
  {
    title: "Accounting",
    icon: Folder,
    children: [
      { title: "Transaction 360", href: "/transaction-360" },
      { title: "GL Entries", href: "#gl" },
      { title: "Reconciliation", href: "#recon" },
    ],
  },
  { title: "Wallets", href: "#wallets", icon: Wallet },
  { title: "Users", href: "#users", icon: Users },
  { title: "Risk & Compliance", href: "#risk", icon: ShieldCheck },
  {
    title: "Operations",
    icon: Layers,
    children: [
      { title: "Daily Settlements", href: "#ds" },
      { title: "Fee Matrix", href: "#fee" },
    ],
  },
];

const bottomNav: NavItem[] = [
  { title: "Notifications", href: "#noti", icon: Bell },
  { title: "Change password", href: "#pwd", icon: Lock },
];

function CollapsibleItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const isChildActive = item.children?.some((c) => pathname === c.href) ?? false;
  const [open, setOpen] = useState(isChildActive);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent text-foreground"
      >
        <item.icon className="size-4 shrink-0" />
        <span className="flex-1 text-left">{item.title}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open ? "" : "-rotate-90",
          )}
        />
      </button>
      {open && item.children && (
        <div className="ml-6 mt-1 flex flex-col gap-0.5">
          {item.children.map((child) => {
            const active =
              child.href !== "#" &&
              !child.href.startsWith("#") &&
              (pathname === child.href || pathname.startsWith(child.href + "/"));
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "rounded-lg px-2 py-1.5 text-sm transition-colors",
                  active
                    ? "font-medium text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TransactionPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [role, setRole] = useRole();
  const roleMeta = ROLE_META[role];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="flex w-[288px] shrink-0 flex-col border-r border-border bg-card h-screen sticky top-0">
        {/* Logo */}
        <div className="border-b border-border px-[18px] py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background font-bold text-lg">
              V
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[16.8px] font-bold text-foreground">V-Pay</span>
              <span className="text-[14.4px] font-bold text-muted-foreground">ADMIN</span>
            </div>
          </div>
        </div>

        {/* Workspace Selector */}
        <div className="px-2 pt-2">
          <PortalButton
            variant="outline"
            className="h-auto w-full justify-start p-2 gap-2"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted overflow-hidden">
              <span className="text-xs font-semibold text-primary">T360</span>
            </div>
            <span className="flex-1 text-left text-sm font-semibold text-foreground truncate">
              V-Pay Production
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </PortalButton>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-1">
            {mainNav.map((item) => {
              if (item.children) {
                return <CollapsibleItem key={item.title} item={item} pathname={pathname} />;
              }
              const active =
                item.href !== "#" &&
                !item.href!.startsWith("#") &&
                (pathname === item.href || pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.title}
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-foreground hover:bg-accent",
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Nav */}
        <Separator />
        <div className="px-3 py-2">
          <div className="flex flex-col gap-0.5">
            {bottomNav.map((item) => (
              <Link
                key={item.title}
                href={item.href!}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                <item.icon className="size-4 shrink-0" />
                <span className="flex-1">{item.title}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full">
              <LogOut className="size-4 shrink-0" />
              <span className="flex-1 text-left">Sign out</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 md:h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6 gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Accounting</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground">
              {pathname.includes("/transaction-360/") ? "Detail Transaction" : "Transaction 360"}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <span className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md border text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
              Viewing as <span className="text-foreground font-medium">{roleMeta.label}</span>
            </span>
            <PortalButton variant="ghost" size="icon" aria-label="Theme">
              <Moon className="h-4 w-4" />
            </PortalButton>
            <PortalButton variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </PortalButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Account"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs font-bold ml-1 hover:bg-destructive/15"
                >
                  KH
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Switch role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(ROLE_META) as Array<keyof typeof ROLE_META>).map((r) => {
                  const meta = ROLE_META[r];
                  const current = role === r;
                  return (
                    <DropdownMenuItem
                      key={r}
                      onClick={() => setRole(r)}
                      className={cn(current && "bg-accent")}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {meta.label}
                          {current && <span className="text-muted-foreground font-normal ml-1.5">· current</span>}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {meta.desc}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-muted/50 p-3 md:p-6">
          {children}
        </main>
        <Toaster richColors position="bottom-right" />
      </div>
    </div>
  );
}
