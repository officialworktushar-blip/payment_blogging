import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState } from "@/components/empty-state";
import { getAdminPosts } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage articles",
  robots: { index: false, follow: false },
};

export default async function AdminPostsPage() {
  const posts = await getAdminPosts();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Articles</h1>
          <p className="mt-2 text-sm text-slate-600">Create, edit and publish payment explainers.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          New article
        </Link>
      </div>

      <div className="mt-8">
        {posts.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Title</th>
                  <th scope="col" className="px-4 py-3 font-medium">Category</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium">Updated</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{post.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">/{post.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{post.categories?.name ?? "General"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          post.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(post.updated_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil aria-hidden="true" size={13} />
                          Edit
                        </Link>
                        <DeleteButton id={post.id} kind="post" label={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No articles yet"
            description="Create your first article and set it to Published to make it visible on the site."
            href="/admin/posts/new"
            label="New article"
          />
        )}
      </div>
    </div>
  );
}
