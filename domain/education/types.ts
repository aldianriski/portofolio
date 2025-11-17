export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  gpa: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  order_index: number;
  locale: string;
  created_at: string;
  updated_at: string;
}
