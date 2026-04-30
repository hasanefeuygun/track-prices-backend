import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { GetScrapeResultsDto } from './dto/get-scrape-results.dto';
import type { ScrapeResultResponse } from './interfaces/responses.interface';

@Injectable()
export class ScrapeResultsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findMany(query: GetScrapeResultsDto): Promise<ScrapeResultResponse[]> {
    return this.findByJobId(query.jobId);
  }

  async findByJobId(jobId: string): Promise<ScrapeResultResponse[]> {
    const supabase = this.supabaseService.getClient();

    const response = await supabase
      .from('scrape_results')
      .select('*')
      .eq('job_id', jobId)
      .order('position', { ascending: true });

    if (response.error) {
      throw new InternalServerErrorException(response.error.message);
    }

    return (response.data ?? []) as ScrapeResultResponse[];
  }
}
