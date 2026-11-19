import { Suspense } from "react";
import { PaymentResult } from "@/components/payment/PaymentResult";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto my-12 max-w-3xl animate-pulse rounded-[2rem] border border-[#eadfd5] bg-white p-12 text-center text-sm text-stone-500">
          Checking your payment securely…
        </div>
      }
    >
      <PaymentResult />
    </Suspense>
  );
}
