import {
  Column,
  OneToMany,
  Entity,
  JoinColumn,
  type Relation,
  Unique,
} from 'typeorm';

import { FollowRelationDto } from './dtos/follow.dto.ts';
import { UserEntity } from '../user/user.entity.ts';
import { UseDto } from '../../decorators/use-dto.decorator.ts';
import { AbstractEntity } from '../../common/abstract.entity.ts';

@Entity({ name: 'follows' })
@UseDto(FollowRelationDto)
@Unique(['sourceUserId', 'targetUserId'])
export class FollowEntity extends AbstractEntity {
  @Column({ name: 'source_user_id', type: 'char' })
  sourceUserId!: string;

  @Column({ name: 'target_user_id', type: 'char' })
  targetUserId!: string;

  @OneToMany(() => UserEntity, (entity) => entity.followers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'target_user_id' })
  follower!: Relation<UserEntity>;

  @OneToMany(() => UserEntity, (entity) => entity.following, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'source_user_id' })
  following!: Relation<UserEntity>;
}
