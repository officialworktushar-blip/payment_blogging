import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/category-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { getAdminCategories, getAdminPosts, countPostsByCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage categories",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const [categories, posts] = await Promise.all([getAdminCategories(), getAdminPosts()]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Categories</h1>
      <p className="mt-2 text-sm text-slate-600">Organise articles by payment topic.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
          <h2 className="text-base font-semibold text-slate-900">Add a category</h2>
          <p className="mb-5 mt-1 text-xs leading-5 text-slate-500">
            The slug is generated from the name unless you type your own.
          </p>
          <CategoryForm />
        </div>

        <div className="space-y-4 lg:col-span-2">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">{category.name}</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      /{category.slug} &middot; {countPostsByCategory(posts, category.id)} articles
                    </p>
                  </div>
                  <DeleteButton id={category.id} kind="category" label={category.name} />
                </div>
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <CategoryForm category={category} />
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              No categories yet. Add one using the form.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
