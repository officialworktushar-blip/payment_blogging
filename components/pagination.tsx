import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}

export function Pagination({ page, totalPages, basePath, query = {} }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  function hrefFor(target: number): string {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    if (target > 1) {
      params.set("page", String(target));
    }

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          className="arrow-link inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:text-brand-700"
        >
          <ChevronLeft aria-hidden="true" size={14} />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-300">
          <ChevronLeft aria-hidden="true" size={14} />
          Previous
        </span>
      )}

      {pages.map((target) => (
        <Link
          key={target}
          href={hrefFor(target)}
          aria-current={target === page ? "page" : undefined}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold ${
            target === page
              ? "bg-brand-600 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:text-brand-700"
          }`}
        >
          {target}
        </Link>
      ))}

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          className="arrow-link inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:text-brand-700"
        >
          Next
          <ChevronRight aria-hidden="true" size={14} />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-300">
          Next
          <ChevronRight aria-hidden="true" size={14} />
        </span>
      )}
    </nav>
  );
}
