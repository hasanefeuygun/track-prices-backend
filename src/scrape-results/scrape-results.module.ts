import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { ScrapeResultsController } from './scrape-results.controller';
import { ScrapeResultsService } from './scrape-results.service';

@Module({
  imports: [SupabaseModule],
  controllers: [ScrapeResultsController],
  providers: [ScrapeResultsService],
  exports: [ScrapeResultsService],
})
export class ScrapeResultsModule {}
