import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/post-form";
import { getAdminCategories, getAdminPostById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit article",
  robots: { index: false, follow: false },
};

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getAdminPostById(id), getAdminCategories()]);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/posts" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft aria-hidden="true" size={15} />
        Articles
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Edit article</h1>
      <p className="mb-8 mt-2 text-sm text-slate-600">{post.title}</p>

      <PostForm categories={categories} post={post} />
    </div>
  );
}
