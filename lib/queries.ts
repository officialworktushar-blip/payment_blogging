import { createClient } from "@/lib/supabase/server";
import type {
  BlogRow,
  BlogWithCategory,
  CategoryPublic,
  CategoryRow,
  CategorySummary,
  SupportRequest,
} from "@/lib/types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export interface QueryError {
  message: string;
  code: string | null;
  details: string | null;
  hint: string | null;
}

interface QueryResult<T> {
  data: T;
  error: QueryError | null;
}

interface QueryErrorLike {
  message: string;
  code?: string | null;
  details?: string | null;
  hint?: string | null;
}

interface BlogQueryOptions {
  label: string;
  slug: string;
  blogId?: string;
  blogSlug?: string;
  categoryId?: string;
  publishedOnly?: boolean;
  orderBy?: "published_at" | "updated_at";
}

const BLOG_COLUMNS =
  "id, title, subtitle, slug, description, content, category_id, cover_image_url, cover_image_alt, cover_image_note, author_name, status, is_featured, published_at, created_at, updated_at";
const CATEGORY_COLUMNS = "id, name, slug, description, sort_order";
const CATEGORY_PUBLIC_COLUMNS = "id, name, slug, description";
const CATEGORY_SUMMARY_COLUMNS = "id, name, slug";
const SUPPORT_REQUEST_COLUMNS = "id, name, email, topic, message, status, created_at, updated_at";

function toQueryError(error: QueryErrorLike): QueryError {
  return {
    message: error.message,
    code: error.code ?? null,
    details: error.details ?? null,
    hint: error.hint ?? null,
  };
}

function clientQueryError(message: string): QueryError {
  return { message, code: null, details: null, hint: null };
}

