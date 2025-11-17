export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  order_index: number;
  locale: string;
  created_at: string;
  updated_at: string;
}
