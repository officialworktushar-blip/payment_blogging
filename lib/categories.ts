export const CATEGORY_SLUGS = [
  "payment-gateways",
  "upi-wallets",
  "cards",
  "net-banking",
  "payment-security",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface CategoryLink {
  label: string;
  href: `/${CategorySlug}`;
}

export const CATEGORY_LABELS: Readonly<Record<CategorySlug, string>> = {
  "payment-gateways": "Payment Gateways",
  "upi-wallets": "UPI & Wallets",
  cards: "Cards",
  "net-banking": "Net Banking",
  "payment-security": "Payment Security",
};

export const CATEGORY_SLUG_SET: ReadonlySet<string> = new Set<string>(CATEGORY_SLUGS);

export const CATEGORY_LINKS: readonly CategoryLink[] = CATEGORY_SLUGS.map(
  (slug): CategoryLink => ({ label: CATEGORY_LABELS[slug], href: `/${slug}` }),
);

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORY_SLUG_SET.has(value);
}

export function categoryHref(slug: string): string {
  return isCategorySlug(slug) ? `/${slug}` : "/blog";
}
