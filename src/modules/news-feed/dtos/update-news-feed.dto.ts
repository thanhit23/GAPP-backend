import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class UpdateNewsFeedDto {
  @StringFieldOptional()
  userId!: string;

  @StringFieldOptional()
  postId!: string;
}
