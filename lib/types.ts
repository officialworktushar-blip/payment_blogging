export type PostStatus = "draft" | "published";

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category_id: string | null;
  author: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface PostWithCategory extends PostRow {
  categories: CategorySummary | null;
}

export interface PostInput {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  categoryId: string | null;
  author: string;
  status: PostStatus;
}

export interface CategoryInput {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface BlogRow {
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
  status: string;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogWithCategory extends BlogRow {
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

export interface SupportRequest {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
  slug?: string;
}

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
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
          status: string;
          is_featured: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          slug: string;
          description?: string | null;
          content?: string;
          category_id?: string | null;
          cover_image_url?: string | null;
          cover_image_alt?: string | null;
          cover_image_note?: string | null;
          author_name?: string | null;
          status?: string;
          is_featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          subtitle?: string | null;
          slug?: string;
          description?: string | null;
          content?: string;
          category_id?: string | null;
          cover_image_url?: string | null;
          cover_image_alt?: string | null;
          cover_image_note?: string | null;
          author_name?: string | null;
          status?: string;
          is_featured?: boolean;
          published_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blogs_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image: string | null;
          category_id: string | null;
          author: string;
          status: string;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string;
          content?: string;
          cover_image?: string | null;
          category_id?: string | null;
          author?: string;
          status?: string;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          cover_image?: string | null;
          category_id?: string | null;
          author?: string;
          status?: string;
          published_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_users: {
        Row: {
          email: string;
        };
        Insert: {
          email: string;
        };
        Update: {
          email?: string;
        };
        Relationships: [];
      };
      support_requests: {
        Row: {
          id: string;
          name: string;
          email: string;
          topic: string;
          message: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          topic: string;
          message: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          topic?: string;
          message?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
