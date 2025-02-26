import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import { StringField } from '../../../decorators/field.decorators.ts';
import type { PostEntity } from '../post.entity.ts';

export class PostDto extends AbstractDto {
  @StringField()
  title!: string;

  @StringField()
  description!: string;

  constructor(post: PostEntity) {
    super(post);
    this.id = post.id;
    this.title = post.title;
    this.description = post.description || '';
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}
