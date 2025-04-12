import { Column, Entity, JoinColumn, ManyToOne, type Relation } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UserEntity } from '../user/user.entity';
import { PostEntity } from '../post/post.entity';

@Entity({ name: 'likes' })
export class LikeEntity extends AbstractEntity {
  @Column({ type: 'char' })
  user_id!: string;

  @Column({ type: 'char', nullable: true })
  post_id?: string;

  @Column({ type: 'char', nullable: true })
  comment_id?: string;

  @ManyToOne(() => UserEntity, (entity) => entity.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @ManyToOne(() => PostEntity, (entity) => entity.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post?: Relation<PostEntity>;

  @JoinColumn({ name: 'user_id' })
  user?: Relation<UserEntity>;
}
