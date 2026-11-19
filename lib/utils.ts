import slugify from "slugify";

export function makeSlug(value: string): string {
  const result = slugify(value, { lower: true, strict: true, trim: true });
  return result.length > 0 ? result : `item-${Date.now()}`;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function readingMinutes(content: string): number {
  const words = stripHtml(content).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function makeExcerpt(html: string, maxLength = 170): string {
  const text = stripHtml(html);
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function formatDate(value: string | null): string {
  if (!value) {
    return "Draft";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[^>]*>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["'])javascript:[^"']*\2/gi, '$1="#"')
    .replace(/(href|src)\s*=\s*(["'])data:[^"']*\2/gi, '$1="#"');
}
