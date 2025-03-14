import { StringField } from '../../../decorators/field.decorators.ts';

export class CreateNewsFeedDto {
  @StringField()
  post_id!: string;
}
