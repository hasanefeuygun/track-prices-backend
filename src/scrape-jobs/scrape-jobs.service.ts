import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateScrapeJobDto } from './dto/create-scrape-job.dto';
import type { ScrapeJobResponse } from './interfaces/responses.interface';

@Injectable()
export class ScrapeJobsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(dto: CreateScrapeJobDto): Promise<ScrapeJobResponse> {
    const supabase = this.supabaseService.getClient();

    const response = await supabase
      .from('scrape_jobs')
      .insert({
        query: dto.query,
        status: 'pending',
      })
      .select()
      .single();

    if (response.error) {
      throw new InternalServerErrorException(response.error.message);
    }

    if (!response.data) {
      throw new InternalServerErrorException(
        'Supabase did not return an inserted scrape job',
      );
    }

    return response.data as ScrapeJobResponse;
  }

  async findOne(id: string): Promise<ScrapeJobResponse> {
    const supabase = this.supabaseService.getClient();

    const response = await supabase
      .from('scrape_jobs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (response.error) {
      throw new InternalServerErrorException(response.error.message);
    }

    if (!response.data) {
      throw new NotFoundException(`Scrape job ${id} not found`);
    }

    return response.data as ScrapeJobResponse;
  }
}
