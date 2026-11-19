export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface FooterColumn {
  title: string;
  links: NavItem[];
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
  footerColumns: FooterColumn[];
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
    "PayLens explains cards, UPI, wallets, gateways, net banking and payment safety with practical, jargon-free examples for curious readers.",
  url: getSiteUrl(),
  nav: [
    { label: "Home", href: "/" },
    { label: "Payment Gateways", href: "/categories/gateways" },
    { label: "UPI & Wallets", href: "/categories/upi-and-wallets" },
    { label: "Cards", href: "/categories/cards" },
    { label: "Net Banking", href: "/categories/net-banking" },
    { label: "Payment Security", href: "/categories/security" },
    { label: "Blog", href: "/posts" },
    { label: "Contact Support+", href: "/contact" },
    { label: "About Us", href: "/about" },
  ],
  footerColumns: [
    {
      title: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/posts" },
        { label: "About Us", href: "/about" },
        { label: "Contact Support+", href: "/contact" },
      ],
    },
    {
      title: "Topics",
      links: [
        { label: "Payment Gateways", href: "/categories/gateways" },
        { label: "UPI & Wallets", href: "/categories/upi-and-wallets" },
        { label: "Cards", href: "/categories/cards" },
        { label: "Net Banking", href: "/categories/net-banking" },
        { label: "Payment Security", href: "/categories/security" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "All categories", href: "/categories" },
        { label: "Search articles", href: "/posts" },
        { label: "Admin", href: "/admin/login" },
      ],
    },
  ],
  contact: {
    email: "hello@paylens.example",
    phone: "+1 (555) 010-0130",
    hours: "Monday to Friday, 09:00 to 17:00 UTC",
  },
};
