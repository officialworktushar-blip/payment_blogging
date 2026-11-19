import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock3 } from "lucide-react";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryPill } from "@/components/category-pill";
import { Container } from "@/components/container";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { getPostBySlug, getPublishedPosts } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";
import { formatDate, makeExcerpt, readingMinutes, sanitizeHtml } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article not found",
      robots: { index: false, follow: false },
    };
  }

  const description = post.excerpt || makeExcerpt(post.content);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/posts/${post.slug}`,
      siteName: siteConfig.name,
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPublishedPosts();
  const related = allPosts
    .filter((candidate) => candidate.id !== post.id && candidate.category_id === post.category_id)
    .slice(0, 3);

  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/posts" },
          ...(post.categories
            ? [{ label: post.categories.name, href: `/categories/${post.categories.slug}` }]
            : []),
          { label: post.title },
        ]}
      />

      <Reveal>
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <CategoryPill category={post.categories} />
            <span>{formatDate(post.published_at)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 aria-hidden="true" size={13} />
              {readingMinutes(post.content)} min read
            </span>
          </div>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight tracking-tight text-navy-900 sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{post.excerpt}</p>
          <p className="mt-4 text-sm font-medium text-slate-500">By {post.author}</p>
        </div>
      </Reveal>

      <Reveal className="relative mt-10 h-64 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-96">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1152px"
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder label="Article hero image — 1600×900 payments illustration" />
        )}
      </Reveal>

      <Reveal className="mx-auto mt-10 max-w-3xl">
        <article
          className="article-content rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />
      </Reveal>

      <Reveal className="mx-auto mt-8 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Content is for education only, not financial or legal advice. Never share your OTP, PIN or
        CVV with anyone.
      </Reveal>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-navy-900">
            Keep reading
          </h2>
          <Reveal className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <RevealItem key={item.id} className="h-full">
                <ArticleCard post={item} />
              </RevealItem>
            ))}
          </Reveal>
        </section>
      ) : null}
    </Container>
  );
}
