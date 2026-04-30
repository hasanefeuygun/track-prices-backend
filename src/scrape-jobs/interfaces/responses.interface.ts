export type ScrapeJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ScrapeJobResponse {
  id: string;
  query: string;
  status: ScrapeJobStatus;
  attempt_count: number;
  max_attempts: number;
  worker_id: string | null;
  locked_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  last_error: string | null;
  source_errors: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
