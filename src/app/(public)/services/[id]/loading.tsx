import { Loading } from "@/components/shared/Loading";

export default function ServiceDetailsLoading() {
  return (
    <div className="py-10">
      <Loading label="Loading service details…" />
    </div>
  );
}
