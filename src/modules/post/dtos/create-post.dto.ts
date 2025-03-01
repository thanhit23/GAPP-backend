import { StringField } from '../../../decorators/field.decorators.ts';

export class CreatePostDto {
  @StringField()
  title!: string;

  @StringField()
  description!: string;
}
