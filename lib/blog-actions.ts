"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, Blog, BlogInput, PostStatus } from "@/lib/types";
import { makeSlug, sanitizeHtml, stripHtml } from "@/lib/utils";

type SupabaseServerClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

const MAX_SLUG_SUFFIX = 50;

function revalidateBlog(slug?: string, categorySlug?: string): void {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/blogs");

  if (categorySlug) {
    revalidatePath(`/${categorySlug}`);
  }

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

function messageFrom(caught: unknown): string {
  return caught instanceof Error ? caught.message : "Unexpected error";
}

async function categorySlugFor(
  supabase: SupabaseServerClient,
  categoryId: string | null,
): Promise<string | undefined> {
  if (!categoryId) {
    return undefined;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", categoryId)
    .maybeSingle();

  if (error) {
    console.error(`categorySlugFor: ${error.message}`);
    return undefined;
  }

  const row = data as { slug: string } | null;
  return row?.slug;
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
      const { data, error } = await supabase
        .from("blogs")
        .select("published_at")
        .eq("id", input.id)
        .maybeSingle();
      const existing = data as { published_at: string | null } | null;

      if (error) {
        return { ok: false, error: error.message };
      }

      if (!existing) {
        return { ok: false, error: "Blog could not be found." };
      }

      if (input.status === "published") {
        publishedAt = existing.published_at ?? now;
      }
    }

    const payload: Omit<Blog, "id" | "created_at"> = {
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

    const categorySlug = await categorySlugFor(supabase, payload.category_id);

    if (input.id) {
      const { data, error } = await supabase
        .from("blogs")
        .update(payload)
        .eq("id", input.id)
        .select("id, slug")
        .single();
      const row = data as { id: string; slug: string } | null;

      if (error || !row) {
        return { ok: false, error: error?.message ?? "Blog could not be updated." };
      }

      revalidateBlog(row.slug, categorySlug);
      return { ok: true, id: row.id, slug: row.slug };
    }

    const { data, error } = await supabase
      .from("blogs")
      .insert(payload)
      .select("id, slug")
      .single();
    const row = data as { id: string; slug: string } | null;

    if (error || !row) {
      return { ok: false, error: error?.message ?? "Blog could not be created." };
    }

    revalidateBlog(row.slug, categorySlug);
    return { ok: true, id: row.id, slug: row.slug };
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

    const { data: current, error: currentError } = await supabase
      .from("blogs")
      .select("published_at, category_id")
      .eq("id", id)
      .maybeSingle();
    const existing = current as { published_at: string | null; category_id: string | null } | null;

    if (currentError) {
      return { ok: false, error: currentError.message };
    }

    if (!existing) {
      return { ok: false, error: "Blog could not be found." };
    }

    if (status === "published") {
      publishedAt = existing.published_at ?? now;
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({ status, published_at: publishedAt, updated_at: now })
      .eq("id", id)
      .select("id, slug")
      .single();
    const row = data as { id: string; slug: string } | null;

    if (error || !row) {
      return { ok: false, error: error?.message ?? "Status could not be updated." };
    }

    revalidateBlog(row.slug, await categorySlugFor(supabase, existing.category_id));
    return { ok: true, id: row.id, slug: row.slug };
  } catch (caught: unknown) {
    return { ok: false, error: messageFrom(caught) };
  }
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  await requireUser();

  try {
    const supabase = await createClient();

    const { data: current, error: currentError } = await supabase
      .from("blogs")
      .select("category_id")
      .eq("id", id)
      .maybeSingle();
    const existing = current as { category_id: string | null } | null;

    if (currentError) {
      return { ok: false, error: currentError.message };
    }

    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateBlog(undefined, await categorySlugFor(supabase, existing?.category_id ?? null));
    return { ok: true };
  } catch (caught: unknown) {
    return { ok: false, error: messageFrom(caught) };
  }
}
