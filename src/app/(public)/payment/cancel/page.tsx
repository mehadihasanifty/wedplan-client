import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-3xl items-center px-4 py-12 sm:px-6">
      <section className="relative w-full overflow-hidden rounded-[2rem] border border-[#eadfd5] bg-[linear-gradient(140deg,#fffdfa,#fff7f2_62%,#f8eee7)] p-7 shadow-[0_28px_75px_-55px_rgba(82,43,44,.48)] sm:p-11">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full border border-rose-200/70"
        />
        <div className="relative mx-auto max-w-xl text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-[1.35rem] bg-white text-rose-800 shadow-sm">
            <ShieldCheck size={27} />
          </span>
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-800">
            You’re always in control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#352321] sm:text-4xl">
            Checkout cancelled
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600">
            No payment was completed and your subscription hasn’t changed. Your
            Free plan remains available whenever you’re ready.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard/vendor/subscription"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-rose-800 px-5 text-sm font-semibold text-white transition hover:bg-rose-900"
            >
              Return to plans
              <ArrowLeft size={16} />
            </Link>
            <Link
              href="/dashboard/vendor"
              className="inline-flex h-12 items-center rounded-full border border-[#eadfd5] bg-white px-5 text-sm font-semibold text-stone-700 hover:bg-[#fffaf6]"
            >
              Vendor dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
