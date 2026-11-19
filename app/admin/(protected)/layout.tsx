import type { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, FolderTree, FileText, Plus, ExternalLink } from "lucide-react";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { requireUser } from "@/lib/auth";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Articles", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
];

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await requireUser();

  return (
    <div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/admin" className="text-sm font-semibold text-slate-900">
            {siteConfig.name} <span className="font-normal text-slate-400">/ admin</span>
          </Link>

          <nav aria-label="Admin" className="flex flex-wrap items-center gap-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  <Icon aria-hidden="true" size={14} />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
            >
              <Plus aria-hidden="true" size={14} />
              New article
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              <ExternalLink aria-hidden="true" size={14} />
              View site
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-9 sm:px-6 lg:px-8">
        <p className="mb-6 text-xs text-slate-500">Signed in as {user.email ?? "admin"}</p>
        {children}
      </main>
    </div>
  );
}
