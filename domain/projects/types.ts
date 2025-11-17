export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  role: string | null;
  tech_stack: string[];
  contributions: string | null;
  impact: string | null;
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  featured: boolean;
  order_index: number;
  locale: string;
  created_at: string;
  updated_at: string;
}
