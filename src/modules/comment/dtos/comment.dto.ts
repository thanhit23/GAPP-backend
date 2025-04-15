import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import {
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';
import type { CommentEntity } from '../comment.entity.ts';
import type { AbstractEntity } from '../../../common/abstract.entity.ts';

export class CommentRelationDto extends AbstractDto {
  @StringField()
  userId!: string;

  @StringFieldOptional()
  postId!: string | null;

  @StringFieldOptional()
  parentId!: string | null;

  @StringField()
  content!: string;

  constructor(entity: AbstractEntity & CommentEntity) {
    super(entity);
    this.id = entity.id;
    this.userId = entity.userId;
    this.postId = entity.postId || null;
    this.parentId = entity.parentId || null;
    this.content = entity.content;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
