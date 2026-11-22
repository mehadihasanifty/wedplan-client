export function EmptyState({
  title = "Nothing here yet",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center">
      <h2 className="text-lg font-semibold text-stone-800">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
