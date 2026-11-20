import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/components/admin/blog-form";
import { getBlogCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Blog",
  robots: { index: false, follow: false },
};

export default async function NewBlogPage() {
  const categories = await getBlogCategories();

  return (
    <div>
      <Link
        href="/admin/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-navy-900"
      >
        <ArrowLeft aria-hidden="true" size={15} />
        All Blogs
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-navy-900">New Blog</h1>
      <p className="mb-8 mt-2 text-sm text-slate-600">
        Use fictional identifiers only, for example 4111 xxxx xxxx 1111 and user@example.
      </p>

      <BlogForm categories={categories} blog={null} />
    </div>
  );
}
