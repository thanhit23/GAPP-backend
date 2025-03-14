import { StringField } from '../../../decorators/field.decorators.ts';

export class CreateFollowDto {
  @StringField()
  source_user_id!: string;

  @StringField()
  target_user_id!: string;
}
