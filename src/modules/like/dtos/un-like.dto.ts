import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class UnLikeDto {
  @StringFieldOptional()
  userId?: string;

  @StringFieldOptional()
  postId?: string;

  @StringFieldOptional()
  commentId?: string;
}
