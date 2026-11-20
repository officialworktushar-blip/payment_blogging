import type { Metadata } from "next";
import Link from "next/link";
import { FileEdit, FileText, FolderTree, Send } from "lucide-react";
import { getAdminBlogs, getBlogCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin overview",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  const [blogs, categories] = await Promise.all([getAdminBlogs(), getBlogCategories()]);
  const published = blogs.filter((blog) => blog.status === "published").length;
  const drafts = blogs.filter((blog) => blog.status === "draft").length;

  const stats = [
    { label: "Total blogs", value: blogs.length, icon: FileText, href: "/admin/blogs" },
    { label: "Published", value: published, icon: Send, href: "/admin/blogs?status=published" },
    { label: "Drafts", value: drafts, icon: FileEdit, href: "/admin/blogs?status=draft" },
    { label: "Categories", value: categories.length, icon: FolderTree, href: "/admin/categories" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold tracking-tight text-navy-900">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        A quick look at your blogs. Publishing refreshes the public pages automatically.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="hover-lift rounded-xl border border-slate-200 bg-white p-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon aria-hidden="true" size={18} />
              </span>
              <p className="mt-4 text-2xl font-semibold text-navy-900">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-serif text-lg font-semibold text-navy-900">Blogs per category</h2>
        {categories.length > 0 ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {categories.map((category) => {
              const count = blogs.filter((blog) => blog.category_id === category.id).length;
              return (
                <li key={category.id} className="flex items-center justify-between py-3 text-sm">
                  <Link
                    href={`/admin/blogs?category=${category.id}`}
                    className="font-medium text-slate-700 hover:text-brand-700"
                  >
                    {category.name}
                  </Link>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
