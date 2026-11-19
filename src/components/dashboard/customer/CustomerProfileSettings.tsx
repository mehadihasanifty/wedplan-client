"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  BadgeCheck,
  Camera,
  CircleUserRound,
  ImagePlus,
  LoaderCircle,
  Mail,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { uploadImageToImgbb, validateImageFile } from "@/lib/upload-image";
import { PageHeader } from "@/components/shared/PageHeader";
import { Loading } from "@/components/shared/Loading";
import { toast } from "sonner";

type ProfileUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  phoneNumber?: string | null;
  location?: string | null;
  bio?: string | null;
};

export function CustomerProfileSettings({
  role = "customer",
}: {
  role?: "customer" | "vendor";
}) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as ProfileUser | undefined;
  const fileInput = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phoneNumber || "");
    setLocation(user?.location || "");
    setBio(user?.bio || "");
    setImage(user?.image || "");
  }, [user?.name, user?.phoneNumber, user?.location, user?.bio, user?.image]);

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      validateImageFile(file);
      setSelectedFile(file);
      setImage(URL.createObjectURL(file));
      setError("");
      setSuccess("");
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Please choose a valid image.";
      setError(message);
      toast.error("Invalid profile image", { description: message });
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }
    setSaving(true);
    try {
      const uploadedImage = selectedFile
        ? await uploadImageToImgbb(selectedFile)
        : image;
      await api.patch("/profile", {
        name: cleanName,
        image: uploadedImage,
        phoneNumber: phone.trim(),
        location: location.trim(),
        bio: bio.trim(),
      });
      await authClient.getSession();
      setImage(uploadedImage || "");
      setSelectedFile(null);
      setSuccess("Your profile has been updated successfully.");
      toast.success("Profile updated.");
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "We couldn’t update your profile. Please try again.";
      setError(message);
      toast.error("Profile update failed", { description: message });
    } finally {
      setSaving(false);
    }
  }

  const email = user?.email || "";
  const accountRoleLabel = role === "vendor" ? "Vendor" : "Customer";
  if (isPending)
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="Profile settings"
          description={`Keep your ${accountRoleLabel.toLowerCase()} profile and contact details up to date.`}
        />
        <Loading label="Loading your profile…" />
      </div>
    );
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Profile settings"
        description={`Keep your ${accountRoleLabel.toLowerCase()} profile and contact details up to date.`}
      />
      <section className="overflow-hidden rounded-[1.7rem] border border-[#eee3dc] bg-white shadow-[0_20px_55px_-42px_rgba(82,43,44,.4)]">
        <div className="relative overflow-hidden border-b border-[#f0e8e2] bg-[linear-gradient(115deg,#fffdfa,#fbf3ed)] px-5 py-6 sm:px-7">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-20 size-56 rounded-full border border-rose-200/60"
          />
          <div className="relative flex items-center gap-4">
            <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.35rem] border border-white bg-gradient-to-br from-rose-100 to-amber-100 text-rose-900 shadow-sm">
              {image ? (
                <span
                  aria-label="Profile photo preview"
                  role="img"
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url("${image}")` }}
                />
              ) : (
                <span className="text-xl font-semibold">
                  {(name || "W").slice(0, 1).toUpperCase()}
                </span>
              )}
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                aria-label="Change profile image"
                className="absolute inset-x-0 bottom-0 flex h-6 items-center justify-center bg-stone-900/55 text-white"
              >
                <Camera size={13} />
              </button>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-rose-800">
                Your WedPlan identity
              </p>
              <h2 className="mt-1 truncate text-lg font-semibold text-stone-900">
                {name || "Your profile"}
              </h2>
              <p className="mt-1 truncate text-xs text-stone-500">{email}</p>
            </div>
            <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-[9px] font-semibold text-emerald-800 sm:inline-flex">
              <ShieldCheck size={13} />
              {accountRoleLabel} account
            </span>
          </div>
        </div>
        <form
          onSubmit={saveProfile}
          className="grid gap-5 px-5 py-6 sm:px-7 sm:py-7"
        >
          <div>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={selectImage}
              className="sr-only"
              aria-label="Choose profile image"
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#eadfd5] bg-[#fffdfa] px-4 text-xs font-semibold text-stone-700 transition hover:border-rose-200 hover:bg-rose-50"
              >
                <ImagePlus size={15} className="text-rose-800" />
                {selectedFile ? "Choose another photo" : "Upload profile photo"}
              </button>
              {selectedFile && (
                <span className="flex min-w-0 items-center gap-1.5 text-[10px] text-stone-500">
                  <span className="max-w-52 truncate">{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setImage(user?.image || "");
                      if (fileInput.current) fileInput.current.value = "";
                    }}
                    aria-label="Remove selected image"
                    className="rounded-full p-1 text-stone-400 hover:bg-rose-50 hover:text-rose-800"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}
              <span className="text-[10px] text-stone-400">
                JPG, PNG or WebP · up to 5 MB
              </span>
            </div>
          </div>
          <label className="grid gap-1.5 text-xs font-semibold text-stone-700">
            Full name
            <span className="relative">
              <CircleUserRound
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700/70"
              />
              <input
                required
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isPending || saving}
                className="h-12 w-full rounded-xl border border-[#e9ded6] bg-white pl-11 pr-4 text-sm font-normal text-stone-800 outline-none transition hover:border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/80 disabled:bg-stone-50"
                placeholder="Your name"
              />
            </span>
          </label>
          <label className="grid gap-1.5 text-xs font-semibold text-stone-700">
            Email address
            <span className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700/70"
              />
              <input
                type="email"
                value={email}
                readOnly
                className="h-12 w-full rounded-xl border border-[#e9ded6] bg-stone-50 pl-11 pr-4 text-sm font-normal text-stone-600 outline-none"
              />
            </span>
            <span className="text-[10px] font-normal text-stone-500">
              Email is managed through account verification.
            </span>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-semibold text-stone-700">
              Phone number{" "}
              <span className="text-[10px] font-normal text-stone-400">
                Optional
              </span>
              <input
                type="tel"
                maxLength={32}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                disabled={saving}
                placeholder="Add a contact number"
                className="h-12 rounded-xl border border-[#e9ded6] px-3.5 text-sm font-normal text-stone-800 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/80"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-stone-700">
              Location{" "}
              <span className="text-[10px] font-normal text-stone-400">
                Optional
              </span>
              <input
                maxLength={120}
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                disabled={saving}
                placeholder="City or region"
                className="h-12 rounded-xl border border-[#e9ded6] px-3.5 text-sm font-normal text-stone-800 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/80"
              />
            </label>
          </div>
          <label className="grid gap-1.5 text-xs font-semibold text-stone-700">
            About you{" "}
            <span className="text-[10px] font-normal text-stone-400">
              Optional
            </span>
            <textarea
              rows={4}
              maxLength={500}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              disabled={saving}
              placeholder="Share a little about the celebration you’re planning…"
              className="resize-y rounded-xl border border-[#e9ded6] px-3.5 py-3 text-sm font-normal leading-6 text-stone-800 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/80"
            />
            <span className="text-right text-[10px] font-normal text-stone-400">
              {bio.length}/500
            </span>
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0e8e2] pt-5">
            <p className="text-[10px] leading-5 text-stone-500">
              Your role and subscription plan are protected account settings and
              cannot be changed here.
            </p>
            <button
              type="submit"
              disabled={saving || isPending || !name.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-rose-800 px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-900 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {saving ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {saving ? "Saving changes…" : "Save profile"}
            </button>
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs leading-5 text-rose-900"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              role="status"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs leading-5 text-emerald-900"
            >
              <BadgeCheck size={15} />
              {success}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
