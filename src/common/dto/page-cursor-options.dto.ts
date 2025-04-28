import { Max } from 'class-validator';
import { Min } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString } from 'class-validator';
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class PageCursorOptionsDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
