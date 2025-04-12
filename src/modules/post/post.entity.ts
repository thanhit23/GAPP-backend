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
  title!: string;

  @Column({ nullable: true, type: 'varchar' })
  description!: string;

  @Column({ nullable: true, type: 'varchar' })
  image!: string;

  @Column({ type: 'int', default: 0 })
  total_likes!: number;

  @Column({ type: 'int', default: 0 })
  total_comments!: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<UserEntity>;

  @OneToMany(() => NewsFeedEntity, (entity) => entity.user)
  newsfeed?: NewsFeedEntity[];

  @OneToMany(() => LikeEntity, (entity) => entity.post)
  likes?: LikeEntity[];

  @OneToMany(() => CommentEntity, (entity) => entity.post)
  comments?: CommentEntity[];
}
