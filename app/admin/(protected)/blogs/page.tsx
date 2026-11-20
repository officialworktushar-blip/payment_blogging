import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon, Plus } from "lucide-react";
import { BlogRowActions } from "@/components/admin/blog-row-actions";
import { EmptyState } from "@/components/empty-state";
import { getAdminBlogs, getBlogCategories } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Blogs",
  robots: { index: false, follow: false },
};

interface AdminBlogsPageProps {
  searchParams: Promise<{ q?: string | string[]; status?: string | string[]; category?: string | string[] }>;
}

const fieldClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export default async function AdminBlogsPage({ searchParams }: AdminBlogsPageProps) {
  const params = await searchParams;
  const qParam = Array.isArray(params.q) ? params.q[0] : params.q;
  const statusParam = Array.isArray(params.status) ? params.status[0] : params.status;
  const categoryParam = Array.isArray(params.category) ? params.category[0] : params.category;
  const query = typeof qParam === "string" ? qParam.trim().toLowerCase() : "";
  const status = statusParam === "published" || statusParam === "draft" ? statusParam : "";
  const category = typeof categoryParam === "string" ? categoryParam : "";

  const [blogs, categories] = await Promise.all([getAdminBlogs(), getBlogCategories()]);
  const visibleBlogs = blogs.filter((blog) => {
    if (status && blog.status !== status) {
      return false;
    }

    if (category && blog.category_id !== category) {
      return false;
    }

    if (!query) {
      return true;
    }

    return `${blog.title} ${blog.subtitle ?? ""} ${blog.description ?? ""} ${blog.categories?.name ?? ""}`
      .toLowerCase()
      .includes(query);
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-navy-900">All Blogs</h1>
          <p className="mt-2 text-sm text-slate-600">Create, edit, publish and organise payment guides.</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus aria-hidden="true" size={15} />
          New blog
        </Link>
      </div>

      <form method="get" className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="min-w-[200px] flex-1">
          <label htmlFor="blog-search" className="mb-1.5 block text-xs font-medium text-slate-600">
            Search
          </label>
          <input
            id="blog-search"
            name="q"
            defaultValue={query}
            placeholder="Title, subtitle or description"
            className={`${fieldClass} w-full`}
          />
        </div>
        <div>
          <label htmlFor="blog-status-filter" className="mb-1.5 block text-xs font-medium text-slate-600">
            Status
          </label>
          <select id="blog-status-filter" name="status" defaultValue={status} className={fieldClass}>
            <option value="">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <label htmlFor="blog-category-filter" className="mb-1.5 block text-xs font-medium text-slate-600">
            Category
          </label>
          <select id="blog-category-filter" name="category" defaultValue={category} className={fieldClass}>
            <option value="">All</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
        >
          Filter
        </button>
        {(query || status || category) ? (
          <Link href="/admin/blogs" className="px-2 py-2 text-xs font-medium text-slate-500 hover:text-navy-900">
            Clear
          </Link>
        ) : null}
      </form>

      <p className="mt-4 text-xs text-slate-500">
        {visibleBlogs.length} {visibleBlogs.length === 1 ? "blog" : "blogs"}
      </p>

      <div className="mt-3">
        {visibleBlogs.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Thumbnail</th>
                  <th scope="col" className="px-4 py-3 font-medium">Title</th>
                  <th scope="col" className="px-4 py-3 font-medium">Category</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium">Date</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td className="px-4 py-3">
                      {blog.cover_image_url ? (
                        <Image
                          src={blog.cover_image_url}
                          alt=""
                          width={64}
                          height={44}
                          unoptimized
                          className="h-11 w-16 rounded-md border border-slate-200 object-cover"
                        />
                      ) : (
                        <span className="flex h-11 w-16 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                          <ImageIcon aria-hidden="true" size={18} />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy-900">{blog.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">/blog/{blog.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{blog.categories?.name ?? "General"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          blog.status === "published"
                            ? "bg-success-light text-success-dark"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(blog.published_at ?? blog.updated_at)}
                    </td>
                    <td className="px-4 py-3">
                      <BlogRowActions
                        id={blog.id}
                        title={blog.title}
                        status={blog.status}
                        coverImageUrl={blog.cover_image_url}
                        content={blog.content}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No blogs found"
            description="Try different filters, or create a new blog to get started."
            href="/admin/blogs/new"
            label="New blog"
          />
        )}
      </div>
    </div>
  );
}
