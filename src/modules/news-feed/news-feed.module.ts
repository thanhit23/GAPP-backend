import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsFeedEntity]),
    forwardRef(() => PostModule),
    BullModule.registerQueue({
      name: 'post-queue',
    }),
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
  ],
  controllers: [NewsFeedController],
  exports: [NewsFeedService, NewsFeedRepository],
})
export class NewsFeedModule {}
