import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { categoryHref, isCategorySlug } from "@/lib/categories";
import {
  getCategoryBySlugResult,
  getPublishedBlogsByCategoryIdResult,
  type QueryError,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

const isDev = process.env.NODE_ENV === "development";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

function logCategoryError(slug: string, error: QueryError): void {
  console.error("[category]", {
    step: error.step,
    slug,
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
}

function pageError(step: string, caught: unknown): QueryError {
  return {
    step,
    message: caught instanceof Error ? caught.message : "Unknown error",
    code: null,
    details: null,
    hint: null,
  };
}

function isNextControlError(caught: unknown): boolean {
  if (typeof caught !== "object" || caught === null || !("digest" in caught)) {
    return false;
  }

  const { digest } = caught as { digest?: unknown };
  return typeof digest === "string" && digest.startsWith("NEXT_HTTP_ERROR_FALLBACK");
}

function debugLog(
  slug: string,
  categoryError: QueryError | null,
  blogError: QueryError | null,
  rowCount: number,
): void {
  if (!isDev) {
    return;
  }

  console.log("[category-page]", {
    slug,
    categoryError,
    blogError,
    rowCount,
  });
}

function QueryErrorState({ message }: { message: string }) {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Category" }]} />
      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="mt-7 font-serif text-2xl font-semibold text-red-900">
          Could not load this category
        </h1>
        <p className="mt-2 text-sm leading-7 text-red-800">
          {isDev ? message : "There was a problem loading this page. Please try again later."}
        </p>
      </div>
    </Container>
  );
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  let slug = "unknown";

  try {
    const resolved = await params;
    slug = resolved.category;

    if (!isCategorySlug(slug)) {
      return { title: "Category not found", robots: { index: false, follow: false } };
    }

    const { data: categoryRow, error } = await getCategoryBySlugResult(slug);

    if (error) {
      logCategoryError(slug, error);
    }

    debugLog(slug, error, null, categoryRow ? 1 : 0);

    if (error) {
      return { title: "Category unavailable", robots: { index: false, follow: false } };
    }

    if (!categoryRow) {
      return { title: "Category not found", robots: { index: false, follow: false } };
    }

    return {
      title: categoryRow.name,
      description: categoryRow.description ?? `PayLens guides about ${categoryRow.name}.`,
      alternates: { canonical: categoryHref(categoryRow.slug) },
    };
  } catch (caught: unknown) {
    const error = pageError("category.metadata", caught);
    logCategoryError(slug, error);
    return { title: "Category unavailable", robots: { index: false, follow: false } };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  let slug = "unknown";

  try {
    const resolved = await params;
    slug = resolved.category;

    if (!isCategorySlug(slug)) {
      notFound();
    }

    const { data: categoryRow, error: categoryError } = await getCategoryBySlugResult(slug);

    if (categoryError) {
      logCategoryError(slug, categoryError);
      debugLog(slug, categoryError, null, 0);
      return <QueryErrorState message={categoryError.message} />;
    }

    if (!categoryRow) {
      debugLog(slug, null, null, 0);
      notFound();
    }

    const blogResult = await getPublishedBlogsByCategoryIdResult(categoryRow.id, slug);
    const blogs = blogResult.data;

    if (blogResult.error) {
      logCategoryError(slug, blogResult.error);
    }

    debugLog(slug, categoryError, blogResult.error, blogs.length);

    if (blogResult.error) {
      return <QueryErrorState message={blogResult.error.message} />;
    }

    return (
      <Container className="py-10">
        <Breadcrumbs items={[{ label: categoryRow.name }]} />

        <Reveal>
          <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-brand-700">Category</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-navy-900">
            {categoryRow.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            {categoryRow.description ?? "Guides and explainers in this topic."}
          </p>
        </Reveal>

        <div className="mt-9">
          {blogs.length > 0 ? (
            <Reveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <RevealItem key={blog.id} className="h-full">
                  <BlogCard blog={blog} />
                </RevealItem>
              ))}
            </Reveal>
          ) : (
            <EmptyState
              title="No articles in this category yet"
              description="Check back soon, or browse the full article library in the meantime."
              href="/blog"
              label="Browse articles"
            />
          )}
        </div>
      </Container>
    );
  } catch (caught: unknown) {
    if (isNextControlError(caught)) {
      throw caught;
    }

    const error = pageError("category.page", caught);
    logCategoryError(slug, error);
    return <QueryErrorState message={error.message} />;
  }
}
