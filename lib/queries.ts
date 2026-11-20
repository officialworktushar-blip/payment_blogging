import { createClient } from "@/lib/supabase/server";
import type {
  BlogRow,
  BlogSummary,
  BlogWithCategory,
  CategoryPublic,
  CategoryRow,
  CategorySummary,
  SupportRequest,
} from "@/lib/types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface SupabaseErrorLike {
  message: string;
  code?: string | null;
  details?: string | null;
  hint?: string | null;
}

export interface QueryError {
  step: string;
  message: string;
  code: string | null;
  details: string | null;
  hint: string | null;
}

export interface QueryResult<T> {
  data: T;
  error: QueryError | null;
}

export interface BlogPageResult {
  data: BlogSummary[];
  total: number;
  page: number;
  perPage: number;
  error: QueryError | null;
}

interface BlogPageOptions {
  label: string;
  slug: string;
  step: string;
  page: number;
  perPage: number;
  categoryId?: string;
  includeCount?: boolean;
}

const BLOG_SUMMARY_COLUMNS =
  "id, title, subtitle, slug, description, cover_image_url, cover_image_alt, cover_image_note, author_name, published_at, is_featured, category_id";
const BLOG_FULL_COLUMNS =
  "id, title, subtitle, slug, description, content, category_id, cover_image_url, cover_image_alt, cover_image_note, author_name, status, is_featured, published_at, created_at, updated_at";
const CATEGORY_COLUMNS = "id, name, slug, description, sort_order";
const CATEGORY_PUBLIC_COLUMNS = "id, name, slug, description";
const CATEGORY_SUMMARY_COLUMNS = "id, name, slug";
const SUPPORT_REQUEST_COLUMNS = "id, name, email, topic, message, status, created_at, updated_at";

function fromSupabaseError(step: string, error: SupabaseErrorLike): QueryError {
  return {
    step,
    message: error.message,
    code: error.code ?? null,
    details: error.details ?? null,
    hint: error.hint ?? null,
  };
}

function fromCaught(step: string, caught: unknown): QueryError {
  return {
    step,
    message: caught instanceof Error ? caught.message : "Unknown error",
    code: null,
    details: null,
    hint: null,
  };
}

