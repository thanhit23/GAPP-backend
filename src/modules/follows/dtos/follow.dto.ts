import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import { StringField } from '../../../decorators/field.decorators.ts';
import type { FollowEntity } from '../follow.entity.ts';
import type { AbstractEntity } from '../../../common/abstract.entity.ts';

export class FollowRelationDto extends AbstractDto {
  @StringField()
  sourceUserId!: string;

  @StringField()
  targetUserId!: string;

  constructor(entity: AbstractEntity & FollowEntity) {
    super(entity);
    this.id = entity.id;
    this.sourceUserId = entity.sourceUserId;
    this.targetUserId = entity.targetUserId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
