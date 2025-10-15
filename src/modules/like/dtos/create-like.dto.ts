import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class AddLike {
  @StringFieldOptional()
  userId?: string;

  @StringFieldOptional()
  postId?: string;

  @StringFieldOptional()
  commentId?: string;
}
