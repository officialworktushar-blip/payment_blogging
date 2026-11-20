"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, BlogInput, PostStatus } from "@/lib/types";
import { makeSlug, sanitizeHtml, stripHtml } from "@/lib/utils";

type SupabaseServerClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

const MAX_SLUG_SUFFIX = 50;

function revalidateBlog(slug?: string): void {
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath("/admin");
  revalidatePath("/admin/blogs");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

function messageFrom(caught: unknown): string {
  return caught instanceof Error ? caught.message : "Unexpected error";
}

async function resolveUniqueSlug(
  supabase: SupabaseServerClient,
  desired: string,
  currentId?: string,
): Promise<string> {
  const base = makeSlug(desired);
  let candidate = base;

  for (let suffix = 2; suffix <= MAX_SLUG_SUFFIX + 1; suffix += 1) {
    const query = supabase.from("blogs").select("id").eq("slug", candidate);
    const { data, error } = await (currentId ? query.neq("id", currentId) : query).maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
  }

  throw new Error("Could not generate a unique slug.");
}

export async function saveBlog(input: BlogInput): Promise<ActionResult> {
  await requireUser();

  try {
    const supabase = await createClient();
    const title = input.title.trim();
    const description = input.description.trim();
    const content = sanitizeHtml(input.content);

    if (!title) {
      return { ok: false, error: "A heading is required." };
    }

    if (!description) {
      return { ok: false, error: "A short description is required." };
    }

    if (!stripHtml(content)) {
      return { ok: false, error: "Article content is required." };
    }

    const slug = await resolveUniqueSlug(supabase, input.slug.trim() || title, input.id);
    const now = new Date().toISOString();
    let publishedAt: string | null = input.status === "published" ? now : null;

    if (input.id) {
      const { data: existing, error: existingError } = await supabase
        .from("blogs")
        .select("published_at")
        .eq("id", input.id)
        .maybeSingle();

      if (existingError) {
        return { ok: false, error: existingError.message };
      }

      if (!existing) {
        return { ok: false, error: "Blog could not be found." };
      }

      if (input.status === "published") {
        publishedAt = existing.published_at ?? now;
      }
    }

    const payload = {
      title,
      subtitle: input.subtitle.trim() || null,
      slug,
      description,
      content,
      category_id: input.categoryId,
      cover_image_url: input.coverImageUrl,
      cover_image_alt: input.coverImageAlt.trim() || null,
      cover_image_note: input.coverImageNote.trim() || null,
      author_name: input.authorName.trim() || null,
      status: input.status,
      is_featured: input.isFeatured,
      published_at: publishedAt,
      updated_at: now,
    };

    if (input.id) {
      const { data, error } = await supabase
        .from("blogs")
        .update(payload)
        .eq("id", input.id)
        .select("id, slug")
        .single();

      if (error || !data) {
        return { ok: false, error: error?.message ?? "Blog could not be updated." };
      }

      revalidateBlog(data.slug);
      return { ok: true, id: data.id, slug: data.slug };
    }

    const { data, error } = await supabase
      .from("blogs")
      .insert(payload)
      .select("id, slug")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Blog could not be created." };
    }

    revalidateBlog(data.slug);
    return { ok: true, id: data.id, slug: data.slug };
  } catch (caught: unknown) {
    return { ok: false, error: messageFrom(caught) };
  }
}

export async function setBlogPublished(id: string, status: PostStatus): Promise<ActionResult> {
  await requireUser();

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    let publishedAt: string | null = status === "published" ? now : null;

    if (status === "published") {
      const { data: existing, error: existingError } = await supabase
        .from("blogs")
        .select("published_at")
        .eq("id", id)
        .maybeSingle();

      if (existingError) {
        return { ok: false, error: existingError.message };
      }

      if (!existing) {
        return { ok: false, error: "Blog could not be found." };
      }

      publishedAt = existing.published_at ?? now;
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({ status, published_at: publishedAt, updated_at: now })
      .eq("id", id)
      .select("id, slug")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Status could not be updated." };
    }

    revalidateBlog(data.slug);
    return { ok: true, id: data.id, slug: data.slug };
  } catch (caught: unknown) {
    return { ok: false, error: messageFrom(caught) };
  }
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  await requireUser();

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateBlog();
    return { ok: true };
  } catch (caught: unknown) {
    return { ok: false, error: messageFrom(caught) };
  }
}
