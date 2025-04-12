import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class GetCommentDto {
  @StringFieldOptional()
  post_id?: string;

  @StringFieldOptional()
  parent_id?: string;

  @StringFieldOptional()
  after?: string;

  @StringFieldOptional()
  limit?: number;
}
