"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff, ImagePlus, LoaderCircle, LockKeyhole, Mail, Sparkles, Store, UserRound, UserRoundCheck, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type AccountRole = "customer" | "vendor";
type FormValues = { name: string; email: string; password: string };

const passwordRules = [
  { label: "At least 6 characters", test: (value: string) => value.length >= 6 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
];

async function uploadProfileImage(file: File) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) throw new Error("Profile image uploads are not configured yet. You can remove the optional image or set NEXT_PUBLIC_IMGBB_API_KEY.");

  const payload = new FormData();
  payload.append("image", file);
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, { method: "POST", body: payload });
  const result = await response.json() as { success?: boolean; data?: { url?: string }; error?: { message?: string } };
  if (!response.ok || !result.success || !result.data?.url) throw new Error(result.error?.message || "We couldn’t upload that image. Please try another file.");
  return result.data.url;
}

export default function SignUpPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<FormValues>({ name: "", email: "", password: "" });
  const [role, setRole] = useState<AccountRole>("customer");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const passwordValid = passwordRules.every(rule => rule.test(values.password));
  const dashboardPath = role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer";

  function update(field: keyof FormValues, value: string) {
    setValues(current => ({ ...current, [field]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  }

  function selectProfileImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.currentTarget.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose an image smaller than 5 MB.");
      event.currentTarget.value = "";
      return;
    }
    setError("");
    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  }

  function removeProfileImage() {
    setProfileFile(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleEmailSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!passwordValid) {
      setError("Please meet all password requirements before continuing.");
      return;
    }

    setSubmitting("email");
    try {
      const image = profileFile ? await uploadProfileImage(profileFile) : undefined;
      const payload = { name: values.name.trim(), email: values.email.trim(), password: values.password, callbackURL: dashboardPath, role, ...(image ? { image } : {}) };
      const result = await authClient.signUp.email(payload as Parameters<typeof authClient.signUp.email>[0]);
      if (result.error) throw new Error(result.error.message || "We couldn’t create your account. Please try again.");
      setSuccess("Your account is ready. Taking you to your WedPlan workspace…");
      router.replace(dashboardPath);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn’t create your account. Please try again.");
    } finally {
      setSubmitting(null);
    }
  }

  async function handleGoogleSignUp() {
    setError("");
    setSuccess("");
    setSubmitting("google");
    try {
      const image = profileFile ? await uploadProfileImage(profileFile) : undefined;
      const result = await authClient.signIn.social({ provider: "google", callbackURL: dashboardPath, additionalData: { role, ...(image ? { image } : {}) } });
      if (result.error) throw new Error(result.error.message || "Google sign-up could not be started. Please try again.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Google sign-up could not be started. Please try again.");
      setSubmitting(null);
    }
  }

  const inputClass = "h-12 w-full rounded-xl border border-[#e9ded6] bg-white pl-11 pr-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/80";

  return (
    <section className="overflow-hidden rounded-[1.8rem] border border-[#eee1d7] bg-white shadow-[0_28px_80px_-48px_rgba(82,43,44,.32)]">
      <div className="relative border-b border-rose-100/80 bg-[linear-gradient(120deg,#fffaf6,#f8eee7_60%,#f4e8e0)] px-6 pb-6 pt-7 sm:px-8 sm:pt-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-20 size-52 rounded-full border border-rose-900/[.07]" />
        <div className="relative"><span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-800"><Sparkles aria-hidden="true" size={12} />Your next chapter</span><h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#352321]">Create your account</h1><p className="mt-2 text-sm leading-6 text-stone-600">Join WedPlan and bring your wedding plans together.</p></div>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-7">
        <fieldset disabled={submitting !== null} className="min-w-0 border-0 p-0">
          <legend className="mb-3 text-xs font-semibold text-stone-800">I’m joining WedPlan as a…</legend>
          <div role="radiogroup" aria-label="Account role" className="grid grid-cols-2 gap-3">
            <RoleChoice value="customer" current={role} onSelect={setRole} icon={<UserRoundCheck size={18} />} title="Customer" description="Planning a celebration" />
            <RoleChoice value="vendor" current={role} onSelect={setRole} icon={<Store size={18} />} title="Vendor" description="Offering wedding services" />
          </div>
        </fieldset>

        <form onSubmit={handleEmailSignUp} className="mt-5 grid gap-4">
          <label className="grid gap-1.5 text-xs font-semibold text-stone-700">Full name<span className="relative"><UserRound aria-hidden="true" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700/70" /><input autoComplete="name" required maxLength={100} value={values.name} onChange={event => update("name", event.target.value)} className={inputClass} placeholder="Your name" /></span></label>
          <label className="grid gap-1.5 text-xs font-semibold text-stone-700">Email address<span className="relative"><Mail aria-hidden="true" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700/70" /><input autoComplete="email" required type="email" value={values.email} onChange={event => update("email", event.target.value)} className={inputClass} placeholder="you@example.com" /></span></label>
          <label className="grid gap-1.5 text-xs font-semibold text-stone-700">Password<span className="relative"><LockKeyhole aria-hidden="true" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700/70" /><input autoComplete="new-password" required type={showPassword ? "text" : "password"} value={values.password} onChange={event => update("password", event.target.value)} className={`${inputClass} pr-12`} placeholder="Create a password" aria-describedby="password-rules" /><button type="button" onClick={() => setShowPassword(show => !show)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-stone-500 transition hover:bg-rose-50 hover:text-rose-800">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>
          <ul id="password-rules" className="-mt-1 grid grid-cols-1 gap-1.5 pl-0.5 sm:grid-cols-3">{passwordRules.map(rule => { const met = rule.test(values.password); return <li key={rule.label} className={`flex items-center gap-1.5 text-[10px] ${met ? "font-medium text-emerald-700" : "text-stone-500"}`}><span className={`flex size-3.5 items-center justify-center rounded-full ${met ? "bg-emerald-100" : "bg-stone-100"}`}>{met && <Check size={10} />}</span>{rule.label}</li>; })}</ul>

          <div><div className="mb-1.5 flex items-center justify-between"><p className="text-xs font-semibold text-stone-700">Profile image <span className="font-normal text-stone-400">Optional</span></p>{profileFile && <button type="button" onClick={removeProfileImage} className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold text-rose-800 hover:bg-rose-50"><X size={12} />Remove</button>}</div><input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={selectProfileImage} className="sr-only" aria-label="Upload profile image" />{preview ? <button type="button" onClick={() => fileInputRef.current?.click()} className="flex w-full items-center gap-3 rounded-xl border border-rose-100 bg-[#fffaf7] p-2.5 text-left transition hover:border-rose-200"><span role="img" aria-label="Selected profile image preview" className="size-12 shrink-0 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url("${preview}")` }} /><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-stone-800">{profileFile?.name}</span><span className="mt-1 block text-[10px] text-stone-500">Ready to upload · up to 5 MB</span></span><ImagePlus size={17} className="mr-2 shrink-0 text-rose-700" /></button> : <button type="button" onClick={() => fileInputRef.current?.click()} className="flex w-full items-center gap-3 rounded-xl border border-dashed border-[#e5d4c9] bg-[#fffdfa] px-4 py-3.5 text-left transition hover:border-rose-300 hover:bg-rose-50/40"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-800"><ImagePlus size={17} /></span><span><span className="block text-xs font-semibold text-stone-800">Choose a profile photo</span><span className="mt-1 block text-[10px] text-stone-500">JPG, PNG or WebP · up to 5 MB · uploaded securely to ImgBB</span></span></button>}</div>

          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs leading-5 text-rose-900">{error}</p>}
          {success && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs leading-5 text-emerald-900">{success}</p>}
          <button type="submit" disabled={submitting !== null || !values.name.trim() || !values.email.trim() || !passwordValid} className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rose-800 px-5 text-sm font-semibold text-white shadow-md shadow-rose-950/10 transition hover:-translate-y-0.5 hover:bg-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55">{submitting === "email" ? <><LoaderCircle size={17} className="animate-spin" />Creating your account…</> : <>Create account<ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></>}</button>
        </form>

        <div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-[#eee5df]" /><span className="text-[10px] font-medium uppercase tracking-[0.12em] text-stone-400">or continue with</span><span className="h-px flex-1 bg-[#eee5df]" /></div>
        <button type="button" onClick={handleGoogleSignUp} disabled={submitting !== null} className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-[#e9ded6] bg-white text-sm font-semibold text-stone-700 shadow-sm transition hover:border-rose-200 hover:bg-[#fffdfa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">{submitting === "google" ? <LoaderCircle size={17} className="animate-spin" /> : <GoogleMark />}Continue with Google</button>
        <p className="mt-5 text-center text-xs text-stone-500">Already have an account? <Link href="/login" className="font-semibold text-rose-800 underline-offset-4 hover:underline">Sign in</Link></p>
        <p className="mt-4 text-center text-[10px] leading-5 text-stone-400">Public accounts are for customers and vendors. Admin access is assigned securely by WedPlan.</p>
      </div>
    </section>
  );
}

function RoleChoice({ value, current, onSelect, icon, title, description }: { value: AccountRole; current: AccountRole; onSelect: (value: AccountRole) => void; icon: ReactNode; title: string; description: string }) {
  const selected = value === current;
  return <button type="button" role="radio" aria-checked={selected} onClick={() => onSelect(value)} className={`relative flex min-h-[76px] items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 ${selected ? "border-rose-300 bg-rose-50/70 shadow-sm shadow-rose-950/5" : "border-[#eee5df] bg-white hover:border-rose-200 hover:bg-[#fffdfa]"}`}><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-rose-800 text-white" : "bg-[#f5eee8] text-rose-800"}`}>{icon}</span><span className="min-w-0"><span className="block text-xs font-semibold text-stone-900">{title}</span><span className="mt-0.5 block text-[10px] leading-4 text-stone-500">{description}</span></span>{selected && <span className="absolute right-2.5 top-2.5 flex size-4 items-center justify-center rounded-full bg-rose-800 text-white"><Check size={10} /></span>}</button>;
}

function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.4l-3.24-2.52c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.92A6 6 0 0 1 6.1 12c0-.67.11-1.32.31-1.92v-2.6H3.06A10 10 0 0 0 2 12c0 1.62.39 3.15 1.06 4.52l3.35-2.6Z"/><path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.83 1.5l2.87-2.86C16.96 2.98 14.7 2 12 2a10 10 0 0 0-8.94 5.48l3.35 2.6C7.2 7.72 9.4 5.96 12 5.96Z"/></svg>;
}
