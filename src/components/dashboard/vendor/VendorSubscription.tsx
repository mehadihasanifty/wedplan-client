"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  BadgeCheck,
  Check,
  Crown,
  Infinity as InfinityIcon,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  createBillingPortalSession,
  createCheckoutSession,
  getSubscriptionInfo,
  type PremiumPlan,
  type SubscriptionInfo,
} from "@/services/payment-api";
import { toast } from "sonner";
import { Loading } from "@/components/shared/Loading";

type VendorUser = { subscriptionPlan?: string };

export function VendorSubscription() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user as VendorUser | undefined;
  const userId = session?.user?.id;
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
    null,
  );
  const [subscriptionError, setSubscriptionError] = useState("");
  const [subscriptionRequestUserId, setSubscriptionRequestUserId] = useState<string | null>(null);
  const subscriptionPending =
    sessionPending || (!!userId && subscriptionRequestUserId !== userId);
  const currentPlan = (subscription?.plan || user?.subscriptionPlan || "free").toLowerCase();
  const premium = /premium/i.test(currentPlan);
  const planLabel = currentPlan === "premium_plus" ? "Premium Plus" : currentPlan === "premium_pro" ? "Premium Pro" : premium ? "Premium" : "Free";
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionPending) return;
    if (!userId) return;

    let active = true;
    getSubscriptionInfo()
      .then((info) => {
        if (active) {
          setSubscription(info);
          setSubscriptionError("");
          setSubscriptionRequestUserId(userId);
        }
      })
      .catch((cause) => {
        if (active) {
          setSubscription(null);
          setSubscriptionError(
            cause instanceof Error
              ? cause.message
              : "Could not load subscription status.",
          );
          setSubscriptionRequestUserId(userId);
        }
      });
    return () => {
      active = false;
    };
  }, [userId, sessionPending]);

  async function upgrade(plan: PremiumPlan = "premium") {
    setLoadingAction(plan);
    setError("");
    try {
      const checkout = await createCheckoutSession(plan);
      if (!checkout.url)
        throw new Error(
          "The checkout link was not returned. Please try again.",
        );
      toast.info("Opening secure Stripe checkout…");
      window.location.assign(checkout.url);
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Could not start checkout. Please try again.";
      setError(message);
      toast.error("Could not start checkout", { description: message });
      setLoadingAction(null);
    }
  }

  async function manageBilling(actionKey = "billing") {
    setLoadingAction(actionKey);
    setError("");
    try {
      const portal = await createBillingPortalSession();
      if (!portal.url)
        throw new Error(
          "The billing portal link was not returned. Please try again.",
        );
      toast.info("Opening secure billing settings…");
      window.location.assign(portal.url);
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Could not open billing settings.";
      setError(message);
      toast.error("Could not open billing settings", { description: message });
      setLoadingAction(null);
    }
  }

  const premiumPrice = subscription?.price
    ? `${new Intl.NumberFormat("en", { style: "currency", currency: subscription.price.currency.toUpperCase() }).format(subscription.price.unitAmount / 100)} / ${subscription.price.interval}`
    : "Secure recurring checkout";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-800">
          Your growth plan
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#352321]">
          Subscription
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Choose the plan that fits the way you want to grow.
        </p>
      </div>
      {subscriptionPending ? (
        <div className="mb-6 rounded-2xl border border-[#eee3dc] bg-white px-4 shadow-sm">
          <Loading label="Loading your subscription details…" />
        </div>
      ) : (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#eee3dc] bg-white px-4 py-4 shadow-sm sm:px-5">
          <div className="flex items-center gap-3">
            <span
              className={`flex size-10 items-center justify-center rounded-xl ${premium ? "bg-amber-50 text-amber-800" : "bg-rose-50 text-rose-800"}`}
            >
              {premium ? <Crown size={19} /> : <ShieldCheck size={19} />}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
                Current subscription
              </p>
              <p className="mt-0.5 text-sm font-semibold capitalize text-stone-900">
                {planLabel} plan
              </p>
              {subscription?.cancelAtPeriodEnd && (
                <p className="mt-1 text-sm font-medium text-amber-800">
                  Cancellation scheduled at the end of this billing period
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${premium ? "bg-amber-50 text-amber-800" : "bg-stone-100 text-stone-600"}`}
            >
              {premium ? "Premium member" : "Free plan"}
            </span>
            {premium && (
              <button
                type="button"
                onClick={() => manageBilling()}
                disabled={loadingAction === "billing" || subscriptionPending}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#eadfd5] bg-white px-3 text-sm font-semibold text-stone-700 hover:bg-[#fffaf6] disabled:opacity-50"
              >
                <CreditCard size={13} />
                Manage billing
              </button>
            )}
          </div>
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-2">
        <PlanCard
          name="Free"
          subtitle="A thoughtful start for your business"
          price="Free"
          icon={ShieldCheck}
          current={!premium}
          features={[
            "Up to 3 active services",
            "Basic vendor dashboard",
            "Booking request management",
          ]}
        />
        <PlanCard
          name="Premium"
          subtitle="More room to reach your next clients"
          price={premiumPrice}
          icon={Crown}
          current={currentPlan === "premium"}
          highlighted
          features={[
            "Unlimited active services",
            "Premium vendor badge",
            "Everything in the Free plan",
          ]}
          action={
            currentPlan === "premium" ? (
              <span className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-amber-200 bg-amber-50 text-sm font-semibold text-amber-900">
                <BadgeCheck size={16} />
                Your current plan
              </span>
            ) : (
              <button
                type="button"
                onClick={() => premium ? manageBilling("premium") : upgrade("premium")}
                disabled={loadingAction === "premium" || subscriptionPending}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rose-800 px-5 text-sm font-semibold text-white shadow-md shadow-rose-950/10 transition hover:-translate-y-0.5 hover:bg-rose-900 disabled:cursor-wait disabled:opacity-60"
              >
                {loadingAction === "premium" ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Opening secure checkout…
                  </>
                ) : (
                  <>
                    {premium ? "Manage plan" : "Upgrade to Premium"}
                    <Sparkles size={15} />
                  </>
                )}
              </button>
            )
          }
        />
        {([
          { id: "premium_plus", name: "Premium Plus", price: formatTierPrice(200, subscription?.price?.currency, subscription?.price?.interval) },
          { id: "premium_pro", name: "Premium Pro", price: formatTierPrice(300, subscription?.price?.currency, subscription?.price?.interval) },
        ] as const).map((option) => (
          <PlanCard
            key={option.id}
            name={option.name}
            subtitle="More room to reach your next clients"
            price={option.price}
            icon={Crown}
            current={currentPlan === option.id}
            highlighted
            features={[
              "Unlimited active services",
              "Premium vendor badge",
              "Everything in the Free plan",
            ]}
            action={
              currentPlan === option.id ? (
                <span className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-amber-200 bg-amber-50 text-sm font-semibold text-amber-900">
                  <BadgeCheck size={16} />
                  Your current plan
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => premium ? manageBilling(option.id) : upgrade(option.id)}
                  disabled={loadingAction === option.id || subscriptionPending}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rose-800 px-5 text-sm font-semibold text-white shadow-md shadow-rose-950/10 transition hover:-translate-y-0.5 hover:bg-rose-900 disabled:cursor-wait disabled:opacity-60"
                >
                  {loadingAction === option.id ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      Opening secure checkout…
                    </>
                  ) : (
                    <>
                      {premium ? "Manage plan" : `Upgrade to ${option.name}`}
                      <Sparkles size={15} />
                    </>
                  )}
                </button>
              )
            }
          />
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
        <p className="text-sm leading-5 text-emerald-900">
          Payments are processed securely by Stripe. WedPlan uses Stripe Test
          Mode for this integration.
        </p>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          Test mode
        </span>
      </div>
      {subscriptionError && (
        <p role="alert" className="mt-3 text-xs text-amber-800">
          {subscriptionError}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-900"
        >
          {error}
        </p>
      )}
      <p className="mt-5 text-center text-xs leading-5 text-stone-400">
        You’ll continue to our secure checkout to complete your upgrade.
      </p>
    </div>
  );
}

function formatTierPrice(amount: number, currency = "USD", interval = "month") {
  const formattedAmount = new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
  return `${formattedAmount} / ${interval}`;
}

function PlanCard({
  name,
  subtitle,
  price,
  icon: Icon,
  current,
  highlighted,
  features,
  action,
}: {
  name: string;
  subtitle: string;
  price: string;
  icon: typeof Crown;
  current: boolean;
  highlighted?: boolean;
  features: string[];
  action?: ReactNode;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-[1.7rem] border p-6 shadow-[0_18px_50px_-40px_rgba(82,43,44,.42)] sm:p-7 ${highlighted ? "border-rose-200 bg-[linear-gradient(145deg,#fffaf6,#f7eee8)]" : "border-[#eee3dc] bg-white"}`}
    >
      {highlighted && (
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-16 size-52 rounded-full border border-rose-300/50"
        />
      )}
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`flex size-11 items-center justify-center rounded-2xl ${highlighted ? "bg-rose-800 text-white" : "bg-[#f7f0eb] text-rose-800"}`}
          >
            <Icon size={20} />
          </span>
          {current && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              Current plan
            </span>
          )}
        </div>
        <h2 className="mt-5 text-xl font-semibold text-stone-900">{name}</h2>
        <p className="mt-1 text-xs text-stone-500">{subtitle}</p>
        <p className="mt-5 text-3xl font-semibold tracking-tight text-[#4a2b32]">
          {price}
          <span className="ml-2 text-xs font-normal text-stone-500">
            subscription
          </span>
        </p>
        <ul className="mt-6 grid gap-3 border-t border-[#eadfd5] pt-5">
          {features.map((feature, index) => (
            <li
              key={feature}
              className="flex items-center gap-2.5 text-xs text-stone-700"
            >
              <span
                className={`flex size-5 items-center justify-center rounded-full ${highlighted ? "bg-rose-100 text-rose-800" : "bg-emerald-50 text-emerald-700"}`}
              >
                {index === 0 && name.startsWith("Premium") ? (
                  <InfinityIcon size={12} />
                ) : (
                  <Check size={12} />
                )}
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          {action ??
            (current ? (
              <span className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-900">
                <BadgeCheck size={15} />
                Your current plan
              </span>
            ) : (
              <span className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#eee3dc] bg-[#fffdfa] text-sm font-semibold text-stone-500">
                Included as your current tier
              </span>
            ))}
        </div>
      </div>
    </article>
  );
}
