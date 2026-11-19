"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, CategoryInput, PostInput } from "@/lib/types";
import { makeExcerpt, makeSlug, sanitizeHtml } from "@/lib/utils";

function revalidateContent(slug?: string): void {
  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/categories");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/categories");

  if (slug) {
    revalidatePath(`/posts/${slug}`);
  }
}

function messageFrom(caught: unknown): string {
  return caught instanceof Error ? caught.message : "Unexpected error";
}

export async function savePost(input: PostInput): Promise<ActionResult> {
  await requireUser();

  try {
    const supabase = await createClient();

    if (!supabase) {
      return { ok: false, error: "Supabase is not configured." };
    }

    const title = input.title.trim();
    if (!title) {
      return { ok: false, error: "A title is required." };
    }

    const slug = makeSlug(input.slug.trim() || title);
    const content = sanitizeHtml(input.content);
    const excerpt = input.excerpt.trim() || makeExcerpt(content);
    const now = new Date().toISOString();
    let publishedAt: string | null = input.status === "published" ? now : null;

    if (input.id) {
      const { data: existing, error: existingError } = await supabase
        .from("posts")
        .select("published_at")
        .eq("id", input.id)
        .maybeSingle();

      if (existingError) {
        return { ok: false, error: existingError.message };
      }

      if (input.status === "published") {
        publishedAt = existing?.published_at ?? now;
      }
    }

    const payload = {
      title,
      slug,
      excerpt,
      content,
      cover_image: input.coverImage,
      category_id: input.categoryId,
      author: input.author.trim() || "PayLens Team",
      status: input.status,
      published_at: publishedAt,
      updated_at: now,
    };

    if (input.id) {
      const { data, error } = await supabase
        .from("posts")
        .update(payload)
        .eq("id", input.id)
        .select("id, slug")
        .single();

      if (error || !data) {
        return { ok: false, error: error?.message ?? "Post could not be updated." };
      }

      revalidateContent(data.slug);
      return { ok: true, id: data.id };
    }

    const { data, error } = await supabase
      .from("posts")
      .insert(payload)
      .select("id, slug")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Post could not be created." };
    }

    revalidateContent(data.slug);
    return { ok: true, id: data.id };
  } catch (caught: unknown) {
    return { ok: false, error: messageFrom(caught) };
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  await requireUser();

  try {
    const supabase = await createClient();

    if (!supabase) {
      return { ok: false, error: "Supabase is not configured." };
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateContent();
    return { ok: true };
  } catch (caught: unknown) {
    return { ok: false, error: messageFrom(caught) };
  }
}

export async function saveCategory(input: CategoryInput): Promise<ActionResult> {
  await requireUser();

  try {
    const supabase = await createClient();

    if (!supabase) {
      return { ok: false, error: "Supabase is not configured." };
    }

    const name = input.name.trim();
    if (!name) {
      return { ok: false, error: "A category name is required." };
    }

    const payload = {
      name,
      slug: makeSlug(input.slug.trim() || name),
      description: input.description?.trim() || null,
    };

    if (input.id) {
      const { data, error } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", input.id)
        .select("id")
        .single();

      if (error || !data) {
        return { ok: false, error: error?.message ?? "Category could not be updated." };
      }

      revalidateContent();
      return { ok: true, id: data.id };
    }

    const { data, error } = await supabase
      .from("categories")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Category could not be created." };
    }

    revalidateContent();
    return { ok: true, id: data.id };
  } catch (caught: unknown) {
    return { ok: false, error: messageFrom(caught) };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireUser();

  try {
    const supabase = await createClient();

    if (!supabase) {
      return { ok: false, error: "Supabase is not configured." };
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateContent();
    return { ok: true };
  } catch (caught: unknown) {
    return { ok: false, error: messageFrom(caught) };
  }
}