function logQueryError(label: string, slug: string, error: QueryError): void {
  console.error(label, {
    step: error.step,
    slug,
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
}

async function getSupabaseClient(
  step: string,
  label: string,
  slug: string,
): Promise<{ client: SupabaseClient | null; error: QueryError | null }> {
  try {
    return { client: await createClient(), error: null };
  } catch (caught: unknown) {
    const error = fromCaught(step, caught);
    logQueryError(label, slug, error);
    return { client: null, error };
  }
}

function attachCategories<T extends { category_id: string | null }>(
  rows: T[],
  categories: CategorySummary[],
): (T & { categories: CategorySummary | null })[] {
  const byId = new Map(categories.map((category) => [category.id, category]));

  return rows.map((row) => ({
    ...row,
    categories: row.category_id ? byId.get(row.category_id) ?? null : null,
  }));
}

function normalizePagination(page: number, perPage: number) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePerPage = Math.max(1, Number(perPage) || 6);
  const from = (safePage - 1) * safePerPage;
  const to = from + safePerPage - 1;
  return { page: safePage, perPage: safePerPage, from, to };
}

async function getCategorySummaries(
  label: string,
  slug: string,
): Promise<QueryResult<CategorySummary[]>> {
  const step = "categories.select";
  const { client, error: clientError } = await getSupabaseClient(step, label, slug);
  if (!client) {
    return { data: [], error: clientError };
  }

  try {
    const { data, error } = await client
      .from("categories")
      .select(CATEGORY_SUMMARY_COLUMNS)
      .order("name", { ascending: true });

    if (error) {
      const queryError = fromSupabaseError(step, error);
      logQueryError(label, slug, queryError);
      return { data: [], error: queryError };
    }

    return { data: (data ?? []) as CategorySummary[], error: null };
  } catch (caught: unknown) {
    const queryError = fromCaught(step, caught);
    logQueryError(label, slug, queryError);
    return { data: [], error: queryError };
  }
}

export async function getPublishedBlogsPageResult({
  label,
  slug,
  step,
  page,
  perPage,
  categoryId,
  includeCount = true,
}: BlogPageOptions): Promise<BlogPageResult> {
  const pagination = normalizePagination(page, perPage);
  const { client, error: clientError } = await getSupabaseClient(
    `${step}.client`,
    label,
    slug,
  );
  if (!client) {
    return {
      data: [],
      total: 0,
      page: pagination.page,
      perPage: pagination.perPage,
      error: clientError,
    };
  }

  try {
    let blogsQuery = client
      .from("blogs")
      .select(BLOG_SUMMARY_COLUMNS)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range(pagination.from, pagination.to);

    let countQuery = includeCount
      ? client
          .from("blogs")
          .select("id", { count: "exact", head: true })
          .eq("status", "published")
      : null;

    if (categoryId) {
      blogsQuery = blogsQuery.eq("category_id", categoryId);
      if (countQuery) {
        countQuery = countQuery.eq("category_id", categoryId);
      }
    }

    const [blogsResponse, categoriesResult, countResponse] = await Promise.all([
      blogsQuery,
      getCategorySummaries(label, slug),
      countQuery,
    ]);

    if (blogsResponse.error) {
      const queryError = fromSupabaseError(`${step}.select`, blogsResponse.error);
      logQueryError(label, slug, queryError);
      return {
        data: [],
        total: 0,
        page: pagination.page,
        perPage: pagination.perPage,
        error: queryError,
      };
    }

    if (countResponse?.error) {
      const queryError = fromSupabaseError(`${step}.count`, countResponse.error);
      logQueryError(label, slug, queryError);
      return {
        data: [],
        total: 0,
        page: pagination.page,
        perPage: pagination.perPage,
        error: queryError,
      };
    }

    if (categoriesResult.error) {
      return {
        data: [],
        total: 0,
        page: pagination.page,
        perPage: pagination.perPage,
        error: categoriesResult.error,
      };
    }

    const summaries = attachCategories(
      (blogsResponse.data ?? []) as Omit<BlogSummary, "categories">[],
      categoriesResult.data,
    ) as BlogSummary[];

    return {
      data: summaries,
      total: countResponse?.count ?? 0,
      page: pagination.page,
      perPage: pagination.perPage,
      error: null,
    };
  } catch (caught: unknown) {
    const queryError = fromCaught(step, caught);
    logQueryError(label, slug, queryError);
    return {
      data: [],
      total: 0,
      page: pagination.page,
      perPage: pagination.perPage,
      error: queryError,
    };
  }
}

export async function getCategoryBySlugResult(
  slug: string,
): Promise<QueryResult<CategoryPublic | null>> {
  const label = "[category]";
  const step = "category.select";
  const { client, error: clientError } = await getSupabaseClient(`${step}.client`, label, slug);
  if (!client) {
    return { data: null, error: clientError };
  }

  try {
    const { data, error } = await client
      .from("categories")
      .select(CATEGORY_PUBLIC_COLUMNS)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      const queryError = fromSupabaseError(step, error);
      logQueryError(label, slug, queryError);
      return { data: null, error: queryError };
    }

    return { data: (data ?? null) as CategoryPublic | null, error: null };
  } catch (caught: unknown) {
    const queryError = fromCaught(step, caught);
    logQueryError(label, slug, queryError);
    return { data: null, error: queryError };
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryPublic | null> {
  const { data } = await getCategoryBySlugResult(slug);
  return data;
}

export async function getPublishedBlogsByCategoryIdResult(
  categoryId: string,
  slug: string,
  page = 1,
  perPage = 1000,
): Promise<BlogPageResult> {
  return getPublishedBlogsPageResult({
    label: "[category]",
    slug,
    step: "category.blogs",
    page,
    perPage,
    categoryId,
    includeCount: false,
  });
}

export async function getBlogsByCategory(
  categoryId: string,
  slug: string,
  page = 1,
  perPage = 1000,
): Promise<BlogPageResult> {
  return getPublishedBlogsByCategoryIdResult(categoryId, slug, page, perPage);
}

export async function getPublishedBlogsResult(
  label = "[blog]",
  slug = "all",
  page = 1,
  perPage = 1000,
  categoryId?: string,
  includeCount = true,
): Promise<BlogPageResult> {
  return getPublishedBlogsPageResult({
    label,
    slug,
    step: "blogs.published",
    page,
    perPage,
    categoryId,
    includeCount,
  });
}

export async function getPublishedBlogs(): Promise<BlogSummary[]> {
  const { data } = await getPublishedBlogsResult("[queries]", "all", 1, 1000, undefined, false);
  return data;
}

export async function getCategoriesResult(
  label = "[queries]",
  slug = "all",
): Promise<QueryResult<CategoryRow[]>> {
  const step = "categories.list";
  const { client, error: clientError } = await getSupabaseClient(`${step}.client`, label, slug);
  if (!client) {
    return { data: [], error: clientError };
  }

  try {
    const { data, error } = await client
      .from("categories")
      .select(CATEGORY_COLUMNS)
      .order("name", { ascending: true });

    if (error) {
      const queryError = fromSupabaseError(step, error);
      logQueryError(label, slug, queryError);
      return { data: [], error: queryError };
    }

    return { data: (data ?? []) as CategoryRow[], error: null };
  } catch (caught: unknown) {
    const queryError = fromCaught(step, caught);
    logQueryError(label, slug, queryError);
    return { data: [], error: queryError };
  }
}

export async function getCategories(): Promise<CategoryRow[]> {
  const { data } = await getCategoriesResult();
  return data;
}

export async function getBlogCategories(): Promise<CategorySummary[]> {
  const { data } = await getCategorySummaries("[admin]", "all");
  return data;
}

export async function getPublicBlogBySlugResult(
  slug: string,
): Promise<QueryResult<BlogWithCategory | null>> {
  const label = "[blog]";
  const step = "blog.article";
  const { client, error: clientError } = await getSupabaseClient(`${step}.client`, label, slug);
  if (!client) {
    return { data: null, error: clientError };
  }

  try {
    const [{ data, error }, categoriesResult] = await Promise.all([
      client
        .from("blogs")
        .select(BLOG_FULL_COLUMNS)
        .eq("status", "published")
        .eq("slug", slug)
        .maybeSingle(),
      getCategorySummaries(label, slug),
    ]);

    if (error) {
      const queryError = fromSupabaseError(`${step}.select`, error);
      logQueryError(label, slug, queryError);
      return { data: null, error: queryError };
    }

    if (categoriesResult.error) {
      return { data: null, error: categoriesResult.error };
    }

    const row = data as BlogRow | null;
    if (!row) {
      return { data: null, error: null };
    }

    const [withCategory] = attachCategories([row], categoriesResult.data);
    return { data: withCategory as BlogWithCategory, error: null };
  } catch (caught: unknown) {
    const queryError = fromCaught(step, caught);
    logQueryError(label, slug, queryError);
    return { data: null, error: queryError };
  }
}

export async function getPublicBlogBySlug(slug: string): Promise<BlogWithCategory | null> {
  const { data } = await getPublicBlogBySlugResult(slug);
  return data;
}

export async function getAdminBlogs(): Promise<BlogWithCategory[]> {
  const label = "[admin]";
  const step = "admin.blogs";
  const { client, error: clientError } = await getSupabaseClient(`${step}.client`, label, "all");
  if (!client) {
    return [];
  }

  try {
    const [{ data, error }, categoriesResult] = await Promise.all([
      client
        .from("blogs")
        .select(BLOG_FULL_COLUMNS)
        .order("updated_at", { ascending: false })
        .range(0, 999),
      getCategorySummaries(label, "all"),
    ]);

    if (error) {
      logQueryError(label, "all", fromSupabaseError(`${step}.select`, error));
      return [];
    }

    if (categoriesResult.error) {
      return [];
    }

    return attachCategories(
      (data ?? []) as BlogRow[],
      categoriesResult.data,
    ) as BlogWithCategory[];
  } catch (caught: unknown) {
    logQueryError(label, "all", fromCaught(step, caught));
    return [];
  }
}

export async function getAdminBlogById(id: string): Promise<BlogWithCategory | null> {
  const label = "[admin]";
  const step = "admin.blog";
  const { client, error: clientError } = await getSupabaseClient(`${step}.client`, label, id);
  if (!client) {
    void clientError;
    return null;
  }

  try {
    const [{ data, error }, categoriesResult] = await Promise.all([
      client.from("blogs").select(BLOG_FULL_COLUMNS).eq("id", id).maybeSingle(),
      getCategorySummaries(label, id),
    ]);

    if (error) {
      logQueryError(label, id, fromSupabaseError(`${step}.select`, error));
      return null;
    }

    if (categoriesResult.error) {
      return null;
    }

    const row = data as BlogRow | null;
    if (!row) {
      return null;
    }

    const [withCategory] = attachCategories([row], categoriesResult.data);
    return withCategory as BlogWithCategory;
  } catch (caught: unknown) {
    logQueryError(label, id, fromCaught(step, caught));
    return null;
  }
}

export async function searchBlogs(query: string): Promise<BlogSummary[]> {
  const label = "[blog]";
  const step = "blog.search";
  const { client, error: clientError } = await getSupabaseClient(`${step}.client`, label, query);
  if (!client) {
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

  try {
    const pattern = `%${safe}%`;
    const [{ data, error }, categoriesResult] = await Promise.all([
      client
        .from("blogs")
        .select(BLOG_SUMMARY_COLUMNS)
        .eq("status", "published")
        .or(`title.ilike."${pattern}",subtitle.ilike."${pattern}",description.ilike."${pattern}"`)
        .order("published_at", { ascending: false })
        .range(0, 999),
      getCategorySummaries(label, query),
    ]);

    if (error) {
      logQueryError(label, query, fromSupabaseError(`${step}.select`, error));
      return [];
    }

    if (categoriesResult.error) {
      return [];
    }

    return attachCategories(
      (data ?? []) as Omit<BlogSummary, "categories">[],
      categoriesResult.data,
    ) as BlogSummary[];
  } catch (caught: unknown) {
    logQueryError(label, query, fromCaught(step, caught));
    return [];
  }
}

export async function getSupportRequests(): Promise<SupportRequest[]> {
  const label = "[admin]";
  const step = "admin.support";
  const { client, error: clientError } = await getSupabaseClient(`${step}.client`, label, "support");
  if (!client) {
    void clientError;
    return [];
  }

  try {
    const { data, error } = await client
      .from("support_requests")
      .select(SUPPORT_REQUEST_COLUMNS)
      .order("created_at", { ascending: false });

    if (error) {
      logQueryError(label, "support", fromSupabaseError(`${step}.select`, error));
      return [];
    }

    return (data ?? []) as SupportRequest[];
  } catch (caught: unknown) {
    logQueryError(label, "support", fromCaught(step, caught));
    return [];
  }
}

export function filterPosts(
  blogs: BlogSummary[],
  options: { query?: string; categorySlug?: string } = {},
): BlogSummary[] {
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

export function filterBlogsByCategorySlug(
  blogs: BlogSummary[],
  categorySlug: string,
): BlogSummary[] {
  return blogs.filter((blog) => blog.categories?.slug === categorySlug);
}

export function countBlogsByCategory(blogs: BlogSummary[], categoryId: string): number {
  return blogs.filter((blog) => blog.category_id === categoryId).length;
}

export function countPostsByCategory(blogs: BlogSummary[], categoryId: string): number {
  return countBlogsByCategory(blogs, categoryId);
}

export function getRelatedBlogs(
  blog: BlogSummary,
  blogs: BlogSummary[],
  limit = 3,
): BlogSummary[] {
  const sameCategory = blogs.filter(
    (candidate) => candidate.id !== blog.id && candidate.category_id === blog.category_id,
  );
  const others = blogs.filter(
    (candidate) => candidate.id !== blog.id && candidate.category_id !== blog.category_id,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getPublishedPosts(): Promise<BlogSummary[]> {
  return getPublishedBlogs();
}

export async function getFeaturedPosts(limit = 3): Promise<BlogSummary[]> {
  return getFeaturedBlogs(limit);
}

export async function getPostBySlug(slug: string): Promise<BlogWithCategory | null> {
  return getPublicBlogBySlug(slug);
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

export async function getFeaturedBlogs(limit = 3): Promise<BlogSummary[]> {
  const blogs = await getPublishedBlogs();
  const featured = blogs.filter((blog) => blog.is_featured);
  const rest = blogs.filter((blog) => !blog.is_featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getBlogBySlug(slug: string): Promise<BlogWithCategory | null> {
  return getPublicBlogBySlug(slug);
}
