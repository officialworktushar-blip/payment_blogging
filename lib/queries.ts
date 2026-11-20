import { createClient } from "@/lib/supabase/server";
import type {
  BlogWithCategory,
  CategoryRow,
  CategorySummary,
  PostWithCategory,
  SupportRequest,
} from "@/lib/types";

function logQueryError(context: string, message: string): void {
  console.error(`${context}: ${message}`);
}

async function getSupabaseClient() {
  try {
    return await createClient();
  } catch (caught: unknown) {
    logQueryError("getSupabaseClient", caught instanceof Error ? caught.message : "Unknown error");
    return null;
  }
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
  const supabase = await getSupabaseClient();
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
  const supabase = await getSupabaseClient();
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
  const supabase = await getSupabaseClient();
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
  const supabase = await getSupabaseClient();
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
  const supabase = await getSupabaseClient();
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
  const supabase = await getSupabaseClient();
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
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return [];
  }

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
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return null;
  }

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
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return [];
  }

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
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return null;
  }

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

export function countBlogsByCategory(blogs: BlogWithCategory[], categoryId: string): number {
  return blogs.filter((blog) => blog.category_id === categoryId).length;
}

export async function getPublishedBlogs(): Promise<BlogWithCategory[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("*, categories(id, name, slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    logQueryError("getPublishedBlogs", error.message);
    return [];
  }

  return (data ?? []) as unknown as BlogWithCategory[];
}

export async function getFeaturedBlogs(limit = 3): Promise<BlogWithCategory[]> {
  const blogs = await getPublishedBlogs();
  const featured = blogs.filter((blog) => blog.is_featured);
  const rest = blogs.filter((blog) => !blog.is_featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getPublicBlogBySlug(slug: string): Promise<BlogWithCategory | null> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("*, categories(id, name, slug)")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logQueryError("getPublicBlogBySlug", error.message);
    return null;
  }

  return (data ?? null) as unknown as BlogWithCategory | null;
}

export function filterBlogsByCategorySlug(
  blogs: BlogWithCategory[],
  categorySlug: string,
): BlogWithCategory[] {
  return blogs.filter((blog) => blog.categories?.slug === categorySlug);
}

export async function searchBlogs(query: string): Promise<BlogWithCategory[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return [];
  }

  const safe = query
    .trim()
    .replace(/[%,()\\"]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 120);

  if (!safe) {
    return getPublishedBlogs();
  }

  const pattern = `%${safe}%`;
  const { data, error } = await supabase
    .from("blogs")
    .select("*, categories(id, name, slug)")
    .eq("status", "published")
    .or(`title.ilike."${pattern}",subtitle.ilike."${pattern}",description.ilike."${pattern}"`)
    .order("published_at", { ascending: false });

  if (error) {
    logQueryError("searchBlogs", error.message);
    return [];
  }

  return (data ?? []) as unknown as BlogWithCategory[];
}

export function getRelatedBlogs(
  blog: BlogWithCategory,
  blogs: BlogWithCategory[],
  limit = 3,
): BlogWithCategory[] {
  const sameCategory = blogs.filter(
    (candidate) => candidate.id !== blog.id && candidate.category_id === blog.category_id,
  );
  const others = blogs.filter(
    (candidate) => candidate.id !== blog.id && candidate.category_id !== blog.category_id,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getSupportRequests(): Promise<SupportRequest[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("support_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logQueryError("getSupportRequests", error.message);
    return [];
  }

  return (data ?? []) as SupportRequest[];
}
