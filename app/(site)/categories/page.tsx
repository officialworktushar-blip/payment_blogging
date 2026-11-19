import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategorySection } from "@/components/category-section";
import { Container } from "@/components/container";
import { countPostsByCategory, getCategories, getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description: "Explore PayLens guides by payment topic.",
};

export default async function CategoriesPage() {
  const [categories, posts] = await Promise.all([getCategories(), getPublishedPosts()]);

  return (
    <>
      <Container className="pb-2 pt-10">
        <Breadcrumbs items={[{ label: "Categories" }]} />
      </Container>
      <CategorySection
        categories={categories}
        posts={posts}
        title="Browse by category"
        description="Pick a topic and work through the guides at your own pace."
      />
      <Container className="pb-4 text-center text-xs text-slate-500">
        {categories.length} topics &middot; {categories.reduce((total, category) => total + countPostsByCategory(posts, category.id), 0)} articles
      </Container>
    </>
  );
}
