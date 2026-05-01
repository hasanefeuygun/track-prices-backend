import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapeJobsModule } from './scrape-jobs/scrape-jobs.module';
import { ScrapeResultsModule } from './scrape-results/scrape-results.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScrapeJobsModule,
    ScrapeResultsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
