export function PageHeader({ title, description }: { title: string; description?: string }) {
  return <header className="mb-8 space-y-2"><h1 className="text-3xl font-semibold tracking-tight">{title}</h1>{description && <p className="max-w-2xl text-muted-foreground">{description}</p>}</header>;
}
