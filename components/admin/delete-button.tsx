"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteCategory, deletePost } from "@/lib/actions";

interface DeleteButtonProps {
  id: string;
  kind: "post" | "category";
  label: string;
}

export function DeleteButton({ id, kind, label }: DeleteButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${label}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setPending(true);
    setError("");

    const result = kind === "post" ? await deletePost(id) : await deleteCategory(id);

    if (!result.ok) {
      setError(result.error ?? "Delete failed.");
      setPending(false);
      return;
    }

    setPending(false);
    router.refresh();
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        aria-label={`Delete ${label}`}
        className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        <Trash2 aria-hidden="true" size={13} />
        {pending ? "Deleting..." : "Delete"}
      </button>
      {error ? <span className="max-w-40 text-right text-[11px] text-red-600">{error}</span> : null}
    </span>
  );
}
