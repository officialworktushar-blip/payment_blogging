import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { PostCard } from "@/components/post-card";
import { SearchForm } from "@/components/search-form";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { filterPosts, getCategories, getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles",
  description: "Browse every PayLens article about cards, UPI, gateways and payment safety.",
};

interface PostsPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const categorySlug = typeof params.category === "string" ? params.category : "";

  const [allPosts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const posts = filterPosts(allPosts, { query, categorySlug });
  const activeCategory = categories.find((category) => category.slug === categorySlug);

  return (
    <Container className="py-12">
      <FadeIn>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Library</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          {activeCategory ? activeCategory.name : "All articles"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          {activeCategory?.description ??
            "Practical, jargon-free explanations of how payments work and how to stay safe."}
        </p>
        <div className="mt-6">
          <SearchForm initialQuery={query} categorySlug={categorySlug || undefined} />
        </div>
      </FadeIn>

      <div className="mt-8 flex flex-wrap gap-2" aria-label="Filter by category">
        <Link
          href="/posts"
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
            categorySlug ? "bg-white text-slate-600 hover:bg-slate-100" : "bg-brand-600 text-white"
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
        {posts.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
              {query ? ` matching "${query}"` : ""}
            </p>
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <StaggerItem key={post.id} className="h-full">
                  <PostCard post={post} />
                </StaggerItem>
              ))}
            </Stagger>
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
    </Container>
  );
}
