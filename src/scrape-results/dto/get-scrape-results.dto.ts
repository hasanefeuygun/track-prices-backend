import { IsUUID } from 'class-validator';

export class GetScrapeResultsDto {
  @IsUUID()
  jobId!: string;
}
