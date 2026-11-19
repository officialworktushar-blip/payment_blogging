import Link from "next/link";
import { ArrowRight, Coins, CreditCard, Landmark, ShieldCheck, Store, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { Container } from "@/components/container";
import { countPostsByCategory } from "@/lib/queries";
import type { CategoryRow, PostWithCategory } from "@/lib/types";

interface CategorySectionProps {
  categories: CategoryRow[];
  posts?: PostWithCategory[];
  title?: string;
  description?: string;
}

function iconForCategory(slug: string): LucideIcon {
  switch (slug) {
    case "cards":
      return CreditCard;
    case "upi-and-wallets":
      return Wallet;
    case "gateways":
      return Store;
    case "security":
      return ShieldCheck;
    case "net-banking":
      return Landmark;
    default:
      return Coins;
  }
}

export function CategorySection({
  categories,
  posts = [],
  title = "Start with a category",
  description = "Pick a topic and work through the guides at your own pace.",
}: CategorySectionProps) {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Topics</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy-900">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
        </Reveal>

        <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.length > 0 ? (
            categories.map((category) => {
              const Icon = iconForCategory(category.slug);
              const count = countPostsByCategory(posts, category.id);

              return (
                <RevealItem key={category.id} className="h-full">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="category-tile hover-lift group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <span className="category-tile-icon flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <h3 className="mt-5 font-serif text-lg font-semibold text-navy-900">
                      {category.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                      {category.description ?? "Guides and explainers in this topic."}
                    </p>
                    <div className="mt-5 flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-500">
                        {count} {count === 1 ? "article" : "articles"}
                      </span>
                      <span className="arrow-link inline-flex items-center gap-1 text-brand-700">
                        Explore
                        <ArrowRight aria-hidden="true" size={14} className="arrow-icon" />
                      </span>
                    </div>
                  </Link>
                </RevealItem>
              );
            })
          ) : (
            <RevealItem className="sm:col-span-2 lg:col-span-3">
              <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                Categories will appear once you run the Supabase migration and sign in to the admin
                area.
              </p>
            </RevealItem>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
