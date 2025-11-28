export type UserRole = 'admin' | 'editor' | 'journalist' | 'author' | 'user';

export type ArticleStatus = 'draft' | 'pending_review' | 'published' | 'rejected';

export type AdType = 'banner' | 'sidebar' | 'inline' | 'popup';

export type AdPlacement = 'header' | 'sidebar' | 'article_top' | 'article_middle' | 'article_bottom' | 'footer';

export type SponsorPlacement = 'sidebar' | 'header' | 'footer' | 'article';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: any; // JSON content from TipTap
  cover_image?: string;
  author_id: string;
  author?: User;
  status: ArticleStatus;
  tags: string[];
  views?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  user?: User;
  content: string;
  parent_id?: string;
  replies?: Comment[];
  likes: number;
  dislikes: number;
  reported: boolean;
  created_at: string;
}

export interface Favorite {
  user_id: string;
  article_id: string;
  created_at: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  url: string;
  placement: SponsorPlacement;
  active: boolean;
  created_at: string;
}

export interface Ad {
  id: string;
  type: AdType;
  code: string;
  placement: AdPlacement;
  active: boolean;
  created_at: string;
}

export interface SiteConfig {
  id: string;
  logo_url?: string;
  favicon_url?: string;
  site_name: string;
  site_description?: string;
  primary_color: string;
  secondary_color: string;
  social_links?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  updated_at: string;
}

export interface DashboardStats {
  total_articles: number;
  published_articles: number;
  pending_articles: number;
  total_users: number;
  total_comments: number;
  total_views: number;
  top_articles: Article[];
  recent_comments: Comment[];
}