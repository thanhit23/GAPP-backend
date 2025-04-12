import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import {
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';
import type { CommentEntity } from '../comment.entity.ts';
import type { AbstractEntity } from '../../../common/abstract.entity.ts';

export class CommentRelationDto extends AbstractDto {
  @StringField()
  user_id!: string;

  @StringFieldOptional()
  post_id!: string | null;

  @StringFieldOptional()
  parent_id!: string | null;

  @StringField()
  content!: string;

  constructor(entity: AbstractEntity & CommentEntity) {
    super(entity);
    this.id = entity.id;
    this.user_id = entity.user_id;
    this.post_id = entity.post_id || null;
    this.parent_id = entity.parent_id || null;
    this.content = entity.content;
    this.created_at = entity.created_at;
    this.updated_at = entity.updated_at;
  }
}
