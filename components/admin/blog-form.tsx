"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { CoverImageUpload } from "@/components/admin/cover-image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Toast } from "@/components/admin/toast";
import { saveBlog } from "@/lib/blog-actions";
import type { BlogWithCategory, CategorySummary, PostStatus } from "@/lib/types";
import { extractImageUrls, deleteImageUrl } from "@/lib/uploadImage";
import { makeSlug, stripHtml } from "@/lib/utils";

interface BlogFormProps {
  categories: CategorySummary[];
  blog: BlogWithCategory | null;
  justSaved?: boolean;
}

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export function BlogForm({ categories, blog, justSaved = false }: BlogFormProps) {
  const router = useRouter();
  const [currentId, setCurrentId] = useState(blog?.id);
  const [title, setTitle] = useState(blog?.title ?? "");
  const [subtitle, setSubtitle] = useState(blog?.subtitle ?? "");
  const [slug, setSlug] = useState(blog?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(blog));
  const [description, setDescription] = useState(blog?.description ?? "");
  const [content, setContent] = useState(blog?.content ?? "");
  const [categoryId, setCategoryId] = useState(blog?.category_id ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(blog?.cover_image_url ?? null);
  const [coverImageAlt, setCoverImageAlt] = useState(blog?.cover_image_alt ?? "");
  const [coverImageNote, setCoverImageNote] = useState(blog?.cover_image_note ?? "");
  const [authorName, setAuthorName] = useState(blog?.author_name ?? "PayLens Team");
  const [status, setStatus] = useState<PostStatus>(
    blog?.status === "published" ? "published" : "draft",
  );
  const [isFeatured, setIsFeatured] = useState(blog?.is_featured ?? false);
  const [saving, setSaving] = useState(false);
  const [uploadingSources, setUploadingSources] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" }>({
    message: justSaved ? "Blog saved successfully." : "",
    tone: "success",
  });

  const uploading = uploadingSources.length > 0;
  const previewSlug = makeSlug(slug || title || "your-blog");

  useEffect(() => {
    if (!slugTouched) {
      setSlug(title ? makeSlug(title) : "");
    }
  }, [title, slugTouched]);

  const setUploading = useCallback((source: string, value: boolean) => {
    setUploadingSources((current) => {
      const hasSource = current.includes(source);

      if (value) {
        return hasSource ? current : [...current, source];
      }

      return hasSource ? current.filter((item) => item !== source) : current;
    });
  }, []);

  const setEditorUploading = useCallback(
    (value: boolean) => setUploading("editor", value),
    [setUploading],
  );

  const setCoverUploading = useCallback(
    (value: boolean) => setUploading("cover", value),
    [setUploading],
  );

  const dismissToast = useCallback(() => {
    setToast((current) => ({ ...current, message: "" }));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setToast({ message: "A heading is required.", tone: "error" });
      return;
    }

    if (!description.trim()) {
      setToast({ message: "A short description is required.", tone: "error" });
      return;
    }

    if (!stripHtml(content).trim()) {
      setToast({ message: "Article content is required.", tone: "error" });
      return;
    }

    setSaving(true);
    const wasNew = !currentId;

    const result = await saveBlog({
      id: currentId,
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
      setToast({ message: result.error ?? "Could not save the blog.", tone: "error" });
      setSaving(false);
      return;
    }

    const nextContentImages = extractImageUrls(content);
    const removedImages = extractImageUrls(blog?.content ?? "").filter(
      (url) => !nextContentImages.includes(url),
    );

    await Promise.all(
      removedImages.map(async (url) => {
        try {
          await deleteImageUrl(url);
        } catch {
          return;
        }
      }),
    );

    if (result.id) {
      setCurrentId(result.id);
    }
    if (result.slug) {
      setSlug(result.slug);
    }

    setToast({ message: "Blog saved successfully.", tone: "success" });
    setSaving(false);

    if (wasNew && result.id) {
      router.push(`/admin/blogs/${result.id}/edit?saved=1`);
      return;
    }

    router.refresh();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div>
              <label htmlFor="blog-title" className="mb-1.5 block text-sm font-medium text-slate-700">
                Heading <span className="text-error-dark">*</span>
              </label>
              <input
                id="blog-title"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={fieldClass}
                placeholder="How a UPI payment reaches a merchant"
              />
            </div>

            <div>
              <label htmlFor="blog-subtitle" className="mb-1.5 block text-sm font-medium text-slate-700">
                Sub Heading <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                id="blog-subtitle"
                value={subtitle}
                onChange={(event) => setSubtitle(event.target.value)}
                className={fieldClass}
                placeholder="A plain-language walkthrough"
              />
            </div>

            <div>
              <label htmlFor="blog-description" className="mb-1.5 block text-sm font-medium text-slate-700">
                Short Description <span className="text-error-dark">*</span>
              </label>
              <textarea
                id="blog-description"
                required
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className={fieldClass}
                placeholder="Used as the excerpt and SEO description."
              />
            </div>

            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">Content</p>
              <RichTextEditor
                value={content}
                onChange={setContent}
                onUploadingChange={setEditorUploading}
              />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-navy-900">Publishing</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="blog-status" className="mb-1.5 block text-xs font-medium text-slate-600">
                    Status
                  </label>
                  <select
                    id="blog-status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value as PostStatus)}
                    className={fieldClass}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="blog-author" className="mb-1.5 block text-xs font-medium text-slate-600">
                    Author
                  </label>
                  <input
                    id="blog-author"
                    value={authorName}
                    onChange={(event) => setAuthorName(event.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="blog-category" className="mb-1.5 block text-xs font-medium text-slate-600">
                    Category
                  </label>
                  <select
                    id="blog-category"
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

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-navy-900">URL</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="blog-slug" className="mb-1.5 block text-xs font-medium text-slate-600">
                    Slug
                  </label>
                  <input
                    id="blog-slug"
                    required
                    value={slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      setSlug(event.target.value);
                    }}
                    className={fieldClass}
                  />
                </div>
                <p className="break-all rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-brand-700">
                  /blog/{previewSlug}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-navy-900">Cover image</h2>
              <div className="mt-4">
                <CoverImageUpload
                  value={coverImageUrl}
                  alt={coverImageAlt}
                  note={coverImageNote}
                  onChange={setCoverImageUrl}
                  onAltChange={setCoverImageAlt}
                  onNoteChange={setCoverImageNote}
                  onUploadingChange={setCoverUploading}
                />
              </div>
            </div>
          </aside>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save aria-hidden="true" size={16} />
            {saving ? "Saving..." : uploading ? "Uploading..." : currentId ? "Save changes" : "Create blog"}
          </button>
          {uploading ? <span className="text-xs text-slate-500">Wait for uploads to finish.</span> : null}
        </div>
      </form>

      <Toast message={toast.message} tone={toast.tone} onDismiss={dismissToast} />
    </>
  );
}
