"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

export function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setError("");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed. Use the address bar instead.");
    }
  }

  async function share() {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({ title, url: window.location.href });
      setError("");
    } catch {
      setError("Sharing was cancelled.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Share</span>
      <button
        type="button"
        onClick={() => void copyLink()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors motion-reduce:transition-none hover:border-brand-300 hover:text-brand-700"
      >
        {copied ? <Check aria-hidden="true" size={14} /> : <Link2 aria-hidden="true" size={14} />}
        {copied ? "Copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={() => void share()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors motion-reduce:transition-none hover:border-brand-300 hover:text-brand-700"
      >
        <Share2 aria-hidden="true" size={14} />
        Share
      </button>
      {error ? <span className="text-xs text-error-dark">{error}</span> : null}
    </div>
  );
}
