import Link from "next/link";
import { FileSearch } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  href?: string;
  label?: string;
}

export function EmptyState({ title, description, href, label }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <FileSearch aria-hidden="true" size={20} />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {href && label ? (
        <Link
          href={href}
          className="mt-5 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          {label}
        </Link>
      ) : null}
    </div>
  );
}
