export function ErrorState({
  message = "Something went wrong. Please try again.",
}: {
  message?: string;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
    >
      {message}
    </div>
  );
}
