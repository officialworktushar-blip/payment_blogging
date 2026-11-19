export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface ContactConfig {
  email: string;
  phone: string;
  hours: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  nav: NavItem[];
  contact: ContactConfig;
}

function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl) {
    return "http://localhost:3000";
  }

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export const siteConfig: SiteConfig = {
  name: "PayLens",
  tagline: "Plain-language guides to the money-moving world",
  description:
    "PayLens explains cards, UPI, wallets, gateways and payment safety with practical, jargon-free examples for curious readers.",
  url: getSiteUrl(),
  nav: [
    { label: "Home", href: "/", description: "Latest explanations and guides" },
    { label: "Articles", href: "/posts", description: "Browse every article" },
    { label: "Categories", href: "/categories", description: "Explore by topic" },
    { label: "About", href: "/about", description: "Why PayLens exists" },
    { label: "Contact", href: "/contact", description: "Get in touch" },
  ],
  contact: {
    email: "hello@paylens.example",
    phone: "+1 (555) 010-0130",
    hours: "Monday to Friday, 09:00 to 17:00 UTC",
  },
};
