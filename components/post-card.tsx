import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { CategoryPill } from "@/components/category-pill";
import type { PostWithCategory } from "@/lib/types";
import { formatDate, readingMinutes } from "@/lib/utils";

interface PostCardProps {
  post: PostWithCategory;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-colors motion-reduce:transition-none hover:border-brand-200 ${
        featured ? "md:col-span-2 md:flex-row" : ""
      }`}
    >
      <div
        className={`relative bg-gradient-to-br from-brand-100 to-slate-100 ${
          featured ? "h-48 md:h-auto md:w-2/5" : "h-44"
        }`}
      >
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt=""
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-brand-700">
            PayLens explainer
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <CategoryPill category={post.categories} />
          <span>{formatDate(post.published_at)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 aria-hidden="true" size={13} />
            {readingMinutes(post.content)} min read
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-900">
          <Link href={`/posts/${post.slug}`} className="hover:text-brand-700">
            {post.title}
            <ArrowUpRight
              aria-hidden="true"
              size={16}
              className="ml-1 inline-block transition-transform motion-reduce:transition-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
            />
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>

        <p className="mt-auto pt-4 text-xs font-medium text-slate-500">By {post.author}</p>
      </div>
    </article>
  );
}
