import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/components/admin/blog-form";
import { getAdminBlogById, getBlogCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Blog",
  robots: { index: false, follow: false },
};

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string | string[] }>;
}

export default async function EditBlogPage({ params, searchParams }: EditBlogPageProps) {
  const { id } = await params;
  const { saved } = await searchParams;
  const savedParam = Array.isArray(saved) ? saved[0] : saved;
  const [blog, categories] = await Promise.all([getAdminBlogById(id), getBlogCategories()]);

  if (!blog) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-navy-900"
      >
        <ArrowLeft aria-hidden="true" size={15} />
        All Blogs
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-navy-900">Edit Blog</h1>
      <p className="mb-8 mt-2 text-sm text-slate-600">{blog.title}</p>

      <BlogForm categories={categories} blog={blog} justSaved={savedParam === "1"} />
    </div>
  );
}
