import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/animations/fade-in";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { PostCard } from "@/components/post-card";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { filterPosts, getCategoryBySlug, getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: category.name,
    description: category.description ?? `PayLens articles about ${category.name}.`,
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = filterPosts(await getPublishedPosts(), { categorySlug: category.slug });

  return (
    <Container className="py-12">
      <FadeIn>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Category</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          {category.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          {category.description ?? "Guides and explainers in this topic."}
        </p>
      </FadeIn>

      <div className="mt-9">
        {posts.length > 0 ? (
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <StaggerItem key={post.id} className="h-full">
                <PostCard post={post} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState
            title="No articles in this category yet"
            description="Check back soon, or browse the full article library in the meantime."
            href="/posts"
            label="Browse articles"
          />
        )}
      </div>
    </Container>
  );
}
