import {
  UUIDField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';

export class CreateNewsFeedDto {
  @StringFieldOptional()
  user_id?: string;

  @UUIDField()
  post_id!: string;
}
