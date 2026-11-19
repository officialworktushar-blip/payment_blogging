import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { SearchForm } from "@/components/search-form";
import { filterPosts, getCategories, getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Browse every PayLens article about cards, UPI, gateways, net banking and payment safety.",
};

const PAGE_SIZE = 6;

interface PostsPageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const categorySlug = typeof params.category === "string" ? params.category : "";
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const safePage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const [allPosts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const posts = filterPosts(allPosts, { query, categorySlug });
  const activeCategory = categories.find((category) => category.slug === categorySlug);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const page = Math.min(safePage, totalPages);
  const visiblePosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Container className="py-10">
      <Breadcrumbs
        items={
          activeCategory
            ? [
                { label: "Blog", href: "/posts" },
                { label: activeCategory.name },
              ]
            : [{ label: "Blog" }]
        }
      />

      <Reveal>
        <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-brand-700">
          Library
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-navy-900">
          {activeCategory ? activeCategory.name : "All articles"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          {activeCategory?.description ??
            "Practical, jargon-free explanations of how payments work and how to stay safe."}
        </p>
        <div className="mt-6">
          <SearchForm initialQuery={query} categorySlug={categorySlug || undefined} />
        </div>
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-2" aria-label="Filter by category">
        <Link
          href="/posts"
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
            categorySlug
              ? "bg-white text-slate-600 hover:bg-slate-100"
              : "bg-brand-600 text-white"
          }`}
        >
          All topics
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              categorySlug === category.slug
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        {visiblePosts.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
              {query ? ` matching "${query}"` : ""}
            </p>
            <Reveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post) => (
                <RevealItem key={post.id} className="h-full">
                  <ArticleCard post={post} />
                </RevealItem>
              ))}
            </Reveal>
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/posts"
              query={{ q: query || undefined, category: categorySlug || undefined }}
            />
          </>
        ) : (
          <EmptyState
            title="Nothing found"
            description="Try a different search term, or clear the category filter to see every article."
            href="/posts"
            label="Clear filters"
          />
        )}
      </div>

      <Reveal className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-navy-950 px-6 py-7 text-white">
        <div>
          <h2 className="font-serif text-xl font-semibold">Still have a payment question?</h2>
          <p className="mt-1 text-sm text-slate-300">Tell us what to explain next.</p>
        </div>
        <Link
          href="/contact"
          className="arrow-link inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold hover:bg-brand-500"
        >
          Contact Support+
          <ArrowRight aria-hidden="true" size={15} className="arrow-icon" />
        </Link>
      </Reveal>
    </Container>
  );
}
