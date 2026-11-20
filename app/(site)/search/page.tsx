import type { Metadata } from "next";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { SearchForm } from "@/components/search-form";
import { searchBlogs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search PayLens guides for plain-language payment explanations.",
  alternates: { canonical: "/search" },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const qParam = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = typeof qParam === "string" ? qParam.trim() : "";
  const blogs = query ? await searchBlogs(query) : [];

  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Search" }]} />

      <Reveal>
        <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-brand-700">Find a guide</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-navy-900">Search articles</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Search titles, subtitles and descriptions. Use general terms; never enter payment details.
        </p>
        <div className="mt-6">
          <SearchForm initialQuery={query} />
        </div>
      </Reveal>

      <div className="mt-8">
        {query ? (
          blogs.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-slate-500">
                {blogs.length} {blogs.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
              </p>
              <Reveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                  <RevealItem key={blog.id} className="h-full">
                    <BlogCard blog={blog} />
                  </RevealItem>
                ))}
              </Reveal>
            </>
          ) : (
            <EmptyState
              title="No matches"
              description="Try a broader word such as UPI, card, gateway, refund or security."
              href="/blog"
              label="Browse all articles"
            />
          )
        ) : (
          <EmptyState
            title="Start with a search term"
            description="Enter a topic above to find matching PayLens guides."
            href="/blog"
            label="Browse all articles"
          />
        )}
      </div>
    </Container>
  );
}
