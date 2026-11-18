"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Heart, LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type AppRole = "admin" | "vendor" | "customer";
type AuthUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: AppRole | null;
};

function initials(name?: string | null) {
  return name?.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "W";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState(false);
  const profileMenu = useRef<HTMLDetailsElement>(null);
  const user = session?.user as AuthUser | undefined;

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  const navLinkClass = (href: string) => `rounded-full px-3 py-2 transition-colors ${isActive(href) ? "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;
  const dashboardHref = user?.role ? `/dashboard/${user.role}` : "/dashboard";
  const profileHref = user?.role ? `/dashboard/${user.role}/profile-settings` : "/dashboard/profile-settings";

  useEffect(() => {
    setMobileOpen(false);
    profileMenu.current?.removeAttribute("open");
  }, [pathname]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      setSignOutError(false);
      setMobileOpen(false);
      router.replace("/");
      router.refresh();
    } catch {
      setSignOutError(true);
    } finally {
      setSigningOut(false);
    }
  }

  const primaryLinks = (
    <>
      <Link href="/" aria-current={isActive("/") ? "page" : undefined} className={navLinkClass("/")} onClick={() => setMobileOpen(false)}>Home</Link>
      <Link href="/services" aria-current={isActive("/services") ? "page" : undefined} className={navLinkClass("/services")} onClick={() => setMobileOpen(false)}>Browse Services</Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-rose-100/80 bg-background/95 shadow-[0_4px_24px_-20px_rgba(104,55,69,0.35)] backdrop-blur supports-[backdrop-filter]:bg-background/85 dark:border-border">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="WedPlan home" className="group inline-flex shrink-0 items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-rose-100 text-rose-700 transition-transform group-hover:scale-105 dark:bg-rose-950 dark:text-rose-200"><Heart aria-hidden="true" size={17} strokeWidth={2.2} /></span>
          <span className="text-xl font-semibold tracking-tight text-foreground">Wed<span className="text-rose-700 dark:text-rose-300">Plan</span></span>
        </Link>

        <div className="hidden items-center gap-1 text-sm font-medium md:flex">{primaryLinks}</div>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div aria-label="Checking account" className="h-10 w-32 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <details ref={profileMenu} className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border/80 bg-background p-1.5 pr-3 transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden">
                <Avatar name={user.name} image={user.image} />
                <span className="max-w-32 truncate text-sm font-medium">{user.name || "My account"}</span>
                <ChevronDown aria-hidden="true" size={15} className="text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="absolute right-0 top-[calc(100%+0.65rem)] z-50 w-64 overflow-hidden rounded-2xl border border-rose-100 bg-popover p-2 shadow-xl shadow-rose-950/10 dark:border-border">
                <div className="mb-1 border-b px-3 py-3">
                  <p className="truncate text-sm font-semibold">{user.name || "WedPlan member"}</p>
                  {user.email && <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>}
                </div>
                <ProfileLink href={dashboardHref} icon={<LayoutDashboard size={16} />} label="Dashboard" active={isActive(dashboardHref)} />
                <ProfileLink href={profileHref} icon={<Settings size={16} />} label="Profile Settings" active={isActive(profileHref)} />
                <button type="button" onClick={handleSignOut} disabled={signingOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-950/40">
                  <LogOut aria-hidden="true" size={16} />{signingOut ? "Signing out…" : "Log out"}
                </button>
                {signOutError && <p role="alert" className="px-3 pb-2 text-xs text-destructive">Could not sign out. Please try again.</p>}
              </div>
            </details>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">Sign In</Link>
              <Link href="/register" className="rounded-full bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-rose-900/15 transition hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 dark:bg-rose-300 dark:text-rose-950 dark:hover:bg-rose-200">Sign Up</Link>
            </>
          )}
        </div>

        <button type="button" aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(open => !open)} className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 md:hidden">
          {mobileOpen ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
        </button>
      </nav>

      {mobileOpen && <div className="border-t border-rose-100 bg-background px-4 pb-5 pt-3 dark:border-border md:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 text-sm font-medium">{primaryLinks}
          {isPending ? <div aria-label="Checking account" className="mt-2 h-10 animate-pulse rounded-xl bg-muted" /> : user ? <>
            <div className="my-2 flex items-center gap-3 border-y py-3"><Avatar name={user.name} image={user.image} /><div className="min-w-0"><p className="truncate font-semibold">{user.name || "WedPlan member"}</p>{user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}</div></div>
            <Link href={dashboardHref} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-muted"><LayoutDashboard size={17} />Dashboard</Link>
            <Link href={profileHref} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-muted"><Settings size={17} />Profile Settings</Link>
            <button type="button" onClick={handleSignOut} disabled={signingOut} className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-rose-700 hover:bg-rose-50 disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-950/40"><LogOut size={17} />{signingOut ? "Signing out…" : "Log out"}</button>
            {signOutError && <p role="alert" className="px-3 pb-2 text-xs text-destructive">Could not sign out. Please try again.</p>}
          </> : <div className="mt-2 grid grid-cols-2 gap-3"><Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-full border px-4 py-2.5 text-center">Sign In</Link><Link href="/register" onClick={() => setMobileOpen(false)} className="rounded-full bg-rose-700 px-4 py-2.5 text-center font-semibold text-white dark:bg-rose-300 dark:text-rose-950">Sign Up</Link></div>}
        </div>
      </div>}
    </header>
  );
}

function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  return <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-100 text-xs font-semibold text-rose-800 ring-1 ring-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:ring-rose-900">
    {image ? <span role="img" aria-label={`${name || "User"} profile image`} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${image}")` }} /> : initials(name)}
  </span>;
}

function ProfileLink({ href, icon, label, active }: { href: string; icon: ReactNode; label: string; active: boolean }) {
  return <Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200" : "text-foreground hover:bg-muted"}`}>{icon}{label}</Link>;
}
