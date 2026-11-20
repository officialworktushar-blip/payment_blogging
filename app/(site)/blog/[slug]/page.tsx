import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock3 } from "lucide-react";
import { ReadingProgress } from "@/components/animations/reading-progress";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryPill } from "@/components/category-pill";
import { Container } from "@/components/container";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { ShareBar } from "@/components/share-bar";
import { categoryHref } from "@/lib/categories";
import {
  getPublicBlogBySlugResult,
  getPublishedBlogs,
  getRelatedBlogs,
} from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";
import { formatDate, makeExcerpt, readingMinutes, sanitizeHtml } from "@/lib/utils";

export const dynamic = "force-dynamic";

const isDev = process.env.NODE_ENV === "development";

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

function debugLog(slug: string, error: string | null, rowCount: number): void {
  if (!isDev) {
    return;
  }

  console.log("[blog-article-page]", { slug, error, rowCount });
}

function QueryErrorState({ message }: { message: string }) {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: "Article unavailable" }]} />
      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-serif text-2xl font-semibold text-red-900">Could not load this article</h1>
        <p className="mt-2 text-sm leading-7 text-red-800">
          {isDev ? message : "There was a problem loading this page. Please try again later."}
        </p>
      </div>
    </Container>
  );
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: blog, error } = await getPublicBlogBySlugResult(slug);

  debugLog(slug, error, blog ? 1 : 0);

  if (error) {
    console.error(`generateMetadata blog ${slug}: ${error}`);
    return { title: "Article unavailable", robots: { index: false, follow: false } };
  }

  if (!blog) {
    return {
      title: "Article not found",
      robots: { index: false, follow: false },
    };
  }

  const description = blog.description || makeExcerpt(blog.content);
  const canonical = `/blog/${blog.slug}`;

  return {
    title: blog.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: blog.title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      publishedTime: blog.published_at ?? undefined,
      images: blog.cover_image_url ? [{ url: blog.cover_image_url }] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const { data: blog, error } = await getPublicBlogBySlugResult(slug);

  if (error) {
    console.error(`BlogArticlePage ${slug}: ${error}`);
  }

  debugLog(slug, error, blog ? 1 : 0);

  if (error) {
    return <QueryErrorState message={error} />;
  }

  if (!blog) {
    notFound();
  }

  const allBlogs = await getPublishedBlogs();
  const related = getRelatedBlogs(blog, allBlogs, 3);
  const description = blog.description || makeExcerpt(blog.content);
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description,
    datePublished: blog.published_at ?? undefined,
    dateModified: blog.updated_at ?? undefined,
    author: {
      "@type": "Organization",
      name: blog.author_name ?? siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${blog.slug}`,
    image: blog.cover_image_url ?? undefined,
  }).replace(/</g, "\\u003c");

  return (
    <>
      <ReadingProgress />
      <Container className="py-10">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            ...(blog.categories
              ? [{ label: blog.categories.name, href: categoryHref(blog.categories.slug) }]
              : []),
            { label: blog.title },
          ]}
        />

        <Reveal>
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <CategoryPill category={blog.categories} />
              <span>{formatDate(blog.published_at)}</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 aria-hidden="true" size={13} />
                {readingMinutes(blog.content)} min read
              </span>
            </div>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight tracking-tight text-navy-900 sm:text-5xl">
              {blog.title}
            </h1>
            {blog.subtitle ? (
              <p className="mt-4 text-lg font-medium leading-8 text-slate-700">{blog.subtitle}</p>
            ) : null}
            <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
            <p className="mt-4 text-sm font-medium text-slate-500">
              By {blog.author_name ?? siteConfig.name}
            </p>
          </div>
        </Reveal>

        <Reveal className="relative mt-10 h-64 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-96">
          {blog.cover_image_url ? (
            <Image
              src={blog.cover_image_url}
              alt={blog.cover_image_alt ?? ""}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover"
            />
          ) : (
            <ImagePlaceholder
              label={blog.cover_image_note ?? "Cover image — 1600×900 payments illustration"}
            />
          )}
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-3xl">
          <article
            className="article-content rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
          />
        </Reveal>

        <Reveal className="mx-auto mt-8 max-w-3xl">
          <ShareBar title={blog.title} />
        </Reveal>

        <Reveal className="mx-auto mt-8 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <strong>Safety note:</strong> Content is for education only, not financial or legal advice.
          Never share your OTP, PIN or CVV with anyone.
        </Reveal>

        {related.length > 0 ? (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-navy-900">
              Keep reading
            </h2>
            <Reveal className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RevealItem key={item.id} className="h-full">
                  <BlogCard blog={item} />
                </RevealItem>
              ))}
            </Reveal>
          </section>
        ) : null}
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </>
  );
}
