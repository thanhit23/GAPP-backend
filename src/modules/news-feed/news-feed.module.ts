import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { NewsFeedEntity } from './news-feed.entity.ts';
import { NewsFeedService } from './news-feed.service.ts';
import { NewsFeedController } from './news-feed.controller.ts';
import { NewsFeedRepository } from './news-feed.repository.ts';
import { FollowService } from '../follows/follow.service.ts';
import { FollowRepository } from '../follows/follow.repository.ts';
import { UserService } from '../user/user.service.ts';
import { UserRepository } from '../user/user.repository.ts';
import { PostRepository } from '../post/post.repository.ts';
import { PostService } from '../post/post.service.ts';
import { PostModule } from '../post/post.module.ts';
import { RedisModule } from '../redis/redis.module.ts';
import { LikeService } from '../like/like.service.ts';
import { LikeRepository } from '../like/like.repository.ts';
import { LikeEntity } from '../like/like.entity.ts';
import { CommentService } from '../comment/comment.service.ts';
import { CommentRepository } from '../comment/comment.repository.ts';
import { CommentEntity } from '../comment/comment.entity.ts';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsFeedEntity, LikeEntity, CommentEntity]),
    forwardRef(() => PostModule),
    BullModule.registerQueue({
      name: 'post-queue',
    }),
    RedisModule,
  ],
  providers: [
    NewsFeedService,
    NewsFeedRepository,
    PostService,
    PostRepository,
    FollowService,
    FollowRepository,
    UserService,
    UserRepository,
    LikeService,
    LikeRepository,
    CommentService,
    CommentRepository,
  ],
  controllers: [NewsFeedController],
  exports: [NewsFeedService, NewsFeedRepository],
})
export class NewsFeedModule {}
