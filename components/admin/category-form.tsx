"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { saveCategory } from "@/lib/actions";
import type { CategoryRow } from "@/lib/types";
import { makeSlug } from "@/lib/utils";

interface CategoryFormProps {
  category?: CategoryRow | null;
  onDone?: () => void;
}

export function CategoryForm({ category = null, onDone }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [description, setDescription] = useState(category?.description ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slugTouched) {
      return;
    }
    setSlug(name ? makeSlug(name) : "");
  }, [name, slugTouched]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const result = await saveCategory({
      id: category?.id,
      name,
      slug,
      description: description.trim() || null,
    });

    if (!result.ok) {
      setError(result.error ?? "Could not save the category.");
      setPending(false);
      return;
    }

    setName("");
    setSlug("");
    setDescription("");
    setSlugTouched(false);
    setPending(false);
    onDone?.();
    router.refresh();
  }

  const fieldClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor={`category-name-${category?.id ?? "new"}`} className="mb-1.5 block text-xs font-medium text-slate-600">
          Name
        </label>
        <input
          id={`category-name-${category?.id ?? "new"}`}
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={fieldClass}
          placeholder="Cards"
        />
      </div>

      <div>
        <label htmlFor={`category-slug-${category?.id ?? "new"}`} className="mb-1.5 block text-xs font-medium text-slate-600">
          Slug
        </label>
        <input
          id={`category-slug-${category?.id ?? "new"}`}
          required
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          className={fieldClass}
          placeholder="cards"
        />
      </div>

      <div>
        <label htmlFor={`category-description-${category?.id ?? "new"}`} className="mb-1.5 block text-xs font-medium text-slate-600">
          Description
        </label>
        <textarea
          id={`category-description-${category?.id ?? "new"}`}
          rows={2}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={fieldClass}
        />
      </div>

      {error ? <p role="alert" className="text-xs text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        <Plus aria-hidden="true" size={14} />
        {pending ? "Saving..." : category ? "Save category" : "Add category"}
      </button>
    </form>
  );
}
