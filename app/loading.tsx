export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-8 w-52 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-72 animate-pulse rounded-2xl bg-slate-200 motion-reduce:animate-none" />
        ))}
      </div>
    </main>
  );
}
