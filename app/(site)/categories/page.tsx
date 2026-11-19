import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { countPostsByCategory, getCategories, getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description: "Explore PayLens guides by payment topic.",
};

export default async function CategoriesPage() {
  const [categories, posts] = await Promise.all([getCategories(), getPublishedPosts()]);

  return (
    <Container className="py-12">
      <FadeIn>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Topics</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Browse by category
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Pick a topic to see the guides that explain it in plain language.
        </p>
      </FadeIn>

      <div className="mt-9">
        {categories.length > 0 ? (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = countPostsByCategory(posts, category.id);
              return (
                <StaggerItem key={category.id} className="h-full">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:border-brand-200"
                  >
                    <h2 className="text-lg font-semibold text-slate-900">{category.name}</h2>
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                      {category.description ?? "Guides and explainers in this topic."}
                    </p>
                    <div className="mt-5 flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-500">
                        {count} {count === 1 ? "article" : "articles"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-brand-700">
                        Explore
                        <ArrowRight aria-hidden="true" size={14} />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        ) : (
          <EmptyState
            title="No categories yet"
            description="Add categories in the admin area after running the Supabase migration."
          />
        )}
      </div>
    </Container>
  );
}
