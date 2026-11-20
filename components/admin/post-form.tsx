"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { CoverImageUpload } from "@/components/admin/cover-image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { savePost } from "@/lib/actions";
import type { BlogWithCategory, CategoryRow, PostStatus } from "@/lib/types";
import { makeSlug, stripHtml } from "@/lib/utils";

interface PostFormProps {
  categories: CategoryRow[];
  post: BlogWithCategory | null;
}

export function PostForm({ categories, post }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [subtitle, setSubtitle] = useState(post?.subtitle ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [description, setDescription] = useState(post?.description ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url ?? null);
  const [coverImageAlt, setCoverImageAlt] = useState(post?.cover_image_alt ?? "");
  const [coverImageNote, setCoverImageNote] = useState(post?.cover_image_note ?? "");
  const [categoryId, setCategoryId] = useState(post?.category_id ?? "");
  const [authorName, setAuthorName] = useState(post?.author_name ?? "PayLens Team");
  const [status, setStatus] = useState<PostStatus>(
    post?.status === "published" ? "published" : "draft",
  );
  const [isFeatured, setIsFeatured] = useState(post?.is_featured ?? false);
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

    if (!title.trim()) {
      setError("A heading is required.");
      setSaving(false);
      return;
    }

    if (!description.trim()) {
      setError("A short description is required.");
      setSaving(false);
      return;
    }

    if (!stripHtml(content).trim()) {
      setError("Article content is required.");
      setSaving(false);
      return;
    }

    const result = await savePost({
      id: post?.id,
      title,
      subtitle,
      slug,
      description,
      content,
      categoryId: categoryId || null,
      coverImageUrl,
      coverImageAlt,
      coverImageNote,
      authorName,
      status,
      isFeatured,
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
              Heading
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
            <label htmlFor="post-subtitle" className="mb-1.5 block text-sm font-medium text-slate-700">
              Sub Heading
            </label>
            <input
              id="post-subtitle"
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              className={fieldClass}
              placeholder="A plain-language walkthrough"
            />
          </div>

          <div>
            <label htmlFor="post-description" className="mb-1.5 block text-sm font-medium text-slate-700">
              Short Description
            </label>
            <textarea
              id="post-description"
              required
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={fieldClass}
              placeholder="Used as the excerpt and SEO description."
            />
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Article body</p>
            <RichTextEditor value={content} onChange={setContent} />
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
                  value={authorName}
                  onChange={(event) => setAuthorName(event.target.value)}
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

              <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(event) => setIsFeatured(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
                />
                Featured blog
              </label>
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

              <CoverImageUpload
                value={coverImageUrl}
                alt={coverImageAlt}
                note={coverImageNote}
                onChange={setCoverImageUrl}
                onAltChange={setCoverImageAlt}
                onNoteChange={setCoverImageNote}
                onUploadingChange={setUploading}
              />
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
