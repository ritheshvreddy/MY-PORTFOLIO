export interface SiteSettings {
  id: string;

  portfolio_name: string;

  tagline: string | null;

  email: string | null;

  github_url: string | null;

  linkedin_url: string | null;

  resume_url: string | null;

  logo_url: string | null;

  favicon_url: string | null;

  phone: string | null;

  location: string | null;

  seo_title: string | null;

  seo_description: string | null;

  copyright: string | null;

  created_at: string;

  updated_at: string;

  day_background_url: string | null;

  night_background_url: string | null;
}