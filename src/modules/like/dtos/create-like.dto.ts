import {
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';

export class CreateLikeDto {
  @StringField()
  user_id!: string;

  @StringFieldOptional()
  post_id?: string;

  @StringFieldOptional()
  comment_id?: string;
}
