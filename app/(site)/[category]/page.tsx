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
} from "@/lib/queries";

export const dynamic = "force-dynamic";

const isDev = process.env.NODE_ENV === "development";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

function debugLog(
  slug: string,
  categoryError: string | null,
  blogError: string | null,
  rowCount: number,
): void {
  if (!isDev) {
    return;
  }

  console.log("[category-page]", { slug, categoryError, blogError, rowCount });
}

function QueryErrorState({ message }: { message: string }) {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Category" }]} />
      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-serif text-2xl font-semibold text-red-900">
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
  const { category } = await params;

  if (!isCategorySlug(category)) {
    return { title: "Category not found", robots: { index: false, follow: false } };
  }

  const { data: categoryRow, error } = await getCategoryBySlugResult(category);

  if (isDev) {
    console.log("[category-metadata]", {
      slug: category,
      error,
      rowCount: categoryRow ? 1 : 0,
    });
  }

  if (error) {
    console.error(`generateMetadata category ${category}: ${error}`);
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
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!isCategorySlug(category)) {
    notFound();
  }

  const { data: categoryRow, error: categoryError } = await getCategoryBySlugResult(category);

  if (categoryError) {
    console.error(`CategoryPage category ${category}: ${categoryError}`);
    debugLog(category, categoryError, null, 0);
    return <QueryErrorState message={categoryError} />;
  }

  if (!categoryRow) {
    debugLog(category, null, null, 0);
    notFound();
  }

  const { data: blogs, error: blogsError } = await getPublishedBlogsByCategoryIdResult(
    categoryRow.id,
  );

  if (blogsError) {
    console.error(`CategoryPage blogs ${category}: ${blogsError}`);
  }

  debugLog(category, categoryError, blogsError, blogs.length);

  if (blogsError) {
    return <QueryErrorState message={blogsError} />;
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
}
