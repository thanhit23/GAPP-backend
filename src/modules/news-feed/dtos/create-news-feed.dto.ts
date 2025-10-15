import { StringField } from '../../../decorators/field.decorators.ts';

export class CreateNewsFeedDto {
  @StringField()
  postId!: string;
}
