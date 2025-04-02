import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import {
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';
import type { PostEntity } from '../post.entity.ts';

export class PostDto extends AbstractDto {
  @StringField()
  title!: string;

  @StringField()
  description!: string;

  @StringFieldOptional()
  image!: string;

  constructor(post: PostEntity) {
    super(post);
    this.id = post.id;
    this.title = post.title;
    this.description = post.description || '';
    this.image = post?.image || '';
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}
