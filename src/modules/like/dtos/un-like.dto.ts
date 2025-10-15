import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class Unlike {
  @StringFieldOptional()
  userId?: string;

  @StringFieldOptional()
  postId?: string;

  @StringFieldOptional()
  commentId?: string;
}
