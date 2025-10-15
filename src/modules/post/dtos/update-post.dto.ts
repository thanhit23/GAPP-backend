import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class UpdatePostDto {
  @StringFieldOptional()
  content!: string;

  @StringFieldOptional()
  totalLikes?: number;

  @StringFieldOptional()
  totalComments?: number;
}
