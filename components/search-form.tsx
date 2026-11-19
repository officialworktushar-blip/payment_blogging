"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

interface SearchFormProps {
  initialQuery?: string;
  categorySlug?: string;
}

export function SearchForm({ initialQuery = "", categorySlug }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams();

    if (trimmed) {
      params.set("q", trimmed);
    }

    if (categorySlug) {
      params.set("category", categorySlug);
    }

    const queryString = params.toString();
    router.push(queryString ? `/posts?${queryString}` : "/posts");
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="w-full max-w-md">
      <label htmlFor="post-search" className="sr-only">
        Search articles
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <Search aria-hidden="true" size={18} className="shrink-0 text-slate-400" />
        <input
          id="post-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search payments topics"
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 motion-reduce:transition-none"
        >
          Search
        </button>
      </div>
    </form>
  );
}
