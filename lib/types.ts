export type PostStatus = "draft" | "published";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

export interface Blog {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  description: string | null;
  content: string;
  category_id: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_image_note: string | null;
  author_name: string | null;
  status: PostStatus;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportRequest {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: "open" | "resolved";
  created_at: string;
  updated_at: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface BlogSummary {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_image_note: string | null;
  author_name: string | null;
  published_at: string | null;
  is_featured: boolean;
  category_id: string | null;
  categories: CategorySummary | null;
}

export interface BlogWithCategory extends Blog {
  categories: CategorySummary | null;
}

export interface BlogInput {
  id?: string;
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  content: string;
  categoryId: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string;
  coverImageNote: string;
  authorName: string;
  status: PostStatus;
  isFeatured: boolean;
}

export interface CategoryInput {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order?: number;
}

export interface SupportRequestInput {
  name: string;
  email: string;
  topic: string;
  message: string;
  status: "open";
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
  slug?: string;
}

export type CategoryRow = Category;
export type CategoryPublic = Pick<Category, "id" | "name" | "slug" | "description">;
export type BlogRow = Blog;
