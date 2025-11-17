export interface Testimonial {
  id: string;
  name: string;
  position: string | null;
  company: string | null;
  content: string;
  avatar_url: string | null;
  rating: number;
  order_index: number;
  locale: string;
  created_at: string;
  updated_at: string;
}
