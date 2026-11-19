"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, CircleAlert, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { createService, getServices } from "@/services/service-api";
import type { Service } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { VendorServiceForm } from "@/components/dashboard/vendor/VendorServiceForm";
import { belongsToVendor } from "@/components/dashboard/vendor/constants";
import { toast } from "sonner";

type VendorUser = { id?: string; _id?: string; plan?: string; subscriptionPlan?: string };

export function AddServicePageClient() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as VendorUser | undefined;
  const vendorId = user?.id ?? user?._id;
  const premium = /premium/i.test(user?.subscriptionPlan || user?.plan || "");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!vendorId) return;
    let active = true;
    getServices({ vendorId, limit: 100 }).then(data => { if (active) { setServices(data.filter(item => belongsToVendor(item, vendorId))); setLoadError(false); } })
      .catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [vendorId]);

  const activeCount = services.filter(item => item.status === "approved" && item.isActive === true).length;
  const limitReached = !premium && activeCount >= 3;

  async function save(values: Parameters<typeof createService>[0]) {
    setSaving(true);
    try {
      await createService({ ...values, status: "pending" });
      toast.success("Service submitted", { description: "It will appear publicly after admin approval." });
      router.push("/dashboard/vendor/my-services"); router.refresh();
    } finally { setSaving(false); }
  }

  return <div className="mx-auto max-w-4xl">
    <Link href="/dashboard/vendor" className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-stone-600 transition hover:bg-rose-50 hover:text-rose-900"><ArrowLeft size={15}/>Back to overview</Link>
    <PageHeader title="Add a service" description="Introduce your work to couples planning their celebration." />
    {loading ? <Loading label="Checking your service limit…"/> : loadError ? <ErrorState message="We couldn’t check your current listings. Please try again before adding a service."/> : limitReached ? <div className="rounded-[1.6rem] border border-amber-200 bg-[linear-gradient(135deg,#fffaf0,#fff6e5)] p-6 sm:p-8"><span className="flex size-11 items-center justify-center rounded-2xl bg-white text-amber-800 shadow-sm"><CircleAlert size={20}/></span><h2 className="mt-4 text-xl font-semibold text-stone-900">You’ve reached the Free plan limit</h2><p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">Free vendors can have up to 3 active services. Upgrade to Premium to publish unlimited services, or pause an active listing to make room.</p><Link href="/dashboard/vendor/subscription" className="mt-5 inline-flex rounded-full bg-rose-800 px-5 py-3 text-xs font-semibold text-white transition hover:bg-rose-900">Explore Premium</Link></div> : <>
      <div className="mb-5 flex flex-wrap items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3.5"><Info aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-rose-800"/><p className="text-xs leading-5 text-stone-700">New services are submitted for admin review and start with <strong>Pending</strong> status. Customers can only book approved, available services. <span className="ml-1 font-semibold text-rose-900">{premium ? "Premium · unlimited active services" : `Free plan · ${activeCount} of 3 active services used`}</span></p></div>
      <section className="rounded-[1.6rem] border border-[#eee3dc] bg-white p-5 shadow-[0_16px_42px_-35px_rgba(82,43,44,.36)] sm:p-7"><VendorServiceForm submitLabel="Submit for review" onSubmit={save}/></section>
      {saving && <p role="status" className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-stone-500"><BadgeCheck size={14} className="text-rose-800"/>Submitting your listing securely…</p>}
    </>}
  </div>;
}
