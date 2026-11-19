import type { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { requireUser } from "@/lib/auth";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="hidden w-60 shrink-0 flex-col bg-navy-950 px-4 py-6 text-white lg:flex">
        <Link href="/admin" className="px-2 font-serif text-lg font-semibold">
          {siteConfig.name} <span className="text-brand-300">admin</span>
        </Link>
        <p className="mt-8 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Manage
        </p>
        <div className="mt-3">
          <AdminNav />
        </div>
        <p className="mt-auto px-2 pt-8 text-xs leading-5 text-slate-500">
          Content is for education only, not financial or legal advice.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div>
              <p className="text-sm font-semibold text-navy-900">{siteConfig.name} admin</p>
              <p className="text-xs text-slate-500">Signed in as {user.email ?? "admin"}</p>
            </div>
            <div className="flex items-center gap-2">
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
            </div>
          </div>
          <div className="border-t border-slate-100 px-4 py-2 sm:px-6 lg:hidden">
            <AdminNav variant="top" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
