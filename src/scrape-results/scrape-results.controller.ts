import { Controller, Get, Query } from '@nestjs/common';
import { GetScrapeResultsDto } from './dto/get-scrape-results.dto';
import { ScrapeResultsService } from './scrape-results.service';

@Controller('scrape-results')
export class ScrapeResultsController {
  constructor(private readonly scrapeResultsService: ScrapeResultsService) {}

  @Get()
  findMany(@Query() query: GetScrapeResultsDto) {
    return this.scrapeResultsService.findMany(query);
  }
}
