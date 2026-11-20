"use server";

import { revalidatePath } from "next/cache";
import { deleteBlog, saveBlog } from "@/lib/blog-actions";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, BlogInput, Category, CategoryInput } from "@/lib/types";
import { makeSlug } from "@/lib/utils";

function revalidateContent(categorySlug?: string, blogSlug?: string): void {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/categories");

  if (categorySlug) {
    revalidatePath(`/${categorySlug}`);
  }

  if (blogSlug) {
    revalidatePath(`/blog/${blogSlug}`);
  }
}

function messageFrom(caught: unknown): string {
  return caught instanceof Error ? caught.message : "Unexpected error";
}

export async function savePost(input: BlogInput): Promise<ActionResult> {
  await requireUser();
  return saveBlog(input);
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireUser();
  return deleteBlog(id);
}

export async function saveCategory(input: CategoryInput): Promise<ActionResult> {
  await requireUser();

  try {
    const supabase = await createClient();
    const name = input.name.trim();

    if (!name) {
      return { ok: false, error: "A category name is required." };
    }

    const payload: Omit<Category, "id"> = {
      name,
      slug: makeSlug(input.slug.trim() || name),
      description: input.description?.trim() || null,
      sort_order: input.sort_order ?? 0,
    };

    if (input.id) {
      const { data, error } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", input.id)
        .select("id, slug")
        .single();
      const row = data as { id: string; slug: string } | null;

      if (error || !row) {
        return { ok: false, error: error?.message ?? "Category could not be updated." };
      }

      revalidateContent(row.slug);
      return { ok: true, id: row.id };
    }

    const { data, error } = await supabase
      .from("categories")
      .insert(payload)
      .select("id, slug")
      .single();
    const row = data as { id: string; slug: string } | null;

    if (error || !row) {
      return { ok: false, error: error?.message ?? "Category could not be created." };
    }

    revalidateContent(row.slug);
    return { ok: true, id: row.id };
  } catch (caught: unknown) {
    return { ok: false, error: messageFrom(caught) };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireUser();

  try {
    const supabase = await createClient();

    const { data: existing, error: existingError } = await supabase
      .from("categories")
      .select("slug")
      .eq("id", id)
      .maybeSingle();
    const existingRow = existing as { slug: string } | null;

    if (existingError) {
      return { ok: false, error: existingError.message };
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateContent(existingRow?.slug);
    return { ok: true };
  } catch (caught: unknown) {
    return { ok: false, error: messageFrom(caught) };
  }
}
