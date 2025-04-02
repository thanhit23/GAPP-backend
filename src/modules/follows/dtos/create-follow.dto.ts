import { StringField } from '../../../decorators/field.decorators.ts';

export class FollowUserDto {
  @StringField()
  source_user_id!: string;

  @StringField()
  target_user_id!: string;
}
