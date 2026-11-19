"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  Clock3,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { getCheckoutStatus, type CheckoutStatus } from "@/services/payment-api";
import { toast } from "sonner";

const maxChecks = 10;

export function PaymentResult() {
  const params = useSearchParams();
  const sessionId = params.get("session_id") || "";
  const [result, setResult] = useState<CheckoutStatus | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const notified = useRef("");

  const checkStatus = useCallback(async () => {
    if (!sessionId) {
      setError("We couldn’t find a checkout session for this return link.");
      setChecking(false);
      return;
    }
    setChecking(true);
    setError("");
    try {
      setResult(await getCheckoutStatus(sessionId));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "We couldn’t check your payment yet.",
      );
    } finally {
      setChecking(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void checkStatus();
  }, [checkStatus, attempt]);
  useEffect(() => {
    if (
      !sessionId ||
      checking ||
      result?.confirmed ||
      result?.paymentStatus === "failed" ||
      result?.paymentStatus === "expired" ||
      error ||
      attempt >= maxChecks
    )
      return;
    const timer = window.setTimeout(
      () => setAttempt((value) => value + 1),
      2500,
    );
    return () => window.clearTimeout(timer);
  }, [sessionId, result, error, attempt, checking]);

  const confirmed = result?.confirmed === true;
  const waiting =
    checking ||
    (result?.paymentStatus === "pending" && !error && attempt < maxChecks);
  useEffect(() => {
    if (confirmed && notified.current !== "confirmed") {
      notified.current = "confirmed";
      toast.success("Premium subscription confirmed.");
    } else if (
      (result?.paymentStatus === "failed" ||
        result?.paymentStatus === "expired") &&
      notified.current !== result.paymentStatus
    ) {
      notified.current = result.paymentStatus;
      toast.error(
        result.paymentStatus === "failed"
          ? "Payment was not completed."
          : "Checkout session expired.",
      );
    } else if (error && notified.current !== "error") {
      notified.current = "error";
      toast.error("We couldn’t verify this checkout", { description: error });
    }
  }, [confirmed, result?.paymentStatus, error]);
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-3xl items-center px-4 py-12 sm:px-6">
      <section className="relative w-full overflow-hidden rounded-[2rem] border border-[#eadfd5] bg-[linear-gradient(140deg,#fffdfa,#fff6f1_62%,#f9eee5)] p-7 shadow-[0_28px_75px_-55px_rgba(82,43,44,.52)] sm:p-11">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full border border-rose-200/70"
        />
        <div className="relative mx-auto max-w-xl text-center">
          <span
            className={`mx-auto flex size-16 items-center justify-center rounded-[1.35rem] shadow-sm ${confirmed ? "bg-emerald-50 text-emerald-700" : error || result?.paymentStatus === "failed" || result?.paymentStatus === "expired" ? "bg-rose-50 text-rose-800" : "bg-white text-rose-800"}`}
          >
            {confirmed ? (
              <BadgeCheck size={29} />
            ) : error ||
              result?.paymentStatus === "failed" ||
              result?.paymentStatus === "expired" ? (
              <CircleAlert size={27} />
            ) : waiting ? (
              <Clock3 size={27} className="animate-pulse" />
            ) : (
              <ShieldCheck size={27} />
            )}
          </span>
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-800">
            {confirmed
              ? "A lovely next chapter"
              : "Secure payment confirmation"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#352321] sm:text-4xl">
            {confirmed
              ? "You’re Premium"
              : result?.paymentStatus === "failed"
                ? "Payment wasn’t completed"
                : result?.paymentStatus === "expired"
                  ? "Checkout expired"
                  : error
                    ? "We couldn’t verify this checkout"
                    : attempt >= maxChecks
                      ? "Confirmation is taking a moment"
                      : "Confirming your payment"}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600">
            {confirmed
              ? "Stripe confirmed your subscription. Your Premium features are now available, including unlimited active services."
              : result?.paymentStatus === "failed"
                ? "No Premium access was added. You can return to your subscription page and try checkout again."
                : result?.paymentStatus === "expired"
                  ? "This checkout session expired before payment was confirmed. Start a new checkout whenever you’re ready."
                  : error
                    ? error
                    : attempt >= maxChecks
                      ? "Stripe is still processing your confirmation. Your plan has not been changed yet; check again in a moment."
                      : "We’re waiting for Stripe’s verified confirmation. This page will not activate Premium based only on the redirect."}
          </p>
          {waiting && (
            <p
              role="status"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-xs font-medium text-stone-600"
            >
              <RefreshCw size={13} className="animate-spin text-rose-800" />
              Checking with WedPlan’s payment server…
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {confirmed ? (
              <Link
                href="/dashboard/vendor"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-rose-800 px-5 text-sm font-semibold text-white transition hover:bg-rose-900"
              >
                Go to your dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                {(error ||
                  attempt >= maxChecks ||
                  result?.paymentStatus === "failed" ||
                  result?.paymentStatus === "expired") && (
                  <button
                    type="button"
                    onClick={() => {
                      setAttempt(0);
                      void checkStatus();
                    }}
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-[#eadfd5] bg-white px-5 text-sm font-semibold text-stone-700 hover:bg-[#fffaf6]"
                  >
                    <RefreshCw size={15} />
                    Check again
                  </button>
                )}
                <Link
                  href="/dashboard/vendor/subscription"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-rose-800 px-5 text-sm font-semibold text-white transition hover:bg-rose-900"
                >
                  Subscription page
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
          <p className="mt-6 text-[10px] leading-5 text-stone-500">
            Your plan changes only after a verified Stripe webhook confirms
            payment.
          </p>
        </div>
      </section>
    </main>
  );
}
