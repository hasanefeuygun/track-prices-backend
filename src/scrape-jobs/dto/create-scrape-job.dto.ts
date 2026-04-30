import { IsString, MaxLength, MinLength } from 'class-validator';
import { Transform, type TransformFnParams } from 'class-transformer';

export class CreateScrapeJobDto {
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  query!: string;
}
