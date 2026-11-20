import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { SearchForm } from "@/components/search-form";
import { filterBlogsByCategorySlug, getCategories, getPublishedBlogs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Browse every PayLens guide about cards, UPI, wallets, gateways, net banking and payment safety.",
  alternates: { canonical: "/blog" },
};

const PAGE_SIZE = 6;

interface BlogPageProps {
  searchParams: Promise<{ category?: string | string[]; page?: string | string[] }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const categorySlug = typeof params.category === "string" ? params.category : "";
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
  const requestedPage = Number.parseInt(pageParam ?? "1", 10);
  const safePage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const [allBlogs, categories] = await Promise.all([getPublishedBlogs(), getCategories()]);
  const activeCategory = categories.find((category) => category.slug === categorySlug);
  const blogs = categorySlug ? filterBlogsByCategorySlug(allBlogs, categorySlug) : allBlogs;
  const totalPages = Math.max(1, Math.ceil(blogs.length / PAGE_SIZE));
  const page = Math.min(safePage, totalPages);
  const visibleBlogs = blogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Container className="py-10">
      <Breadcrumbs
        items={activeCategory ? [{ label: "Blog", href: "/blog" }, { label: activeCategory.name }] : [{ label: "Blog" }]}
      />

      <Reveal>
        <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-brand-700">Library</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-navy-900">
          {activeCategory ? activeCategory.name : "All articles"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          {activeCategory?.description ??
            "Practical, jargon-free explanations of how payments work and how to stay safe."}
        </p>
        <div className="mt-6">
          <SearchForm />
        </div>
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-2" aria-label="Filter by category">
        <Link
          href="/blog"
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
            categorySlug ? "bg-white text-slate-600 hover:bg-slate-100" : "bg-brand-600 text-white"
          }`}
        >
          All topics
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog?category=${category.slug}`}
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
        {visibleBlogs.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {blogs.length} {blogs.length === 1 ? "article" : "articles"}
            </p>
            <Reveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleBlogs.map((blog) => (
                <RevealItem key={blog.id} className="h-full">
                  <BlogCard blog={blog} />
                </RevealItem>
              ))}
            </Reveal>
            <Pagination page={page} totalPages={totalPages} basePath="/blog" query={{ category: categorySlug || undefined }} />
          </>
        ) : (
          <EmptyState
            title="Nothing found"
            description="Try another category, or browse the full article library."
            href="/blog"
            label="View all articles"
          />
        )}
      </div>

      <Reveal className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-navy-950 px-6 py-7 text-white">
        <div>
          <h2 className="font-serif text-xl font-semibold">Still have a payment question?</h2>
          <p className="mt-1 text-sm text-slate-300">Tell us what to explain next.</p>
        </div>
        <Link
          href="/contact-support"
          className="arrow-link inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold hover:bg-brand-500"
        >
          Contact Support+
          <ArrowRight aria-hidden="true" size={15} className="arrow-icon" />
        </Link>
      </Reveal>
    </Container>
  );
}
