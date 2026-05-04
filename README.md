# Track Prices Backend

Track Prices Backend is the API and orchestration layer for the broader Track Prices system. It accepts product search requests from the UI, creates scrape jobs in Supabase, and exposes job/result endpoints that the UI can poll while the scraper worker runs in the background.

This repository does not perform scraping directly. Scraping is delegated to a separate worker service through the `scrape_jobs` table. The backend is responsible for validation, API boundaries, and database coordination.

## Role In The Track Prices System

```text
Track Prices UI
      |
      | creates search request
      v
Track Prices Backend
      |
      | inserts pending scrape job
      v
Supabase scrape_jobs
      |
      | consumed by scraper worker
      v
Track Prices Scraper
      |
      | writes normalized results
      v
Supabase scrape_results
      |
      | read through backend endpoints
      v
Track Prices UI
```

The backend keeps the user-facing app decoupled from scraper execution. This makes the system easier to scale, retry, monitor, and extend with additional marketplace adapters.

## Project Purpose

This project is built for educational and portfolio purposes. It demonstrates a clean API layer for an asynchronous scraping pipeline using NestJS and Supabase.

It shows:

- NestJS module organization
- Request validation with DTOs
- Supabase service abstraction
- Job creation through `scrape_jobs`
- Result reads through `scrape_results`
- UUID validation for job routes
- A backend API that coordinates with a separate scraper worker

## Responsible Use

This backend is part of an educational architecture. Any data sources connected by the scraper worker must be used responsibly.

Users are responsible for complying with the terms of service, robots.txt rules, rate limits, and applicable laws of any website or data source they connect. Do not use the Track Prices system to overload third-party services, bypass access controls, collect personal data, or perform unauthorized scraping.

This project is not affiliated with, endorsed by, or sponsored by any marketplace, retailer, or e-commerce platform.

## Features

- NestJS API
- TypeScript
- Supabase client integration
- Global validation pipe
- Create scrape job endpoint
- Read scrape job endpoint
- Read results by scrape job endpoint
- Query DTO validation
- Central Supabase service
- Separate modules for jobs and results

## API Endpoints

### Health / Root

```http
GET /
```

Returns the default service response.

### Create Scrape Job

```http
POST /scrape-jobs
Content-Type: application/json

{
  "query": "wireless headphones"
}
```

Validation:

- `query` must be a string
- minimum length: `2`
- maximum length: `120`
- whitespace is trimmed before validation

The endpoint inserts a pending job into Supabase:

```ts
{
  query: dto.query,
  status: "pending"
}
```

### Read Scrape Job

```http
GET /scrape-jobs/:id
```

Returns the current job state from `scrape_jobs`.

Possible statuses:

- `pending`
- `processing`
- `completed`
- `failed`

### Read Results For A Job

```http
GET /scrape-jobs/:id/results
```

Returns normalized results from `scrape_results`, ordered by `position`.

### Read Results By Query Parameter

```http
GET /scrape-results?jobId=<uuid>
```

Returns the same result set for a given job ID.

## Supabase Contract

The backend expects the same tables used by the scraper worker.

### `scrape_jobs`

Stores queue items and worker state.

| Column | Purpose |
| --- | --- |
| `id` | Job ID |
| `query` | Product search query |
| `status` | `pending`, `processing`, `completed`, or `failed` |
| `attempt_count` | Number of processing attempts |
| `max_attempts` | Maximum retry count |
| `worker_id` | Worker that claimed the job |
| `locked_at` | Lock timestamp |
| `started_at` | Processing start timestamp |
| `completed_at` | Completion timestamp |
| `last_error` | Last worker-level error |
| `source_errors` | Per-adapter error details |
| `created_at` | Creation timestamp |
| `updated_at` | Update timestamp |

### `scrape_results`

Stores normalized product results written by the scraper worker.

| Column | Purpose |
| --- | --- |
| `id` | Result ID |
| `job_id` | Related scrape job |
| `source` | Generic marketplace source |
| `query` | Original product query |
| `title` | Product title |
| `price` | Product price |
| `currency` | Currency code |
| `product_url` | Product page URL |
| `image_url` | Product image URL |
| `rating` | Product rating |
| `review_count` | Number of reviews |
| `position` | Source result position |
| `raw` | Adapter-specific raw payload |
| `created_at` | Creation timestamp |

## Project Structure

```text
src/
  main.ts                         NestJS bootstrap
  app.module.ts                   Root module
  supabase/
    supabase.module.ts            Supabase module
    supabase.service.ts           Supabase client factory
  scrape-jobs/
    scrape-jobs.module.ts         Job module
    scrape-jobs.controller.ts     Job endpoints
    scrape-jobs.service.ts        Job persistence logic
    dto/
      create-scrape-job.dto.ts    Query validation DTO
  scrape-results/
    scrape-results.module.ts      Result module
    scrape-results.controller.ts  Result endpoint
    scrape-results.service.ts     Result read logic
```

## Environment Variables

Create a local `.env` file:

```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Important: `SUPABASE_SERVICE_ROLE_KEY` must only be used in a trusted backend or worker environment. Never expose it in frontend code.

## Installation

```bash
npm install
```

## Development

```bash
npm run start:dev
```

Default local URL:

```text
http://localhost:3000
```

## Scripts

```bash
npm run build
npm run start
npm run start:dev
npm run start:prod
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```

## Related Services

Track Prices is split into three pieces:

- `track-prices-ui`: frontend dashboard
- `track-prices-backend`: API and Supabase orchestration layer
- `trackprices-scraper`: background scraper worker

The backend should be running before the UI starts creating search jobs. The scraper worker should be running for jobs to move from `pending` to `completed`.

## Scalability Notes

This backend is intentionally thin. It creates jobs and reads results, while scraping happens in a separate worker process.

This keeps the architecture scalable because:

- User-facing API requests are short-lived.
- Scraping retries do not block HTTP requests.
- Multiple scraper workers can consume the same job queue.
- Marketplace-specific logic can live outside the backend.
- Supabase acts as the persistence layer between services.

Possible next steps:

- Add authenticated users
- Add per-user job ownership
- Add cached search responses
- Add product catalog endpoints
- Add price history endpoints
- Add watchlist and price alert APIs
- Add rate limiting for public endpoints
- Add observability for job and scraper health

## Publishing Safety

Before publishing this repository publicly:

- Do not commit `.env` files.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY`.
- Keep source names generic if publishing as an educational demo.
- Do not include scraped datasets, cookies, sessions, tokens, or private logs.
- Document that scraping is handled by a separate responsible-use worker.

## License

This project is currently marked as `UNLICENSED` in `package.json`. Add a license before publishing publicly if you want others to reuse it.

