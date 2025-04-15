import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class CreateLikeDto {
  @StringFieldOptional()
  userId?: string;

  @StringFieldOptional()
  postId?: string;

  @StringFieldOptional()
  commentId?: string;
}
