import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/post-form";
import { getAdminCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New article",
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <Link href="/admin/posts" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft aria-hidden="true" size={15} />
        Articles
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">New article</h1>
      <p className="mb-8 mt-2 text-sm text-slate-600">
        Use fictional identifiers only, for example 4111 xxxx xxxx 1111 and user@example.
      </p>

      <PostForm categories={categories} post={null} />
    </div>
  );
}
