import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import {
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';
import type { PostEntity } from '../post.entity.ts';

export class PostDto extends AbstractDto {
  @StringField()
  content!: string;

  @StringFieldOptional()
  image!: string;

  constructor(post: PostEntity) {
    super(post);
    this.id = post.id;
    this.content = post.content;
    this.image = post?.image || '';
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}
