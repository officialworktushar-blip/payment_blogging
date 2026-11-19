import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ScanLine } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

interface AdminLoginPageProps {
  searchParams: Promise<{ notice?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const needsSetup = params.notice === "setup";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 self-start text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft aria-hidden="true" size={15} />
        Back to site
      </Link>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-card">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
          <ScanLine aria-hidden="true" size={20} />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
          {siteConfig.name} admin
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with a Supabase Auth account to manage articles and categories.
        </p>

        {needsSetup ? (
          <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
            Supabase environment variables are missing. Copy .env.example to .env.local, add your
            project values, then reload this page.
          </p>
        ) : null}

        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
