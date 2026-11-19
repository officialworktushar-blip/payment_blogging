"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(`Unhandled page error: ${error.message}`);
  }, [error.message]);

  const showDetails = process.env.NODE_ENV === "development";

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-error-light text-error-dark">
        <AlertTriangle aria-hidden="true" size={22} />
      </span>
      <h1 className="mt-5 font-serif text-3xl font-semibold text-navy-900">Something went wrong</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        The page could not be loaded. Try again, or head back to the homepage.
      </p>
      {showDetails ? (
        <p className="mt-4 w-full rounded-lg border border-error/30 bg-error-light px-3 py-2 text-left font-mono text-xs text-error-dark">
          {error.message}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
