import { Module } from '@nestjs/common';
import { ScrapeResultsModule } from '../scrape-results/scrape-results.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { ScrapeJobsController } from './scrape-jobs.controller';
import { ScrapeJobsService } from './scrape-jobs.service';

@Module({
  imports: [SupabaseModule, ScrapeResultsModule],
  controllers: [ScrapeJobsController],
  providers: [ScrapeJobsService],
  exports: [ScrapeJobsService],
})
export class ScrapeJobsModule {}
