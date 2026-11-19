import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { PostCard } from "@/components/post-card";
import { SearchForm } from "@/components/search-form";
import { getCategories, getFeaturedPosts } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, categories] = await Promise.all([getFeaturedPosts(3), getCategories()]);

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        <Container className="py-16 sm:py-20">
          <FadeIn className="max-w-3xl">
            <span className="inline-flex rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
              Payments, decoded
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Understand every payment before you tap, swipe or send.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {siteConfig.name} breaks down cards, UPI, wallets, gateways and refunds into clear,
              practical guides. No jargon, no real account details, just the concepts you need.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Browse articles
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link
                href="/categories"
                className="inline-flex rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Explore topics
              </Link>
            </div>
            <div className="mt-8">
              <SearchForm />
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <FadeIn className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Latest</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                Featured explanations
              </h2>
            </div>
            <Link href="/posts" className="text-sm font-medium text-brand-700 hover:underline">
              See all articles
            </Link>
          </FadeIn>

          <div className="mt-7">
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
                title="No published articles yet"
                description="Sign in to /admin, publish a draft, and it will appear here. If Supabase is not configured yet, follow the README setup steps."
                href="/admin/login"
                label="Go to admin"
              />
            )}
          </div>
        </Container>
      </section>

      <section className="py-6">
        <Container>
          <FadeIn className="rounded-2xl border border-brand-100 bg-brand-50/70 p-6 sm:p-8">
            <div className="flex flex-wrap items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700">
                <ShieldCheck aria-hidden="true" size={20} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">A quick safety reminder</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
                  No bank, payment app or support agent will ever ask for your OTP, CVV or password.
                  Every number and handle in our examples is fictional: think 4111 xxxx xxxx 1111
                  and user@example. Never paste real credentials into a demo form.
                </p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Topics</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Start with a category
            </h2>
          </FadeIn>

          <Stagger className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <StaggerItem key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="block h-full rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-200"
                  >
                    <h3 className="font-semibold text-slate-900">{category.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {category.description ?? "Guides and explainers in this topic."}
                    </p>
                    <span className="mt-4 inline-block text-xs font-semibold text-brand-700">
                      View articles
                    </span>
                  </Link>
                </StaggerItem>
              ))
            ) : (
              <StaggerItem className="sm:col-span-2 lg:col-span-4">
                <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                  Categories will appear once you run the Supabase migration and add a few in the
                  admin area.
                </p>
              </StaggerItem>
            )}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
