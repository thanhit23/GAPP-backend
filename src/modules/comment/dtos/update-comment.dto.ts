import { StringField } from '../../../decorators/field.decorators.ts';

export class UpdateCommentDto {
  @StringField()
  content!: string;
}
