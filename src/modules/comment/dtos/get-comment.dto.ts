import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class GetCommentDto {
  @StringFieldOptional()
  postId?: string;

  @StringFieldOptional()
  parentId?: string;

  @StringFieldOptional()
  after?: string;

  @StringFieldOptional()
  limit?: number;
}
