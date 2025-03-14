import {
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';

export class CreatePostDto {
  @StringField()
  title!: string;

  @StringField()
  description!: string;

  @StringFieldOptional()
  image?: string;
}
