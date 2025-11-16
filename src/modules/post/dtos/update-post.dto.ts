import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class UpdatePostDto {
  @StringFieldOptional()
  title!: string;

  @StringFieldOptional()
  description?: string;

  @StringFieldOptional()
  totalLikes?: number;

  @StringFieldOptional()
  totalComments?: number;
}
