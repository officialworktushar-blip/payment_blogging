import type { Metadata } from "next";
import { Inbox } from "lucide-react";

export const metadata: Metadata = {
  title: "Support Requests",
  robots: { index: false, follow: false },
};

export default function SupportRequestsPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <Inbox aria-hidden="true" size={22} />
      </span>
      <h1 className="mt-5 font-serif text-2xl font-semibold text-navy-900">Support Requests</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        No support inbox is connected yet. This page is ready for a future request queue.
      </p>
    </div>
  );
}
