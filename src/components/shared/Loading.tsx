export function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex min-h-40 items-center justify-center gap-3 text-sm text-muted-foreground"
    >
      <span className="size-5 animate-spin rounded-full border-2 border-current border-r-transparent" />
      {label}
      <span className="sr-only">Please wait</span>
    </div>
  );
}
