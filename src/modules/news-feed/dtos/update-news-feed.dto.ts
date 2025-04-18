import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class UpdateNewsFeedDto {
  @StringFieldOptional()
  user_id!: string;

  @StringFieldOptional()
  post_id!: string;
}
