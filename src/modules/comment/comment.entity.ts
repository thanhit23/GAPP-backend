import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UserEntity } from '../user/user.entity';
import { PostEntity } from '../post/post.entity';
import { CommentRelationDto } from './dtos/comment.dto';
import { UseDto } from '../../decorators/use-dto.decorator';

@Entity({ name: 'comments' })
@UseDto(CommentRelationDto)
export class CommentEntity extends AbstractEntity {
  @Column({ name: 'user_id', type: 'char' })
  userId!: string;

  @Column({ name: 'post_id', type: 'char', nullable: true })
  @Index('IDX_COMMENT_POST_ID')
  postId?: string;

  @Column({ name: 'parent_id', type: 'char', nullable: true })
  @Index('IDX_COMMENT_PARENT_ID')
  parentId?: string;

  @Column({ type: 'varchar', length: 225 })
  content!: string;

  @Column({ name: 'total_likes', type: 'int', default: 0 })
  totalLikes!: number;

  @Column({ name: 'total_replies', type: 'int', default: 0 })
  totalReplies!: number;

  @ManyToOne(() => PostEntity, (entity) => entity.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post?: Relation<PostEntity>;

  @ManyToOne(() => CommentEntity, (entity) => entity.parentId, {
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
