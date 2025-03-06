import { UUIDFieldOptional } from '../../../decorators/field.decorators.ts';

export class UpdateNewsFeedDto {
  @UUIDFieldOptional()
  user_id!: string;

  @UUIDFieldOptional()
  post_id!: Uuid;
}
