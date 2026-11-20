import Link from "next/link";
import { ArrowRight, Coins, CreditCard, Landmark, ShieldCheck, Store, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { BlogCard } from "@/components/blog-card";
import { Container } from "@/components/container";
import { countBlogsByCategory, filterBlogsByCategorySlug } from "@/lib/queries";
import type { BlogWithCategory, CategoryRow } from "@/lib/types";

interface BlogCategorySectionProps {
  categories: CategoryRow[];
  blogs: BlogWithCategory[];
  title?: string;
  description?: string;
}

function iconForCategory(slug: string): LucideIcon {
  switch (slug) {
    case "cards":
      return CreditCard;
    case "upi-wallets":
      return Wallet;
    case "payment-gateways":
      return Store;
    case "payment-security":
      return ShieldCheck;
    case "net-banking":
      return Landmark;
    default:
      return Coins;
  }
}

export function BlogCategorySection({
  categories,
  blogs,
  title = "Start with a category",
  description = "From the first tap to the final settlement, find the guide that matches your question.",
}: BlogCategorySectionProps) {
  return (
    <section className="bg-navy-50/60 py-14 sm:py-20">
      <Container>
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Topics</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy-900">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
        </Reveal>

        <div className="mt-10 space-y-14">
          {categories.length > 0 ? (
            categories.map((category) => {
              const Icon = iconForCategory(category.slug);
              const count = countBlogsByCategory(blogs, category.id);
              const latest = filterBlogsByCategorySlug(blogs, category.slug).slice(0, 4);

              return (
                <Reveal key={category.id} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                        <Icon aria-hidden="true" size={20} />
                      </span>
                      <div>
                        <h3 className="font-serif text-2xl font-semibold text-navy-900">
                          {category.name}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                          {category.description ?? "Guides and explainers in this topic."}
                        </p>
                        <p className="mt-2 text-xs font-medium text-slate-500">
                          {count} {count === 1 ? "article" : "articles"}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/${category.slug}`}
                      className="arrow-link inline-flex items-center gap-1 text-sm font-semibold text-brand-700"
                    >
                      View all
                      <ArrowRight aria-hidden="true" size={15} className="arrow-icon" />
                    </Link>
                  </div>

                  {latest.length > 0 ? (
                    <Reveal className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4" stagger={0.06}>
                      {latest.map((blog) => (
                        <RevealItem key={blog.id} className="h-full">
                          <BlogCard blog={blog} />
                        </RevealItem>
                      ))}
                    </Reveal>
                  ) : (
                    <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                      Articles for this topic will appear here once they are published.
                    </p>
                  )}
                </Reveal>
              );
            })
          ) : (
            <Reveal>
              <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                Categories will appear once the Supabase schema and seed SQL have been run.
              </p>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
