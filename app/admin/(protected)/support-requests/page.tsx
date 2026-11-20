import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { SupportStatusControl } from "@/components/support-form";
import { getSupportRequests } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Support Requests",
  robots: { index: false, follow: false },
};

export default async function SupportRequestsPage() {
  const requests = await getSupportRequests();

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold tracking-tight text-navy-900">
        Support Requests
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Review messages from readers and mark them as resolved when you are done.
      </p>

      <p className="mt-6 text-xs text-slate-500">
        {requests.length} {requests.length === 1 ? "request" : "requests"}
      </p>

      <div className="mt-3">
        {requests.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Name</th>
                  <th scope="col" className="px-4 py-3 font-medium">Email</th>
                  <th scope="col" className="px-4 py-3 font-medium">Topic</th>
                  <th scope="col" className="px-4 py-3 font-medium">Message</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium">Date</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-3 font-medium text-navy-900">{request.name}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${request.email}`}
                        className="break-all text-brand-700 hover:underline"
                      >
                        {request.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{request.topic}</td>
                    <td className="max-w-xs px-4 py-3">
                      <p className="whitespace-pre-wrap break-words text-slate-600">
                        {request.message}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          request.status === "resolved"
                            ? "bg-success-light text-success-dark"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(request.created_at)}</td>
                    <td className="px-4 py-3">
                      <SupportStatusControl id={request.id} status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No support requests yet"
            description="New messages from readers will appear here once they submit the support form."
          />
        )}
      </div>
    </div>
  );
}
