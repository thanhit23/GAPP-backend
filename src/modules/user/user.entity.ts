import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity.ts';
import { UseDto } from '../../decorators/use-dto.decorator.ts';
import { PostEntity } from '../post/post.entity.ts';
import { NewsFeedEntity } from '../news-feed/news-feed.entity.ts';
import { UserDto } from './dtos/user.dto.ts';
import { FollowEntity } from '../follows/follow.entity.ts';
import { LikeEntity } from '../like/like.entity.ts';
import { CommentEntity } from '../comment/comment.entity.ts';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity {
  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  name!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  username!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  address!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  bio!: string | null;

  @Column({ name: 'total_following', type: 'int', default: 0 })
  totalFollowing!: number;

  @Column({ name: 'total_follower', type: 'int', default: 0 })
  totalFollower!: number;

  @OneToMany(() => PostEntity, (entity) => entity.user)
  posts?: PostEntity[];

  @OneToMany(() => NewsFeedEntity, (entity) => entity.user)
  newsfeed?: NewsFeedEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.sourceUserId)
  following?: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.targetUserId)
  followers?: FollowEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes?: LikeEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments?: CommentEntity[];
}
