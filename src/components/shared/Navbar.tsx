"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Flower2, LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { clearApiToken, syncApiToken } from "@/lib/api-auth";
import { toast } from "sonner";

type AppRole = "admin" | "vendor" | "customer";
type AuthUser = { name?: string | null; email?: string | null; image?: string | null; role?: AppRole | null };

function initials(name?: string | null) {
  return name?.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "W";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { data: session, isPending } = authClient.useSession();
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(null);
  const [profileOpenPath, setProfileOpenPath] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const user = session?.user as AuthUser | undefined;
  const userId = session?.user?.id;
  const mobileOpen = mobileOpenPath === pathname;
  const profileOpen = profileOpenPath === pathname;
  const dashboardHref = user?.role ? `/dashboard/${user.role}` : "/dashboard";
  const profileHref = user?.role ? `/dashboard/${user.role}/profile-settings` : "/dashboard/profile-settings";

  useEffect(() => {
    function closeProfileMenu(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) setProfileOpenPath(null);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setProfileOpenPath(null);
    }
    document.addEventListener("mousedown", closeProfileMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeProfileMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    if (isPending || !userId) return;
    void syncApiToken().catch(() => undefined);
  }, [isPending, userId]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await clearApiToken().catch(() => undefined);
      await authClient.signOut();
      // Revoke once more after the Better Auth cookie is cleared to close a
      // race where a concurrent 401 refresh could have issued another JWT.
      await clearApiToken().catch(() => undefined);
      setSignOutError(false);
      toast.success("You’ve signed out.");
      setProfileOpenPath(null);
      setMobileOpenPath(null);
      router.replace("/");
      router.refresh();
    } catch {
      setSignOutError(true);
      toast.error("Could not sign out", { description: "Please try again." });
    } finally {
      setSigningOut(false);
    }
  }

  function closeMenus() {
    setMobileOpenPath(null);
    setProfileOpenPath(null);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-rose-100/80 bg-[#fcfaf7]/90 shadow-[0_8px_28px_-25px_rgba(93,49,57,0.45)] backdrop-blur-xl">
      <nav aria-label="Main navigation" className="mx-auto grid min-h-[76px] max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link href="/" aria-label="WedPlan home" onClick={closeMenus} className="group inline-flex w-fit items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2">
          <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-[1.1rem] border border-rose-200/70 bg-gradient-to-br from-white via-rose-50 to-[#f0d9ce] text-rose-800 shadow-sm shadow-rose-900/10 transition duration-300 group-hover:-rotate-3 group-hover:shadow-md">
            <Flower2 aria-hidden="true" size={21} strokeWidth={1.55} />
            <span aria-hidden="true" className="absolute bottom-1.5 right-1.5 size-1.5 rounded-full bg-amber-500 ring-2 ring-white" />
          </span>
          <span className="block"><span className="block text-[1.2rem] font-semibold leading-none tracking-[-0.04em] text-stone-900">Wed<span className="text-rose-800">Plan</span></span><span className="mt-1.5 hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-500 sm:block">Wedding planning, thoughtfully</span></span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-rose-100/80 bg-white/75 p-1 shadow-sm shadow-rose-950/[0.03] lg:flex">
          <NavLink href="/" label="Home" active={pathname === "/"} onClick={closeMenus} />
          <NavLink href="/services" label="Browse Services" active={pathname === "/services" || pathname.startsWith("/services/")} onClick={closeMenus} />
        </div>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          {isPending ? <div aria-label="Checking account" className="h-11 w-36 animate-pulse rounded-full bg-rose-100/70" /> : user ? (
            <div ref={profileRef} className="relative">
              <button type="button" aria-haspopup="menu" aria-expanded={profileOpen} onClick={() => setProfileOpenPath(profileOpen ? null : pathname)} className="group inline-flex items-center gap-2.5 rounded-full border border-rose-100 bg-white/85 p-1.5 pr-3.5 shadow-sm shadow-rose-950/[0.03] transition hover:border-rose-200 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400">
                <Avatar name={user.name} image={user.image} />
                <span className="max-w-28 truncate text-sm font-medium text-stone-800">{user.name || "My account"}</span>
                <ChevronDown aria-hidden="true" size={15} className={`text-stone-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {profileOpen && <motion.div role="menu" initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, y: 5, scale: 0.99 }} transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }} className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 origin-top-right overflow-hidden rounded-2xl border border-rose-100 bg-white p-2 shadow-[0_20px_55px_-24px_rgba(72,37,42,0.3)]">
                  <div className="rounded-xl bg-[#fbf6f2] px-3.5 py-3"><p className="truncate text-sm font-semibold text-stone-900">{user.name || "WedPlan member"}</p>{user.email && <p className="mt-0.5 truncate text-xs text-stone-500">{user.email}</p>}</div>
                  <div className="mt-1.5 space-y-0.5">
                    <ProfileLink href={dashboardHref} icon={<LayoutDashboard size={16} />} label="Dashboard" active={pathname.startsWith(dashboardHref)} onClick={closeMenus} />
                    <ProfileLink href={profileHref} icon={<Settings size={16} />} label="Profile Settings" active={pathname.startsWith(profileHref)} onClick={closeMenus} />
                    <button type="button" role="menuitem" onClick={handleSignOut} disabled={signingOut} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm text-rose-800 transition-colors hover:bg-rose-50 disabled:opacity-60"><LogOut aria-hidden="true" size={16} />{signingOut ? "Signing out…" : "Log out"}</button>
                    {signOutError && <p role="alert" className="px-3.5 pb-2 text-xs text-destructive">Could not sign out. Please try again.</p>}
                  </div>
                </motion.div>}
              </AnimatePresence>
            </div>
          ) : <><Link href="/signin" onClick={closeMenus} className="rounded-full px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-rose-50 hover:text-rose-800">Sign in</Link><Link href="/signup" onClick={closeMenus} className="group inline-flex items-center gap-2 rounded-full bg-rose-800 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-rose-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">Sign Up <ArrowUpRight aria-hidden="true" size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></>}
        </div>

        <button type="button" aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpenPath(mobileOpen ? null : pathname)} className="inline-flex size-11 items-center justify-center justify-self-end rounded-full border border-rose-200/80 bg-white text-stone-800 shadow-sm transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 lg:hidden">
          <AnimatePresence mode="wait" initial={false}><motion.span key={mobileOpen ? "close" : "menu"} initial={reduceMotion ? false : { opacity: 0, rotate: -35, scale: 0.8 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, rotate: 35, scale: 0.8 }} transition={{ duration: reduceMotion ? 0 : 0.14 }} className="flex">{mobileOpen ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}</motion.span></AnimatePresence>
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {mobileOpen && <motion.div initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={reduceMotion ? undefined : { opacity: 0, height: 0 }} transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden border-t border-rose-100 bg-[#fcfaf7] lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            <MobileNavLink href="/" label="Home" active={pathname === "/"} onClick={closeMenus} />
            <MobileNavLink href="/services" label="Browse Services" active={pathname === "/services" || pathname.startsWith("/services/")} onClick={closeMenus} />
            {isPending ? <div aria-label="Checking account" className="mt-3 h-14 animate-pulse rounded-2xl bg-rose-100/70" /> : user ? <>
              <div className="my-2 flex items-center gap-3 rounded-2xl border border-rose-100 bg-white p-3"><Avatar name={user.name} image={user.image} /><div className="min-w-0"><p className="truncate text-sm font-semibold text-stone-900">{user.name || "WedPlan member"}</p>{user.email && <p className="truncate text-xs text-stone-500">{user.email}</p>}</div></div>
              <MobileNavLink href={dashboardHref} label="Dashboard" icon={<LayoutDashboard size={17} />} onClick={closeMenus} />
              <MobileNavLink href={profileHref} label="Profile Settings" icon={<Settings size={17} />} onClick={closeMenus} />
              <button type="button" onClick={handleSignOut} disabled={signingOut} className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-rose-800 transition hover:bg-rose-50 disabled:opacity-60"><LogOut aria-hidden="true" size={17} />{signingOut ? "Signing out…" : "Log out"}</button>
              {signOutError && <p role="alert" className="px-3.5 pb-2 text-xs text-destructive">Could not sign out. Please try again.</p>}
            </> : <div className="mt-3 grid grid-cols-2 gap-3"><Link href="/signin" onClick={closeMenus} className="rounded-full border border-rose-200 bg-white px-4 py-3 text-center text-sm font-semibold text-stone-700">Sign in</Link><Link href="/signup" onClick={closeMenus} className="rounded-full bg-rose-800 px-4 py-3 text-center text-sm font-semibold text-white">Create account</Link></div>}
          </div>
        </motion.div>}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, label, active, onClick }: { href: string; label: string; active: boolean; onClick: () => void }) {
  return <Link href={href} aria-current={active ? "page" : undefined} onClick={onClick} className={`relative isolate inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${active ? "text-rose-900" : "text-stone-600 hover:text-stone-900"}`}>
    {active && <motion.span layoutId="wedplan-nav-active" className="absolute inset-0 -z-10 rounded-full border border-rose-100 bg-rose-50" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
    {label}
  </Link>;
}

function MobileNavLink({ href, label, active, icon, onClick }: { href: string; label: string; active?: boolean; icon?: ReactNode; onClick: () => void }) {
  return <Link href={href} aria-current={active ? "page" : undefined} onClick={onClick} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${active ? "bg-rose-50 text-rose-900" : "text-stone-700 hover:bg-rose-50/70"}`}>{icon}{label}</Link>;
}

function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  return <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-rose-200 bg-gradient-to-br from-rose-100 to-[#f1d9cf] text-xs font-semibold text-rose-900 ring-2 ring-white">
    {image ? <span role="img" aria-label={`${name || "User"} profile image`} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${image}")` }} /> : initials(name)}
  </span>;
}

function ProfileLink({ href, icon, label, active, onClick }: { href: string; icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <Link href={href} role="menuitem" onClick={onClick} className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${active ? "bg-rose-50 font-medium text-rose-900" : "text-stone-700 hover:bg-rose-50/70"}`}>{icon}{label}</Link>;
}

