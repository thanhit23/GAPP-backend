import {
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';

export class UnLikeDto {
  @StringField()
  userId!: string;

  @StringFieldOptional()
  postId?: string;

  @StringFieldOptional()
  commentId?: string;
}
