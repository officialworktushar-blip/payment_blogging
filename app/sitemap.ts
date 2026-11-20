import type { MetadataRoute } from "next";
import { getCategories, getPublishedBlogs } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
  "/blog",
  "/search",
  "/about-us",
  "/contact-support",
  "/disclaimer",
  "/privacy-policy",
  "/terms",
];

const PUBLIC_CATEGORY_SLUGS: ReadonlySet<string> = new Set([
  "payment-gateways",
  "upi-wallets",
  "cards",
  "net-banking",
  "payment-security",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, categories] = await Promise.all([getPublishedBlogs(), getCategories()]);
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path, index) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified: now,
    changeFrequency: index < 2 ? "daily" : "monthly",
    priority: path === "/" ? 1 : index < 6 ? 0.7 : 0.5,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((category) => PUBLIC_CATEGORY_SLUGS.has(category.slug))
    .map((category) => ({
      url: new URL(`/${category.slug}`, siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => {
    const lastModifiedValue = blog.updated_at || blog.published_at || now.toISOString();
    return {
      url: new URL(`/blog/${blog.slug}`, siteConfig.url).toString(),
      lastModified: new Date(lastModifiedValue),
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  return [...staticEntries, ...categoryEntries, ...blogEntries];
}
