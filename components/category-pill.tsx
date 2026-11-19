import Link from "next/link";
import type { CategorySummary } from "@/lib/types";

interface CategoryPillProps {
  category: CategorySummary | null;
}

export function CategoryPill({ category }: CategoryPillProps) {
  if (!category) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
        General
      </span>
    );
  }

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100"
    >
      {category.name}
    </Link>
  );
}
