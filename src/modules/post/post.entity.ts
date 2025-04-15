import { OneToMany, type Relation } from 'typeorm';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity.ts';
import { UseDto } from '../../decorators/use-dto.decorator.ts';
import { UserEntity } from '../user/user.entity.ts';
import { PostDto } from './dtos/post.dto.ts';
import { NewsFeedEntity } from '../news-feed/news-feed.entity.ts';
import { LikeEntity } from '../like/like.entity.ts';
import { CommentEntity } from '../comment/comment.entity.ts';

@Entity({ name: 'posts' })
@UseDto(PostDto)
export class PostEntity extends AbstractEntity {
  @Column({ type: 'char' })
  userId!: string;

  @Column({ nullable: true, type: 'varchar' })
  content!: string;

  @Column({ nullable: true, type: 'varchar' })
  image!: string;

  @Column({ name: 'total_likes', type: 'int', default: 0 })
  totalLikes!: number;

  @Column({ name: 'total_comments', type: 'int', default: 0 })
  totalComments!: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<UserEntity>;

  @OneToMany(() => NewsFeedEntity, (entity) => entity.post)
  newsfeed?: NewsFeedEntity[];

  @OneToMany(() => LikeEntity, (entity) => entity.post)
  likes?: LikeEntity[];

  @OneToMany(() => CommentEntity, (entity) => entity.post)
  comments?: CommentEntity[];
}
