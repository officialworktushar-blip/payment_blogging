import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { CategoryPill } from "@/components/category-pill";
import { ImagePlaceholder } from "@/components/image-placeholder";
import type { BlogWithCategory } from "@/lib/types";
import { formatDate, makeExcerpt, readingMinutes } from "@/lib/utils";

interface BlogCardProps {
  blog: BlogWithCategory;
  featured?: boolean;
}

export function BlogCard({ blog, featured = false }: BlogCardProps) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card hover-lift ${
        featured ? "md:col-span-2 md:flex-row" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? "h-52 md:h-auto md:w-2/5" : "h-44"}`}>
        {blog.cover_image_url ? (
          <Image
            src={blog.cover_image_url}
            alt={blog.cover_image_alt ?? ""}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder
            label={blog.cover_image_note ?? "Cover image — 1200×630 payment explainer"}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <CategoryPill category={blog.categories} />
          <span>{formatDate(blog.published_at)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 aria-hidden="true" size={13} />
            {readingMinutes(blog.content)} min read
          </span>
        </div>

        <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-navy-900">
          <Link href={`/blog/${blog.slug}`} className="arrow-link inline-flex items-start gap-1 hover:text-brand-700">
            {blog.title}
            <ArrowUpRight
              aria-hidden="true"
              size={16}
              className="arrow-icon mt-1 shrink-0 text-brand-600"
            />
          </Link>
        </h3>

        {blog.subtitle ? (
          <p className="mt-1 text-sm font-medium text-slate-700">{blog.subtitle}</p>
        ) : null}

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
          {blog.description ?? makeExcerpt(blog.content)}
        </p>

        <p className="mt-auto pt-4 text-xs font-medium text-slate-500">
          By {blog.author_name ?? "PayLens Team"}
        </p>
      </div>
    </article>
  );
}
