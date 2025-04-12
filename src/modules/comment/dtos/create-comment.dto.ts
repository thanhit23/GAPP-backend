import {
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';

export class CreateCommentDto {
  @StringField()
  user_id!: string;

  @StringFieldOptional()
  post_id?: string;

  @StringFieldOptional()
  parent_id?: string;

  @StringField()
  content!: string;
}
