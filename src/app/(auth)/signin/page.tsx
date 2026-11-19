"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, KeyRound, LoaderCircle, Mail, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { syncApiToken } from "@/lib/api-auth";
import { toast } from "sonner";

type AppRole = "customer" | "vendor" | "admin";
type UserWithRole = { role?: AppRole | null };

function dashboardForRole(role?: AppRole | null) {
  return role ? `/dashboard/${role}` : "/dashboard";
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputClass = "h-12 w-full rounded-xl border border-[#e9ded6] bg-white pl-11 pr-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/80";

  async function handleCredentialSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting("email");
    try {
      const result = await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) throw new Error(result.error.message || "We couldn’t sign you in. Check your details and try again.");
      const sessionResult = await authClient.getSession();
      if (sessionResult.error) throw new Error(sessionResult.error.message || "Signed in, but we couldn’t load your account. Please try again.");
      const user = sessionResult.data?.user as UserWithRole | undefined;
      await syncApiToken();
      setSuccess("You’re signed in. Taking you to your WedPlan workspace…");
      toast.success("You’re signed in.");
      router.replace(dashboardForRole(user?.role));
      router.refresh();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "We couldn’t sign you in. Check your details and try again.";
      setError(message);
      toast.error("Sign in failed", { description: message });
    } finally {
      setSubmitting(null);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setSuccess("");
    setSubmitting("google");
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: "/auth/redirect" });
      if (result.error) throw new Error(result.error.message || "Google sign-in could not be started. Please try again.");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Google sign-in could not be started. Please try again.";
      setError(message);
      toast.error("Google sign-in could not be started", { description: message });
      setSubmitting(null);
    }
  }

  return (
    <section className="grid overflow-hidden rounded-[2rem] border border-[#eaded5] bg-white shadow-[0_35px_100px_-55px_rgba(82,43,44,.38)] lg:grid-cols-[0.86fr_1fr]">
      <aside className="relative isolate flex min-h-[260px] flex-col justify-between overflow-hidden bg-[#6b4650] px-6 py-6 sm:px-8 sm:py-8 lg:min-h-[650px] lg:px-10 lg:py-10">
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1617202000199-15fab1b09935?auto=format&fit=crop&crop=faces&w=1200&q=85")', backgroundPosition: "center 38%" }} />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(56,34,39,.16)_0%,rgba(56,34,39,.06)_36%,rgba(45,30,34,.82)_100%)]" />
        <div className="absolute right-8 top-8 -z-10 size-48 rounded-full border border-white/20 sm:size-64" /><div className="absolute right-14 top-14 -z-10 size-36 rounded-full border border-white/15 sm:size-52" />
        <div><span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-white shadow-sm backdrop-blur-md"><Sparkles aria-hidden="true" size={13} />Welcome back</span></div>
        <div className="relative mt-16 max-w-md text-white sm:mt-24 lg:mt-auto"><span className="font-serif text-sm italic text-white/80">Every lovely detail, right where you left it.</span><p className="mt-3 text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-5xl">Your plans are waiting to come <span className="font-serif font-normal italic text-[#f7ddd5]">together.</span></p><p className="mt-4 max-w-sm text-sm leading-7 text-white/85">Sign in to pick up where you left off and keep your celebration moving forward.</p><div className="mt-8 flex items-center gap-3 border-t border-white/25 pt-5 text-[10px] font-medium uppercase tracking-[0.13em] text-white/85"><span className="size-1.5 rounded-full bg-[#f0c6ad]" />Your WedPlan workspace</div></div>
        <a href="https://unsplash.com/photos/man-in-black-jacket-kissing-woman-in-white-wedding-dress-KKvXIWSZnWs" target="_blank" rel="noreferrer" className="absolute bottom-3 right-5 text-[9px] text-white/55 transition hover:text-white/90">Photo via Unsplash</a>
      </aside>

      <div className="flex flex-col justify-center px-5 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
        <div className="mb-7"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-800">Your account</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#352321]">Sign in to WedPlan</h1><p className="mt-2 text-sm leading-6 text-stone-600">Welcome back. Let’s get you to your plans.</p></div>

        {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs leading-5 text-rose-900">{error}</p>}
        {success && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs leading-5 text-emerald-900">{success}</p>}

        <form onSubmit={handleCredentialSignIn} className="grid gap-4">
          <label className="grid gap-1.5 text-xs font-semibold text-stone-700">Email address<span className="relative"><Mail aria-hidden="true" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700/70" /><input autoComplete="email" required type="email" value={email} onChange={event => { setEmail(event.target.value); setError(""); setSuccess(""); }} className={inputClass} placeholder="you@example.com" /></span></label>
          <label className="grid gap-1.5 text-xs font-semibold text-stone-700">Password<span className="relative"><KeyRound aria-hidden="true" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700/70" /><input autoComplete="current-password" required type={showPassword ? "text" : "password"} value={password} onChange={event => { setPassword(event.target.value); setError(""); setSuccess(""); }} className={`${inputClass} pr-12`} placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword(show => !show)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-stone-500 transition hover:bg-rose-50 hover:text-rose-800">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>
          <button type="submit" disabled={submitting !== null || !email.trim() || !password} className="group mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rose-800 px-5 text-sm font-semibold text-white shadow-md shadow-rose-950/10 transition hover:-translate-y-0.5 hover:bg-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55">{submitting === "email" ? <><LoaderCircle size={17} className="animate-spin" />Signing you in…</> : <>Sign in<ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></>}</button>
        </form>

        <div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-[#eee5df]" /><span className="text-[10px] font-medium uppercase tracking-[0.12em] text-stone-400">or continue another way</span><span className="h-px flex-1 bg-[#eee5df]" /></div>
        <button type="button" onClick={handleGoogleSignIn} disabled={submitting !== null} className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-[#e9ded6] bg-white text-sm font-semibold text-stone-700 shadow-sm transition hover:border-rose-200 hover:bg-[#fffdfa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">{submitting === "google" ? <LoaderCircle size={17} className="animate-spin" /> : <GoogleMark />}Continue with Google</button>

        <p className="mt-6 text-center text-xs text-stone-500">New to WedPlan? <Link href="/signup" className="font-semibold text-rose-800 underline-offset-4 hover:underline">Create your account</Link></p>
      </div>
    </section>
  );
}

function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.4l-3.24-2.52c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.92A6 6 0 0 1 6.1 12c0-.67.11-1.32.31-1.92v-2.6H3.06A10 10 0 0 0 2 12c0 1.62.39 3.15 1.06 4.52l3.35-2.6Z"/><path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.83 1.5l2.87-2.86C16.96 2.98 14.7 2 12 2a10 10 0 0 0-8.94 5.48l3.35 2.6C7.2 7.72 9.4 5.96 12 5.96Z"/></svg>;
}
