"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BadgeCheck,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Power,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  deleteService,
  getServices,
  updateService,
} from "@/services/service-api";
import type { Service } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Loading } from "@/components/shared/Loading";
import { VendorServiceForm } from "@/components/dashboard/vendor/VendorServiceForm";
import {
  belongsToVendor,
  formatCurrency,
  serviceId,
} from "@/components/dashboard/vendor/constants";
import { toast } from "sonner";

type VendorUser = { id?: string; _id?: string; subscriptionPlan?: string };

export function VendorServicesManager() {
  const { data: session } = authClient.useSession();
  const user = session?.user as VendorUser | undefined;
  const vendorId = user?.id ?? user?._id;
  const premium = /premium/i.test(user?.subscriptionPlan || "");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Service | null>(null);
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    if (!vendorId) return;
    const data = await getServices({ vendorId, limit: 100 });
    setServices(data.filter((item) => belongsToVendor(item, vendorId)));
  }, [vendorId]);

  useEffect(() => {
    if (!vendorId) return;
    let active = true;
    getServices({ vendorId, limit: 100 })
      .then((data) => {
        if (active)
          setServices(data.filter((item) => belongsToVendor(item, vendorId)));
      })
      .catch(() => {
        if (active)
          setError(
            "We couldn’t load your services. Please refresh and try again.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [vendorId]);

  const activeCount = services.filter(
    (item) => item.status === "approved" && item.isActive === true,
  ).length;

  async function saveEdits(values: Parameters<typeof updateService>[1]) {
    if (!editing) return;
    const id = serviceId(editing);
    if (!id) throw new Error("Could not identify this service.");
    setBusyId(id);
    try {
      await updateService(id, values);
      await refresh();
      setEditing(null);
      setNotice("Service details updated.");
      toast.success("Service details updated.");
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Could not update this service.";
      setError(message);
      toast.error("Service update failed", { description: message });
      throw cause;
    } finally {
      setBusyId("");
    }
  }

  async function toggleAvailability(service: Service) {
    const id = serviceId(service);
    if (!id) return;
    const willBeActive = service.isActive !== true;
    if (
      willBeActive &&
      service.status === "approved" &&
      !premium &&
      activeCount >= 3
    ) {
      const message =
        "Your Free plan allows up to 3 active services. Upgrade to Premium or pause another listing first.";
      setError(message);
      toast.error("Free plan limit reached", { description: message });
      return;
    }
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      await updateService(id, { isActive: willBeActive });
      await refresh();
      const message = willBeActive
        ? "Service marked available."
        : "Service paused and hidden from customers.";
      setNotice(message);
      toast.success(message);
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Could not change service availability.";
      setError(message);
      toast.error("Could not change availability", { description: message });
    } finally {
      setBusyId("");
    }
  }

  async function removeService(service: Service) {
    const id = serviceId(service);
    if (
      !id ||
      !window.confirm(
        `Delete “${service.serviceName}”? This action cannot be undone.`,
      )
    )
      return;
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      await deleteService(id);
      await refresh();
      setNotice("Service deleted.");
      toast.success("Service deleted.");
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Could not delete this service.";
      setError(message);
      toast.error("Could not delete service", { description: message });
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-800">
            Your listings
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#352321]">
            My services
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Update your offerings, availability, and approval status.
          </p>
        </div>
        <Link
          href="/dashboard/vendor/add-service"
          className="inline-flex items-center gap-2 rounded-full bg-rose-800 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-rose-950/10 transition hover:bg-rose-900"
        >
          <Plus size={15} />
          Add a service
        </Link>
      </div>
      {!premium && !loading && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3">
          <p className="text-xs text-stone-700">
            Free plan: <strong>{activeCount} of 3 active listings</strong>
          </p>
          {activeCount >= 3 && (
            <Link
              href="/dashboard/vendor/subscription"
              className="text-sm font-semibold text-rose-900 underline underline-offset-2"
            >
              Upgrade for unlimited services
            </Link>
          )}
        </div>
      )}
      {notice && (
        <p
          role="status"
          className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800"
        >
          {notice}
        </p>
      )}
      {error && (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      )}
      {loading ? (
        <Loading label="Loading your services…" />
      ) : services.length === 0 ? (
        <EmptyState
          title="Your first listing starts here"
          description="Add a service to introduce your work to couples planning their day."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {services.map((service, index) => {
            const id = serviceId(service);
            const status = service.status ?? "pending";
            const approved = status === "approved";
            const active = service.isActive === true;
            return (
              <article
                key={id || `${service.serviceName}-${index}`}
                className="overflow-hidden rounded-[1.55rem] border border-[#eee3dc] bg-white shadow-[0_15px_40px_-34px_rgba(82,43,44,.38)]"
              >
                <div className="flex gap-4 p-4 sm:p-5">
                  <span className="relative w-24 h-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 via-[#f8eee4] to-amber-100 sm:w-[190px] sm:h-[160px]">
                    {service.images?.[0] && (
                      <span
                        role="img"
                        aria-label={`${service.serviceName} image`}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url("${service.images[0]}")`,
                        }}
                      />
                    )}
                    <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[12px] font-semibold text-rose-900 shadow-sm">
                      {service.category}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="line-clamp-2 text-base font-semibold text-stone-900">
                          {service.serviceName}
                        </h2>
                        <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-stone-500">
                          <MapPin
                            size={13}
                            className="shrink-0 text-rose-700"
                          />
                          {service.location}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-rose-900">
                        {formatCurrency(
                          service.price,
                          service.currency || "USD",
                        )}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusBadge status={status} />
                      {approved ? (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-emerald-50 text-emerald-800" : "bg-stone-100 text-stone-600"}`}
                        >
                          {active ? "Available" : "Paused"}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                {service.description && (
                  <p className="px-4 pb-4 text-xs leading-5 text-stone-500 sm:px-5">
                    {service.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#f0e8e2] bg-[#fffdfa] px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2">
                    {approved ? (
                      <button
                        type="button"
                        disabled={busyId === id}
                        onClick={() => toggleAvailability(service)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfd5] bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-rose-200 hover:text-rose-900 disabled:opacity-50"
                      >
                        <Power size={13} />
                        {active ? "Pause" : "Make available"}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
                        <Eye size={13} />
                        Only you can see this listing while it’s {status}.
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={busyId === id}
                      onClick={() => {
                        setError("");
                        setEditing(service);
                      }}
                      aria-label={`Edit ${service.serviceName}`}
                      className="flex size-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-rose-50 hover:text-rose-900 disabled:opacity-50"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      disabled={busyId === id}
                      onClick={() => removeService(service)}
                      aria-label={`Delete ${service.serviceName}`}
                      className="flex size-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-rose-50 hover:text-rose-800 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {editing && (
        <div
          role="presentation"
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-stone-950/35 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busyId)
              setEditing(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-service-title"
            className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[1.7rem] bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-800">
                  Service details
                </p>
                <h2
                  id="edit-service-title"
                  className="mt-1 text-xl font-semibold text-stone-900"
                >
                  Edit service
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close editor"
                className="flex size-9 items-center justify-center rounded-full border border-[#eee3dc] text-stone-500 hover:bg-rose-50"
              >
                <X size={16} />
              </button>
            </div>
            <VendorServiceForm
              key={serviceId(editing)}
              initial={editing}
              submitLabel="Save changes"
              onSubmit={saveEdits}
            />
          </section>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "approved"
      ? "bg-emerald-50 text-emerald-800"
      : status === "rejected"
        ? "bg-rose-50 text-rose-800"
        : "bg-amber-50 text-amber-800";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}
    >
      {status === "approved" && <BadgeCheck size={11} />} {status}
    </span>
  );
}
