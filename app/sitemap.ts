import type { MetadataRoute } from "next";
import { CATEGORY_SLUGS, categoryHref } from "@/lib/categories";
import { siteConfig } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/static";

export const dynamic = "force-dynamic";

interface SitemapBlog {
  slug: string;
  updated_at: string | null;
  published_at: string | null;
}

const INFO_PATHS = [
  "/about-us",
  "/contact-support",
  "/disclaimer",
  "/privacy-policy",
  "/terms",
] as const;

function staticEntries(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "/",
    "/blog",
    ...CATEGORY_SLUGS.map((slug) => categoryHref(slug)),
    ...INFO_PATHS,
  ];

  return paths.map((path, index) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified: now,
    changeFrequency: index < 2 ? "daily" : index < 7 ? "weekly" : "monthly",
    priority: path === "/" ? 1 : index < 2 ? 0.8 : index < 7 ? 0.6 : 0.5,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("slug, updated_at, published_at")
      .eq("status", "published");

    if (error) {
      console.error("[sitemap]", {
        step: "sitemap.blogs",
        slug: "sitemap",
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return staticEntries();
    }

    const blogs = (data ?? []) as SitemapBlog[];
    if (blogs.length === 0) {
      return staticEntries();
    }

    const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: new URL(`/blog/${blog.slug}`, siteConfig.url).toString(),
      lastModified: new Date(blog.updated_at ?? blog.published_at ?? Date.now()),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    return [...staticEntries(), ...blogEntries];
  } catch (caught: unknown) {
    console.error("[sitemap]", {
      step: "sitemap.page",
      slug: "sitemap",
      message: caught instanceof Error ? caught.message : "Unknown error",
      code: null,
      details: null,
      hint: null,
    });
    return staticEntries();
  }
}
