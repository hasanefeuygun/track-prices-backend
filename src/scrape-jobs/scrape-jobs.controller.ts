import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ScrapeResultsService } from '../scrape-results/scrape-results.service';
import { CreateScrapeJobDto } from './dto/create-scrape-job.dto';
import { ScrapeJobsService } from './scrape-jobs.service';

@Controller('scrape-jobs')
export class ScrapeJobsController {
  constructor(
    private readonly scrapeJobsService: ScrapeJobsService,
    private readonly scrapeResultsService: ScrapeResultsService,
  ) {}

  @Post()
  create(@Body() dto: CreateScrapeJobDto) {
    return this.scrapeJobsService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.scrapeJobsService.findOne(id);
  }

  @Get(':id/results')
  findResults(@Param('id', ParseUUIDPipe) id: string) {
    return this.scrapeResultsService.findByJobId(id);
  }
}
