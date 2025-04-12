import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import { StringField } from '../../../decorators/field.decorators.ts';
import type { FollowEntity } from '../follow.entity.ts';
import type { AbstractEntity } from '../../../common/abstract.entity.ts';

export class FollowRelationDto extends AbstractDto {
  @StringField()
  source_user_id!: string;

  @StringField()
  target_user_id!: string;

  constructor(entity: AbstractEntity & FollowEntity) {
    super(entity);
    this.id = entity.id;
    this.source_user_id = entity.source_user_id;
    this.target_user_id = entity.target_user_id;
    this.created_at = entity.created_at;
    this.updated_at = entity.updated_at;
  }
}
