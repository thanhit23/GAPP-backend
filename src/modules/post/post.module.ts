import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { PostController } from './post.controller.ts';
import { PostEntity } from './post.entity.ts';
import { PostService } from './post.service.ts';
import { PostRepository } from './post.repository.ts';
import { PostProcessor } from './post.processor.ts';
import { NewsFeedService } from '../news-feed/news-feed.service.ts';
import { UserService } from '../user/user.service.ts';
import { UserRepository } from '../user/user.repository.ts';
import { UserEntity } from '../user/user.entity.ts';
import { FollowService } from '../follows/follow.service.ts';
import { FollowRepository } from '../follows/follow.repository.ts';
import { FollowEntity } from '../follows/follow.entity.ts';
import { NewsFeedRepository } from '../news-feed/news-feed.repository.ts';
import { NewsFeedModule } from '../news-feed/news-feed.module.ts';
import { NewsFeedEntity } from '../news-feed/news-feed.entity.ts';
import { LikeService } from '../like/like.service.ts';
import { LikeRepository } from '../like/like.repository.ts';
import { LikeEntity } from '../like/like.entity.ts';
import { CommentService } from '../comment/comment.service.ts';
import { CommentRepository } from '../comment/comment.repository.ts';
import { CommentEntity } from '../comment/comment.entity.ts';

const InitBullModule = BullModule.registerQueue({
  name: 'post-queue',
});

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      NewsFeedEntity,
      FollowEntity,
      UserEntity,
      LikeEntity,
      CommentEntity,
    ]),
    forwardRef(() => NewsFeedModule),
    InitBullModule,
  ],
  providers: [
    PostService,
    PostRepository,
    PostProcessor,
    NewsFeedService,
    NewsFeedRepository,
    FollowService,
    FollowRepository,
    UserService,
    UserRepository,
    LikeService,
    LikeRepository,
    CommentService,
    CommentRepository,
  ],
  controllers: [PostController],
  exports: [PostService, PostRepository, TypeOrmModule, InitBullModule],
})
export class PostModule {}
