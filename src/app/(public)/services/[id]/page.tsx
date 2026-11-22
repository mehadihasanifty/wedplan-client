"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, Store } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getService } from "@/services/service-api";
import { authClient } from "@/lib/auth-client";
import type { Service } from "@/types";
import { BookingForm } from "@/components/services/BookingForm";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: serviceId } = use(params);
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [service, setService] = useState<Service | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadedId, setLoadedId] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!serviceId) return;
    let active = true;
    getService(serviceId)
      .then((data) => {
        if (!active) return;
        if (data.status !== "approved" || data.isActive !== true) {
          setNotFound(true);
          setFailed(false);
          setLoadedId(serviceId);
          return;
        }
        setNotFound(false);
        setFailed(false);
        setService(data);
        setLoadedId(serviceId);
      })
      .catch((error) => {
        if (!active) return;
        if (error?.response?.status === 404) {
          setNotFound(true);
          setFailed(false);
        } else {
          setFailed(true);
          setNotFound(false);
        }
        setLoadedId(serviceId);
      });
    return () => {
      active = false;
    };
  }, [serviceId]);

  useEffect(() => {
    if (!sessionPending && !session)
      router.replace(
        `/signin?callbackURL=${encodeURIComponent(`/services/${serviceId}`)}`,
      );
  }, [session, sessionPending, serviceId, router]);

  if (sessionPending || !session)
    return (
      <div className="py-10">
        <Loading label="Checking your account…" />
      </div>
    );
  if (loadedId !== serviceId)
    return (
      <div className="py-10">
        <Loading label="Loading service details…" />
      </div>
    );
  if (failed)
    return (
      <div className="py-8">
        <ErrorState message="We couldn’t load this service. Please try again in a moment." />
        <Link
          href="/services"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-rose-800"
        >
          <ArrowLeft size={16} />
          Back to services
        </Link>
      </div>
    );
  if (notFound || !service)
    return (
      <div className="py-8">
        <EmptyState
          title="Service unavailable"
          description="This service may no longer exist, or it is not currently approved and active."
        />
        <div className="mt-5 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-rose-800 px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Browse available services
          </Link>
        </div>
      </div>
    );

  const images = [...new Set(service.images ?? [])];
  const selected = images[selectedImage];
  const vendorName =
    service.vendor?.businessName ||
    service.vendor?.name ||
    "Wedding professional";
  const price = service.currency
    ? new Intl.NumberFormat("en", {
        style: "currency",
        currency: service.currency,
        maximumFractionDigits: 0,
      }).format(service.price)
    : service.price.toLocaleString("en");

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4 }}
      className="pb-12"
    >
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-rose-50 hover:text-rose-900"
      >
        <ArrowLeft size={16} />
        All wedding services
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
        <div>
          <div className="relative aspect-[1.35/1] overflow-hidden rounded-[2rem] border border-[#eadfd5] bg-gradient-to-br from-rose-100 via-[#f8eee4] to-amber-100 sm:aspect-[1.65/1]">
            {selected ? (
              <div
                role="img"
                aria-label={`${service.serviceName} photo ${selectedImage + 1}`}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${selected}")` }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl italic text-rose-800/70">
                A lovely detail of your day
              </div>
            )}
            <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3.5 py-2 text-xs font-semibold text-rose-900 shadow-sm backdrop-blur">
              {service.category}
            </span>
          </div>
          {images.length > 1 && (
            <div
              aria-label="Service photos"
              className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6"
            >
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`Show service image ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-cover bg-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${selectedImage === index ? "border-rose-700" : "border-white hover:border-rose-200"}`}
                  style={{ backgroundImage: `url("${image}")` }}
                />
              ))}
            </div>
          )}
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.19em] text-rose-800">
              About this service
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-900">
              Details for your day
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-600">
              {service.description ||
                "Contact this wedding professional to learn more about their services."}
            </p>
          </div>
          <div className="mt-7 rounded-[1.5rem] border border-[#eee1d7] bg-[#fbf7f3] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.19em] text-rose-800">
              Your wedding professional
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-rose-800 shadow-sm">
                <Store size={20} />
              </span>
              <div>
                <p className="font-semibold text-stone-900">{vendorName}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-600">
                  <MapPin size={14} className="text-rose-700" />
                  {service.location}
                </p>
              </div>
            </div>
          </div>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-[1.7rem] border border-[#eee1d7] bg-white p-5 shadow-[0_18px_55px_-40px_rgba(82,43,44,.4)] sm:p-6">
            <p className="text-sm font-medium text-stone-500">Starting price</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-rose-900">
              {price}
              <span className="ml-2 text-sm font-normal text-stone-500">
                / package
              </span>
            </p>
            <h1 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.03em] text-stone-900">
              {service.serviceName}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-stone-600">
              <MapPin aria-hidden="true" size={16} className="text-rose-700" />
              {service.location}
            </p>
            <a
              href="#booking"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-800 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-rose-950/10 transition hover:bg-rose-900"
            >
              Check availability
              <ArrowRight size={16} />
            </a>
          </div>
          <BookingForm service={service} />
        </aside>
      </div>
    </motion.div>
  );
}
