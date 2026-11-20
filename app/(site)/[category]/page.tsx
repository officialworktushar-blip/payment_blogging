import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { filterBlogsByCategorySlug, getCategoryBySlug, getPublishedBlogs } from "@/lib/queries";

export const dynamic = "force-dynamic";

const PUBLIC_CATEGORY_SLUGS: ReadonlySet<string> = new Set([
  "payment-gateways",
  "upi-wallets",
  "cards",
  "net-banking",
  "payment-security",
]);

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  if (!PUBLIC_CATEGORY_SLUGS.has(slug)) {
    return { title: "Category not found", robots: { index: false, follow: false } };
  }

  const category = await getCategoryBySlug(slug);
  if (!category) {
    return { title: "Category not found", robots: { index: false, follow: false } };
  }

  return {
    title: category.name,
    description: category.description ?? `PayLens guides about ${category.name}.`,
    alternates: { canonical: `/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  if (!PUBLIC_CATEGORY_SLUGS.has(slug)) {
    notFound();
  }

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const blogs = filterBlogsByCategorySlug(await getPublishedBlogs(), category.slug);

  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: category.name }]} />

      <Reveal>
        <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-brand-700">Category</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-navy-900">
          {category.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          {category.description ?? "Guides and explainers in this topic."}
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
