import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CountUp } from "@/components/animations/count-up";
import { FlipCard } from "@/components/animations/flip-card";
import { PaymentMethodsStrip } from "@/components/animations/payment-methods-strip";
import { QRScan } from "@/components/animations/qr-scan";
import { SecurityShield } from "@/components/animations/security-shield";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { ArticleCard } from "@/components/article-card";
import { CategorySection } from "@/components/category-section";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { HeroFeatured } from "@/components/hero-featured";
import { SearchForm } from "@/components/search-form";
import { getCategories, getPublishedPosts } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const featured = posts.slice(0, 3);

  return (
    <>
      <HeroFeatured
        title="Understand every payment before you tap, swipe or send."
        description={`${siteConfig.name} breaks down cards, UPI, net banking, gateways and refunds into clear, practical guides. No jargon, no real account details, just the concepts you need.`}
        featuredPost={featured[0] ?? null}
        actions={
          <>
            <Link
              href="/posts"
              className="arrow-link inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
            >
              Browse articles
              <ArrowRight aria-hidden="true" size={16} className="arrow-icon" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore topics
            </Link>
            <div className="w-full max-w-md pt-2">
              <SearchForm />
            </div>
          </>
        }
      />

      <PaymentMethodsStrip />

      <section className="border-b border-slate-200 bg-navy-50/60">
        <Container className="grid gap-6 py-10 sm:grid-cols-3">
          <Reveal className="text-center">
            <p className="font-serif text-3xl font-semibold text-navy-900">
              <CountUp value={Math.max(categories.length, 1)} suffix="+" />
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-500">
              Topics explained
            </p>
          </Reveal>
          <Reveal className="text-center" delay={0.1}>
            <p className="font-serif text-3xl font-semibold text-navy-900">
              <CountUp value={Math.max(posts.length, 1)} suffix="+" />
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-500">
              Plain-language guides
            </p>
          </Reveal>
          <Reveal className="text-center" delay={0.2}>
            <p className="font-serif text-3xl font-semibold text-navy-900">
              <CountUp value={100} suffix="%" />
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-500">
              Fictional examples only
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Latest</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy-900">
                Featured explanations
              </h2>
            </div>
            <Link
              href="/posts"
              className="arrow-link inline-flex items-center gap-1 text-sm font-semibold text-brand-700"
            >
              See all articles
              <ArrowRight aria-hidden="true" size={15} className="arrow-icon" />
            </Link>
          </Reveal>

          <div className="mt-8">
            {featured.length > 0 ? (
              <Reveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((post) => (
                  <RevealItem key={post.id} className="h-full">
                    <ArticleCard post={post} />
                  </RevealItem>
                ))}
              </Reveal>
            ) : (
              <EmptyState
                title="No published articles yet"
                description="Sign in to /admin, publish a draft, and it will appear here. If Supabase is not configured yet, follow the README setup steps."
                href="/admin/login"
                label="Go to admin"
              />
            )}
          </div>
        </Container>
      </section>

      <section className="bg-navy-50/60 py-14 sm:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              Learn by example
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy-900">
              A card, a scan and a safe habit
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Hover the demo card to see both sides, then scan the patterned QR mockup. Every number
              and handle is invented for teaching, so you can explore freely.
            </p>
            <div className="mt-6 max-w-sm">
              <FlipCard />
            </div>
          </Reveal>
          <Reveal delay={0.12} className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <SecurityShield />
            <QRScan />
          </Reveal>
        </Container>
      </section>

      <CategorySection
        categories={categories}
        posts={posts}
        title="Start with a category"
        description="From the first tap to the final settlement, find the guide that matches your question."
      />
    </>
  );
}
