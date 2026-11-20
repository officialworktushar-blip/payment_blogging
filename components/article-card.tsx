import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { CategoryPill } from "@/components/category-pill";
import { ImagePlaceholder } from "@/components/image-placeholder";
import type { BlogSummary } from "@/lib/types";
import { formatDate, readingMinutes } from "@/lib/utils";

interface ArticleCardProps {
  post: BlogSummary;
  featured?: boolean;
}

export function ArticleCard({ post, featured = false }: ArticleCardProps) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card hover-lift ${
        featured ? "md:col-span-2 md:flex-row" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? "h-52 md:h-auto md:w-2/5" : "h-44"}`}>
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.cover_image_alt ?? ""}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder label={post.cover_image_note ?? "Cover image — 1200×630 payment explainer"} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <CategoryPill category={post.categories} />
          <span>{formatDate(post.published_at)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 aria-hidden="true" size={13} />
            {readingMinutes(post.description ?? "")} min read
          </span>
        </div>

        <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-navy-900">
          <Link href={`/blog/${post.slug}`} className="arrow-link inline-flex items-start gap-1 hover:text-brand-700">
            {post.title}
            <ArrowUpRight
              aria-hidden="true"
              size={16}
              className="arrow-icon mt-1 shrink-0 text-brand-600"
            />
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
          {post.description ?? "Read the full guide."}
        </p>

        <p className="mt-auto pt-4 text-xs font-medium text-slate-500">
          By {post.author_name ?? "PayLens Team"}
        </p>
      </div>
    </article>
  );
}
