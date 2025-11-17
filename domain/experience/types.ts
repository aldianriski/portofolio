export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  achievements: string[];
  order_index: number;
  locale: string;
  created_at: string;
  updated_at: string;
}
