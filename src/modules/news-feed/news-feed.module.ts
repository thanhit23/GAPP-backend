import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NewsFeedEntity } from './news-feed.entity.ts';
import { NewsFeedService } from './news-feed.service.ts';
import { NewsFeedController } from './news-feed.controller.ts';
import { NewsFeedRepository } from './news-feed.repository.ts';
import { PostModule } from '../post/post.module.ts';
import { PostService } from '../post/post.service.ts';

@Module({
  imports: [TypeOrmModule.forFeature([NewsFeedEntity]), PostModule],
  providers: [NewsFeedService, NewsFeedRepository, PostService],
  controllers: [NewsFeedController],
})
export class NewsFeedModule {}
