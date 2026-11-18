"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BadgeCheck, CircleUserRound, LoaderCircle, Mail, Save } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { PageHeader } from "@/components/shared/PageHeader";

export function CustomerProfileSettings() {
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const cleanName = name.trim();
    if (!cleanName) { setError("Please enter your name."); return; }
    setSaving(true);
    try {
      const result = await authClient.updateUser({ name: cleanName });
      if (result.error) throw new Error(result.error.message || "We couldn’t update your profile.");
      setSuccess("Your profile has been updated.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn’t update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const email = session?.user?.email || "";
  return <div className="mx-auto max-w-4xl"><PageHeader title="Profile settings" description="Keep your customer profile and contact details up to date." />
    <section className="overflow-hidden rounded-[1.6rem] border border-[#eee3dc] bg-white shadow-[0_16px_42px_-35px_rgba(82,43,44,.36)]"><div className="border-b border-[#f0e8e2] bg-[linear-gradient(110deg,#fffdfa,#fbf6f1)] px-5 py-5 sm:px-7"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-800"><CircleUserRound size={21} /></span><div><h2 className="text-sm font-semibold text-stone-900">Your account profile</h2><p className="mt-1 text-xs text-stone-500">Your email is used for account access and booking updates.</p></div></div></div>
      <form onSubmit={saveProfile} className="grid gap-5 px-5 py-6 sm:px-7"><label className="grid gap-1.5 text-xs font-semibold text-stone-700">Full name<span className="relative"><CircleUserRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700/70" /><input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} disabled={isPending || saving} className="h-12 w-full rounded-xl border border-[#e9ded6] bg-white pl-11 pr-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/80 disabled:bg-stone-50" placeholder="Your name" /></span></label>
        <label className="grid gap-1.5 text-xs font-semibold text-stone-700">Email address<span className="relative"><Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700/70" /><input type="email" value={email} readOnly className="h-12 w-full rounded-xl border border-[#e9ded6] bg-stone-50 pl-11 pr-4 text-sm text-stone-600 outline-none" /></span><span className="text-[10px] font-normal text-stone-500">Email changes are managed through account verification.</span></label>
        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs leading-5 text-rose-900">{error}</p>}{success && <p role="status" className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs leading-5 text-emerald-900"><BadgeCheck size={15} />{success}</p>}
        <div className="flex justify-end"><button type="submit" disabled={saving || isPending || !name.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-rose-800 px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-900 disabled:cursor-not-allowed disabled:opacity-55">{saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}{saving ? "Saving changes…" : "Save profile"}</button></div>
      </form>
    </section>
  </div>;
}
