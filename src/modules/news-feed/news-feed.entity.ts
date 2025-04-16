import { Column, Entity, JoinColumn, ManyToOne, type Relation } from 'typeorm';

import { NewsFeedDto } from './dtos/news-feed.dto.ts';
import { UserEntity } from '../user/user.entity.ts';
import { PostEntity } from '../post/post.entity.ts';
import { UseDto } from '../../decorators/use-dto.decorator.ts';
import { AbstractEntity } from '../../common/abstract.entity.ts';

@Entity({ name: 'news_feed' })
@UseDto(NewsFeedDto)
export class NewsFeedEntity extends AbstractEntity {
  @Column({ name: 'user_id', type: 'char' })
  userId!: string;

  @Column({ name: 'post_id', type: 'char' })
  postId!: string;

  @ManyToOne(() => UserEntity, (entity) => entity.newsfeed, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<UserEntity>;

  @ManyToOne(() => PostEntity, (entity) => entity.newsfeed, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post!: Relation<PostEntity>;
}
