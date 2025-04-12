import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class UpdatePostDto {
  @StringFieldOptional()
  title!: string;

  @StringFieldOptional()
  description!: string;

  @StringFieldOptional()
  total_likes?: number;

  @StringFieldOptional()
  total_comments?: number;
}
