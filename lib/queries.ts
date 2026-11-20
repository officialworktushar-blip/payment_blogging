import { createClient } from "@/lib/supabase/server";
import type { BlogWithCategory, CategoryRow, CategorySummary, PostWithCategory } from "@/lib/types";

function logQueryError(context: string, message: string): void {
  console.error(`${context}: ${message}`);
}

export function filterPosts(
  posts: PostWithCategory[],
  options: { query?: string; categorySlug?: string } = {},
): PostWithCategory[] {
  const normalizedQuery = options.query?.trim().toLowerCase() ?? "";
  const categorySlug = options.categorySlug;

  return posts.filter((post) => {
    if (categorySlug && post.categories?.slug !== categorySlug) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = `${post.title} ${post.excerpt} ${post.categories?.name ?? ""}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export async function getPublishedPosts(): Promise<PostWithCategory[]> {
  const supabase = await createClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*, categories(id, name, slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    logQueryError("getPublishedPosts", error.message);
    return [];
  }

  return (data ?? []) as unknown as PostWithCategory[];
}

export async function getFeaturedPosts(limit = 3): Promise<PostWithCategory[]> {
  const posts = await getPublishedPosts();
  return posts.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<PostWithCategory | null> {
  const supabase = await createClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*, categories(id, name, slug)")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logQueryError("getPostBySlug", error.message);
    return null;
  }

  return (data ?? null) as unknown as PostWithCategory | null;
}

export async function getCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    logQueryError("getCategories", error.message);
    return [];
  }

  return (data ?? []) as CategoryRow[];
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  const supabase = await createClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logQueryError("getCategoryBySlug", error.message);
    return null;
  }

  return (data ?? null) as CategoryRow | null;
}

export async function getAdminPosts(): Promise<PostWithCategory[]> {
  const supabase = await createClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*, categories(id, name, slug)")
    .order("updated_at", { ascending: false });

  if (error) {
    logQueryError("getAdminPosts", error.message);
    return [];
  }

  return (data ?? []) as unknown as PostWithCategory[];
}

export async function getAdminPostById(id: string): Promise<PostWithCategory | null> {
  const supabase = await createClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*, categories(id, name, slug)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logQueryError("getAdminPostById", error.message);
    return null;
  }

  return (data ?? null) as unknown as PostWithCategory | null;
}

export async function getAdminCategories(): Promise<CategoryRow[]> {
  return getCategories();
}

export function countPostsByCategory(
  posts: PostWithCategory[],
  categoryId: string,
): number {
  return posts.filter((post) => post.category_id === categoryId).length;
}

export async function getAdminBlogs(): Promise<BlogWithCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*, categories(id, name, slug)")
    .order("updated_at", { ascending: false });

  if (error) {
    logQueryError("getAdminBlogs", error.message);
    return [];
  }

  return (data ?? []) as unknown as BlogWithCategory[];
}

export async function getAdminBlogById(id: string): Promise<BlogWithCategory | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*, categories(id, name, slug)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logQueryError("getAdminBlogById", error.message);
    return null;
  }

  return (data ?? null) as unknown as BlogWithCategory | null;
}

export async function getBlogCategories(): Promise<CategorySummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    logQueryError("getBlogCategories", error.message);
    return [];
  }

  return (data ?? []) as CategorySummary[];
}

export async function getBlogBySlug(slug: string): Promise<BlogWithCategory | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*, categories(id, name, slug)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logQueryError("getBlogBySlug", error.message);
    return null;
  }

  return (data ?? null) as unknown as BlogWithCategory | null;
}
