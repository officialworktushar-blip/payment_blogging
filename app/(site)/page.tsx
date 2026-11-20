import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CountUp } from "@/components/animations/count-up";
import { FlipCard } from "@/components/animations/flip-card";
import { PaymentMethodsStrip } from "@/components/animations/payment-methods-strip";
import { QRScan } from "@/components/animations/qr-scan";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { SecurityShield } from "@/components/animations/security-shield";
import { BlogCard } from "@/components/blog-card";
import { BlogCategorySection } from "@/components/blog-category-section";
import { BlogHeroFeatured } from "@/components/blog-hero-featured";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { NewsletterCta } from "@/components/newsletter-cta";
import { SearchForm } from "@/components/search-form";
import { categoryHref } from "@/lib/categories";
import { getCategories, getFeaturedBlogs, getPublishedBlogs } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [blogs, featured, categories] = await Promise.all([
    getPublishedBlogs(),
    getFeaturedBlogs(3),
    getCategories(),
  ]);
  const heroBlog = featured[0] ?? null;
  const latest = blogs.filter((blog) => blog.id !== heroBlog?.id).slice(0, 6);

  return (
    <>
      <BlogHeroFeatured
        title="Understand every payment before you tap, swipe or send."
        description={`${siteConfig.name} breaks down cards, UPI, net banking, gateways and refunds into clear, practical guides. No jargon, no real account details, just the concepts you need.`}
        featuredBlog={heroBlog}
        actions={
          <>
            <Link
              href="/blog"
              className="arrow-link inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
            >
              Browse articles
              <ArrowRight aria-hidden="true" size={16} className="arrow-icon" />
            </Link>
            <Link
              href="/blog"
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
              <CountUp value={Math.max(blogs.length, 1)} suffix="+" />
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
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Featured</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy-900">
                Start with this guide
              </h2>
            </div>
            <Link
              href="/blog"
              className="arrow-link inline-flex items-center gap-1 text-sm font-semibold text-brand-700"
            >
              See all articles
              <ArrowRight aria-hidden="true" size={15} className="arrow-icon" />
            </Link>
          </Reveal>

          <div className="mt-8">
            {heroBlog ? (
              <Reveal>
                <RevealItem>
                  <BlogCard blog={heroBlog} featured />
                </RevealItem>
              </Reveal>
            ) : (
              <EmptyState
                title="No published articles yet"
                description="Run the seed SQL, or sign in to /admin and publish a draft. It will appear here automatically."
                href="/admin/login"
                label="Go to admin"
              />
            )}
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <Container>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Latest</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy-900">
              Latest Articles
            </h2>
          </Reveal>
          {latest.length > 0 ? (
            <Reveal className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((blog) => (
                <RevealItem key={blog.id} className="h-full">
                  <BlogCard blog={blog} />
                </RevealItem>
              ))}
            </Reveal>
          ) : (
            <p className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
              More guides will appear here as they are published.
            </p>
          )}
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

      <section className="bg-navy-950 py-14 text-white sm:py-20">
        <Container className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
              Stay safe online
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
              Never share your OTP, PIN or CVV
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Keep payment checks on official screens, pause before urgent messages, and verify any
              unusual request with your bank or provider through a channel you already trust.
            </p>
            <Link
              href={categoryHref("payment-security")}
              className="arrow-link mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-200"
            >
              Read the safety guides
              <ArrowRight aria-hidden="true" size={15} className="arrow-icon" />
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto w-full max-w-xs">
            <SecurityShield />
          </Reveal>
        </Container>
      </section>

      <BlogCategorySection
        categories={categories}
        blogs={blogs}
        title="Start with a category"
        description="From the first tap to the final settlement, find the guide that matches your question."
      />

      <section className="pb-16">
        <Container>
          <Reveal className="rounded-2xl bg-gradient-to-br from-brand-700 to-navy-900 px-6 py-10 text-white sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Newsletter</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
              Get one clear payment guide each week
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-200">
              UI only for now. Add your email provider when you are ready to send updates.
            </p>
            <NewsletterCta />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
