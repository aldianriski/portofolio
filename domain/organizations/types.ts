export interface Organization {
  id: string;
  name: string;
  position: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  order_index: number;
  locale: string;
  created_at: string;
  updated_at: string;
}