function logFullError(label: string, slug: string, error: QueryError): void {
  console.error(label, {
    slug,
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
}

async function getSupabaseClientResult(): Promise<QueryResult<SupabaseClient | null>> {
  try {
    return { data: await createClient(), error: null };
  } catch (caught: unknown) {
    const error = clientQueryError(caught instanceof Error ? caught.message : "Unknown error");
    logFullError("[supabase]", "client", error);
    return { data: null, error };
  }
}

function attachCategories(
  blogs: BlogRow[],
  categories: CategorySummary[],
): BlogWithCategory[] {
  const byId = new Map(categories.map((category) => [category.id, category]));

  return blogs.map((blog) => ({
    ...blog,
    categories: blog.category_id ? byId.get(blog.category_id) ?? null : null,
  }));
}

async function getCategorySummariesResult(
  supabase: SupabaseClient,
  label: string,
  slug: string,
): Promise<QueryResult<CategorySummary[]>> {
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_SUMMARY_COLUMNS)
    .order("name", { ascending: true });

  if (error) {
    const queryError = toQueryError(error);
    logFullError(label, slug, queryError);
    return { data: [], error: queryError };
  }

  return { data: (data ?? []) as CategorySummary[], error: null };
}

async function getBlogsWithCategoriesResult(
  options: BlogQueryOptions,
): Promise<QueryResult<BlogWithCategory[]>> {
  const { data: supabase, error: clientError } = await getSupabaseClientResult();
  if (!supabase) {
    return { data: [], error: clientError };
  }

  let query = supabase.from("blogs").select(BLOG_COLUMNS);

  if (options.publishedOnly) {
    query = query.eq("status", "published");
  }

  if (options.blogId) {
    query = query.eq("id", options.blogId);
  }

  if (options.blogSlug) {
    query = query.eq("slug", options.blogSlug);
  }

  if (options.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }

  const { data, error } = await query.order(options.orderBy ?? "published_at", {
    ascending: false,
  });

  if (error) {
    const queryError = toQueryError(error);
    logFullError(options.label, options.slug, queryError);
    return { data: [], error: queryError };
  }

  const categoriesResult = await getCategorySummariesResult(
    supabase,
    options.label,
    options.slug,
  );
  if (categoriesResult.error) {
    return { data: [], error: categoriesResult.error };
  }

  return {
    data: attachCategories((data ?? []) as BlogRow[], categoriesResult.data),
    error: null,
  };
}

async function getBlogWithCategoriesResult(
  options: BlogQueryOptions,
): Promise<QueryResult<BlogWithCategory | null>> {
  const result = await getBlogsWithCategoriesResult(options);
  return { data: result.data[0] ?? null, error: result.error };
}

export function filterPosts(
  blogs: BlogWithCategory[],
  options: { query?: string; categorySlug?: string } = {},
): BlogWithCategory[] {
  const normalizedQuery = options.query?.trim().toLowerCase() ?? "";
  const categorySlug = options.categorySlug;

  return blogs.filter((blog) => {
    if (categorySlug && blog.categories?.slug !== categorySlug) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack =
      `${blog.title} ${blog.subtitle ?? ""} ${blog.description ?? ""} ${blog.categories?.name ?? ""}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export async function getPublishedPosts(): Promise<BlogWithCategory[]> {
  return getPublishedBlogs();
}

export async function getFeaturedPosts(limit = 3): Promise<BlogWithCategory[]> {
  return getFeaturedBlogs(limit);
}

export async function getPostBySlug(slug: string): Promise<BlogWithCategory | null> {
  return getPublicBlogBySlug(slug);
}

export async function getCategoriesResult(
  label = "[queries]",
  slug = "all",
): Promise<QueryResult<CategoryRow[]>> {
  const { data: supabase, error: clientError } = await getSupabaseClientResult();
  if (!supabase) {
    return { data: [], error: clientError };
  }

  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .order("name", { ascending: true });

  if (error) {
    const queryError = toQueryError(error);
    logFullError(label, slug, queryError);
    return { data: [], error: queryError };
  }

  return { data: (data ?? []) as CategoryRow[], error: null };
}

export async function getCategories(): Promise<CategoryRow[]> {
  const { data } = await getCategoriesResult();
  return data;
}

export async function getCategoryBySlugResult(
  slug: string,
): Promise<QueryResult<CategoryPublic | null>> {
  const { data: supabase, error: clientError } = await getSupabaseClientResult();
  if (!supabase) {
    return { data: null, error: clientError };
  }

  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_PUBLIC_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    const queryError = toQueryError(error);
    logFullError("[category]", slug, queryError);
    return { data: null, error: queryError };
  }

  return { data: (data ?? null) as CategoryPublic | null, error: null };
}

export async function getCategoryBySlug(slug: string): Promise<CategoryPublic | null> {
  const { data } = await getCategoryBySlugResult(slug);
  return data;
}

export async function getAdminPosts(): Promise<BlogWithCategory[]> {
  return getAdminBlogs();
}

export async function getAdminPostById(id: string): Promise<BlogWithCategory | null> {
  return getAdminBlogById(id);
}

export async function getAdminCategories(): Promise<CategoryRow[]> {
  return getCategories();
}

export function countPostsByCategory(
  blogs: BlogWithCategory[],
  categoryId: string,
): number {
  return countBlogsByCategory(blogs, categoryId);
}

export async function getAdminBlogs(): Promise<BlogWithCategory[]> {
  const { data } = await getBlogsWithCategoriesResult({
    label: "[admin]",
    slug: "all",
    orderBy: "updated_at",
  });
  return data;
}

export async function getAdminBlogById(id: string): Promise<BlogWithCategory | null> {
  const { data } = await getBlogWithCategoriesResult({
    label: "[admin]",
    slug: id,
    blogId: id,
    orderBy: "updated_at",
  });
  return data;
}

export async function getBlogCategories(): Promise<CategorySummary[]> {
  const { data: supabase, error: clientError } = await getSupabaseClientResult();
  if (!supabase) {
    void clientError;
    return [];
  }

  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_SUMMARY_COLUMNS)
    .order("name", { ascending: true });

  if (error) {
    logFullError("[admin]", "all", toQueryError(error));
    return [];
  }

  return (data ?? []) as CategorySummary[];
}

export async function getBlogBySlug(slug: string): Promise<BlogWithCategory | null> {
  return getPublicBlogBySlug(slug);
}

export function countBlogsByCategory(blogs: BlogWithCategory[], categoryId: string): number {
  return blogs.filter((blog) => blog.category_id === categoryId).length;
}

export async function getPublishedBlogsResult(
  label = "[queries]",
  slug = "all",
): Promise<QueryResult<BlogWithCategory[]>> {
  return getBlogsWithCategoriesResult({
    label,
    slug,
    publishedOnly: true,
    orderBy: "published_at",
  });
}

export async function getPublishedBlogs(): Promise<BlogWithCategory[]> {
  const { data } = await getPublishedBlogsResult();
  return data;
}

export async function getPublishedBlogsByCategoryIdResult(
  categoryId: string,
  slug: string,
): Promise<QueryResult<BlogWithCategory[]>> {
  return getBlogsWithCategoriesResult({
    label: "[category]",
    slug,
    categoryId,
    publishedOnly: true,
    orderBy: "published_at",
  });
}

export async function getFeaturedBlogs(limit = 3): Promise<BlogWithCategory[]> {
  const blogs = await getPublishedBlogs();
  const featured = blogs.filter((blog) => blog.is_featured);
  const rest = blogs.filter((blog) => !blog.is_featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getPublicBlogBySlugResult(
  slug: string,
): Promise<QueryResult<BlogWithCategory | null>> {
  return getBlogWithCategoriesResult({
    label: "[blog]",
    slug,
    blogSlug: slug,
    publishedOnly: true,
    orderBy: "published_at",
  });
}

export async function getPublicBlogBySlug(slug: string): Promise<BlogWithCategory | null> {
  const { data } = await getPublicBlogBySlugResult(slug);
  return data;
}

export function filterBlogsByCategorySlug(
  blogs: BlogWithCategory[],
  categorySlug: string,
): BlogWithCategory[] {
  return blogs.filter((blog) => blog.categories?.slug === categorySlug);
}

export async function searchBlogs(query: string): Promise<BlogWithCategory[]> {
  const { data: supabase, error: clientError } = await getSupabaseClientResult();
  if (!supabase) {
    void clientError;
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
    .select(BLOG_COLUMNS)
    .eq("status", "published")
    .or(`title.ilike."${pattern}",subtitle.ilike."${pattern}",description.ilike."${pattern}"`)
    .order("published_at", { ascending: false });

  if (error) {
    logFullError("[blog]", query, toQueryError(error));
    return [];
  }

  const categoriesResult = await getCategorySummariesResult(supabase, "[blog]", query);
  if (categoriesResult.error) {
    return [];
  }

  return attachCategories((data ?? []) as BlogRow[], categoriesResult.data);
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
  const { data: supabase, error: clientError } = await getSupabaseClientResult();
  if (!supabase) {
    void clientError;
    return [];
  }

  const { data, error } = await supabase
    .from("support_requests")
    .select(SUPPORT_REQUEST_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    logFullError("[admin]", "support", toQueryError(error));
    return [];
  }

  return (data ?? []) as SupportRequest[];
}
