import {
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';

export class CreatePostDto {
  @StringField()
  content!: string;

  @StringFieldOptional()
  image?: string;
}
