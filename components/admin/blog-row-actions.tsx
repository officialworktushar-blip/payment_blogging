"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Pencil, RotateCcw, Send, Trash2 } from "lucide-react";
import { deleteBlog, setBlogPublished } from "@/lib/blog-actions";
import { Toast } from "@/components/admin/toast";
import type { PostStatus } from "@/lib/types";
import { deleteImageUrl, extractImageUrls } from "@/lib/uploadImage";

interface BlogRowActionsProps {
  id: string;
  title: string;
  status: string;
  coverImageUrl: string | null;
  content: string;
}

export function BlogRowActions({ id, title, status, coverImageUrl, content }: BlogRowActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" }>({
    message: "",
    tone: "success",
  });

  const dismissToast = useCallback(() => {
    setToast((current) => ({ ...current, message: "" }));
  }, []);

  async function handleStatus(nextStatus: PostStatus) {
    setPending(true);
    const result = await setBlogPublished(id, nextStatus);
    setPending(false);

    if (!result.ok) {
      setToast({ message: result.error ?? "Status could not be updated.", tone: "error" });
      return;
    }

    setToast({
      message: nextStatus === "published" ? "Blog published." : "Blog moved to drafts.",
      tone: "success",
    });
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${title}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setPending(true);
    const result = await deleteBlog(id);

    if (!result.ok) {
      setPending(false);
      setToast({ message: result.error ?? "Delete failed.", tone: "error" });
      return;
    }

    const imageUrls = [coverImageUrl, ...extractImageUrls(content)].filter(
      (url): url is string => typeof url === "string",
    );

    await Promise.all(
      imageUrls.map(async (url) => {
        try {
          await deleteImageUrl(url);
        } catch {
          return;
        }
      }),
    );

    setPending(false);
    setToast({ message: "Blog deleted.", tone: "success" });
    router.refresh();
  }

  const published = status === "published";

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Link
          href={`/admin/blogs/${id}/edit`}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Pencil aria-hidden="true" size={13} />
          Edit
        </Link>
        <button
          type="button"
          disabled={pending}
          onClick={() => void handleStatus(published ? "draft" : "published")}
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium disabled:opacity-50 ${
            published
              ? "border-amber-200 text-amber-700 hover:bg-amber-50"
              : "border-success/30 text-success-dark hover:bg-success-light"
          }`}
        >
          {published ? (
            <RotateCcw aria-hidden="true" size={13} />
          ) : (
            <Send aria-hidden="true" size={13} />
          )}
          {published ? "Unpublish" : "Publish"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => void handleDelete()}
          aria-label={`Delete ${title}`}
          className="inline-flex items-center gap-1 rounded-md border border-error/30 bg-white px-2 py-1 text-xs font-medium text-error-dark hover:bg-error-light disabled:opacity-50"
        >
          <Trash2 aria-hidden="true" size={13} />
          Delete
        </button>
      </div>
      <Toast message={toast.message} tone={toast.tone} onDismiss={dismissToast} />
    </>
  );
}
