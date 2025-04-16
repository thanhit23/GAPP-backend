import {
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';

export class CreateCommentDto {
  @StringFieldOptional()
  userId?: string;

  @StringFieldOptional()
  postId?: string;

  @StringFieldOptional()
  parentId?: string;

  @StringField()
  content!: string;
}
