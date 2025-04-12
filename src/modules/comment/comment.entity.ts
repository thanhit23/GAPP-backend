import { Column, Entity, JoinColumn, ManyToOne, type Relation } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UserEntity } from '../user/user.entity';
import { PostEntity } from '../post/post.entity';
import { CommentRelationDto } from './dtos/comment.dto';
import { UseDto } from '../../decorators/use-dto.decorator';

@Entity({ name: 'comments' })
@UseDto(CommentRelationDto)
export class CommentEntity extends AbstractEntity {
  @Column({ type: 'char' })
  user_id!: string;

  @Column({ type: 'char', nullable: true })
  post_id?: string;

  @Column({ type: 'char', nullable: true })
  parent_id?: string;

  @Column({ type: 'varchar', length: 225 })
  content!: string;

  @Column({ type: 'int', default: 0 })
  total_likes!: number;

  @Column({ type: 'int', default: 0 })
  total_replies!: number;

  @ManyToOne(() => PostEntity, (entity) => entity.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post?: Relation<PostEntity>;

  @ManyToOne(() => CommentEntity, (entity) => entity.parent_id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: Relation<CommentEntity>;

  @ManyToOne(() => UserEntity, (entity) => entity.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: Relation<UserEntity>;
}
