export interface ScrapeResultResponse {
  id: string;
  job_id: string;
  source: string;
  query: string;
  title: string;
  price: number | null;
  currency: string;
  product_url: string;
  image_url: string | null;
  seller_name: string | null;
  rating: number | null;
  review_count: number | null;
  position: number;
  raw: Record<string, unknown>;
  created_at: string;
}
