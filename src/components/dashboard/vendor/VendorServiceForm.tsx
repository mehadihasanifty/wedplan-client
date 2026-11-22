"use client";

import { useState, type FormEvent } from "react";
import { ImagePlus, LoaderCircle, MapPin, UploadCloud } from "lucide-react";
import type { Service } from "@/types";
import { uploadImageToImgbb } from "@/lib/upload-image";
import { serviceCategories } from "@/components/dashboard/vendor/constants";
import { toast } from "sonner";

export type ServiceFormValues = Pick<
  Service,
  | "serviceName"
  | "category"
  | "description"
  | "price"
  | "location"
  | "images"
  | "isActive"
>;

export function VendorServiceForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Partial<Service>;
  submitLabel: string;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
}) {
  const [serviceName, setServiceName] = useState(initial?.serviceName ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initial?.images?.[0] ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const uploadedImage = file ? await uploadImageToImgbb(file) : undefined;
      const image = uploadedImage ?? initial?.images?.[0];
      if (!image)
        throw new Error("Please choose a service image before submitting.");
      await onSubmit({
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        isActive,
        images: image ? [image, ...(initial?.images?.slice(1) ?? [])] : [],
      });
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Could not save your service. Please try again.";
      setError(message);
      toast.error("Could not save service", { description: message });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-[#e9ded6] bg-white px-3.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/80";
  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-stone-700">
          Service name
          <input
            required
            maxLength={100}
            value={serviceName}
            onChange={(event) => setServiceName(event.target.value)}
            className={inputClass}
            placeholder="e.g. Garden wedding photography"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-stone-700">
          Category
          <select
            required
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Choose a category
            </option>
            {serviceCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-stone-700">
        Description
        <textarea
          required
          minLength={20}
          maxLength={3000}
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="w-full resize-y rounded-xl border border-[#e9ded6] bg-white px-3.5 py-3 text-sm font-normal text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/80"
          placeholder="Describe what couples can expect, what’s included, and what makes your service special."
        />
        <span className="text-right text-xs font-normal text-stone-400">
          {description.length}/3000
        </span>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-stone-700">
          Price per package
          <input
            required
            min="0"
            step="0.01"
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={inputClass}
            placeholder="0.00"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-stone-700">
          Location
          <span className="relative">
            <MapPin
              aria-hidden="true"
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-700"
            />
            <input
              required
              maxLength={120}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className={`${inputClass} pl-10`}
              placeholder="City, region"
            />
          </span>
        </label>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-stone-700">
          Service image{" "}
          <span className="font-normal text-stone-400">
            Required · uploaded to ImgBB
          </span>
        </p>
        <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#e5d4c9] bg-[#fffdfa] p-3.5 transition hover:border-rose-300 hover:bg-rose-50/30">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => {
              const selected = event.target.files?.[0];
              if (!selected) return;
              setFile(selected);
              const reader = new FileReader();
              reader.onload = () =>
                setPreview(
                  typeof reader.result === "string" ? reader.result : "",
                );
              reader.readAsDataURL(selected);
            }}
          />
          <span className="flex size-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-rose-50 text-rose-800">
            {preview ? (
              <span
                role="img"
                aria-label="Service image preview"
                className="size-full bg-cover bg-center"
                style={{ backgroundImage: `url("${preview}")` }}
              />
            ) : (
              <ImagePlus size={21} />
            )}
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold text-stone-800">
              {file?.name ??
                (preview ? "Replace service image" : "Choose service image")}
            </span>
            <span className="mt-1 block text-xs leading-4 text-stone-500">
              JPG, PNG or WebP · up to 5 MB
            </span>
          </span>
          <UploadCloud
            aria-hidden="true"
            size={18}
            className="ml-auto shrink-0 text-rose-700"
          />
        </label>
      </div>
      <label className="flex items-center justify-between gap-4 rounded-xl border border-[#eee5df] bg-[#fffdfa] px-4 py-3">
        <span>
          <span className="block text-xs font-semibold text-stone-800">
            Available for bookings
          </span>
          <span className="mt-1 block text-xs text-stone-500">
            Customers can request this service once it is approved.
          </span>
        </span>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className="size-4 accent-rose-800"
        />
      </label>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-900"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rose-800 px-5 text-sm font-semibold text-white shadow-md shadow-rose-950/10 transition hover:-translate-y-0.5 hover:bg-rose-900 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? (
          <>
            <LoaderCircle size={17} className="animate-spin" />
            Saving your service…
          </>
        ) : (
          <>
            <UploadCloud size={16} />
            {submitLabel}
          </>
        )}
      </button>
    </form>
  );
}
