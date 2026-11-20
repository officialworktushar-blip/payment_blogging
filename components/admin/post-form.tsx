"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { CoverImageUpload } from "@/components/admin/cover-image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { savePost } from "@/lib/actions";
import type { CategoryRow, PostStatus, PostWithCategory } from "@/lib/types";
import { makeSlug } from "@/lib/utils";

interface PostFormProps {
  categories: CategoryRow[];
  post: PostWithCategory | null;
}

export function PostForm({ categories, post }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [categoryId, setCategoryId] = useState(post?.category_id ?? "");
  const [author, setAuthor] = useState(post?.author ?? "PayLens Team");
  const [status, setStatus] = useState<PostStatus>(post?.status === "published" ? "published" : "draft");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slugTouched) {
      return;
    }
    setSlug(title ? makeSlug(title) : "");
  }, [title, slugTouched]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const result = await savePost({
      id: post?.id,
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage.trim() || null,
      categoryId: categoryId || null,
      author,
      status,
    });

    if (!result.ok) {
      setError(result.error ?? "Could not save the article.");
      setSaving(false);
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  const fieldClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div>
            <label htmlFor="post-title" className="mb-1.5 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="post-title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={fieldClass}
              placeholder="How a card payment travels from tap to settlement"
            />
          </div>

          <div>
            <label htmlFor="post-content" className="mb-1.5 block text-sm font-medium text-slate-700">
              Article body
            </label>
            <div id="post-content">
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Publishing</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="post-status" className="mb-1.5 block text-xs font-medium text-slate-600">
                  Status
                </label>
                <select
                  id="post-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as PostStatus)}
                  className={fieldClass}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label htmlFor="post-author" className="mb-1.5 block text-xs font-medium text-slate-600">
                  Author
                </label>
                <input
                  id="post-author"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="post-category" className="mb-1.5 block text-xs font-medium text-slate-600">
                  Category
                </label>
                <select
                  id="post-category"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className={fieldClass}
                >
                  <option value="">General</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Details</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="post-slug" className="mb-1.5 block text-xs font-medium text-slate-600">
                  Slug
                </label>
                <input
                  id="post-slug"
                  required
                  value={slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    setSlug(event.target.value);
                  }}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="post-excerpt" className="mb-1.5 block text-xs font-medium text-slate-600">
                  Excerpt
                </label>
                <textarea
                  id="post-excerpt"
                  rows={4}
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  className={fieldClass}
                  placeholder="A short, plain-language summary."
                />
              </div>

              <div>
                <p className="mb-1.5 text-xs font-medium text-slate-600">Cover image</p>
                <CoverImageUpload
                  value={coverImage || null}
                  alt=""
                  note=""
                  onChange={(url) => setCoverImage(url ?? "")}
                  onAltChange={() => undefined}
                  onNoteChange={() => undefined}
                  onUploadingChange={setUploading}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save aria-hidden="true" size={16} />
          {saving ? "Saving..." : uploading ? "Uploading..." : post ? "Save changes" : "Create article"}
        </button>
      </div>
    </form>
  );
}
