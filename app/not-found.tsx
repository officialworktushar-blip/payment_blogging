import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <Compass aria-hidden="true" size={22} />
      </span>
      <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-700">404</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-navy-900">Page not found</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        The article or page you were looking for may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Back to homepage
      </Link>
    </main>
  );
}
