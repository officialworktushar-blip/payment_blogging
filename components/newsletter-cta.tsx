"use client";

import { useState, type FormEvent } from "react";

export function NewsletterCta() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-md">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-300 focus:border-white/50"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors motion-reduce:transition-none hover:bg-brand-50"
        >
          Join the list
        </button>
      </div>
      <p aria-live="polite" className="mt-2 text-xs text-brand-100">
        {submitted ? "UI only — no email has been sent." : "UI only for now. No emails will be sent."}
      </p>
    </form>
  );
}
