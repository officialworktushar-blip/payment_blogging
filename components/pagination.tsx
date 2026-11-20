import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}

export function Pagination({ page, totalPages, basePath, query = {} }: PaginationProps) {
  const safeTotalPages =
    Number.isFinite(totalPages) && totalPages > 0 ? Math.floor(totalPages) : 1;

  if (safeTotalPages <= 1) {
    return null;
  }

  const currentPage =
    Number.isFinite(page) && page > 0 ? Math.min(Math.floor(page), safeTotalPages) : 1;

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

  const pages = Array.from({ length: safeTotalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link
          href={hrefFor(currentPage - 1)}
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
          aria-current={target === currentPage ? "page" : undefined}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold ${
            target === currentPage
              ? "bg-brand-600 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:text-brand-700"
          }`}
        >
          {target}
        </Link>
      ))}

      {currentPage < safeTotalPages ? (
        <Link
          href={hrefFor(currentPage + 1)}
          className="arrow-link inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:text-brand-700"
        >
          Next
          <ChevronRight aria-hidden="true" size={15} className="arrow-icon" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-300">
          Next
          <ChevronRight aria-hidden="true" size={15} className="arrow-icon" />
        </span>
      )}
    </nav>
  );
}
