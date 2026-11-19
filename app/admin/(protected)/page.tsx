import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Send, FileEdit, FolderTree } from "lucide-react";
import { getAdminCategories, getAdminPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin overview",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  const [posts, categories] = await Promise.all([getAdminPosts(), getAdminCategories()]);
  const published = posts.filter((post) => post.status === "published").length;
  const drafts = posts.filter((post) => post.status === "draft").length;

  const stats = [
    { label: "All articles", value: posts.length, icon: FileText, href: "/admin/posts" },
    { label: "Published", value: published, icon: Send, href: "/admin/posts" },
    { label: "Drafts", value: drafts, icon: FileEdit, href: "/admin/posts" },
    { label: "Categories", value: categories.length, icon: FolderTree, href: "/admin/categories" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Overview</h1>
      <p className="mt-2 text-sm text-slate-600">
        A quick look at your content. Publishing an article refreshes the public pages automatically.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand-200"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon aria-hidden="true" size={18} />
              </span>
              <p className="mt-4 text-2xl font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">Getting started</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
          <li>Run the SQL migration in supabase/migrations to create tables and seed content.</li>
          <li>Create an auth user in Supabase and sign in here.</li>
          <li>Add categories, then write an article with the rich text editor.</li>
          <li>Set the status to Published and check the public site.</li>
        </ol>
      </div>
    </div>
  );
}
