import Redis from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';

import { NewsFeedEntity } from './news-feed.entity.ts';
import { NewsFeedRepository } from './news-feed.repository.ts';
import { PostService } from '../post/post.service.ts';
import { CreateNewsFeedDto } from './dtos/create-news-feed.dto.ts';
import { UpdateNewsFeedDto } from './dtos/update-news-feed.dto.ts';
import { NewsFeedPageOptionsDto } from './dtos/news-feed-page-options.dto.ts';
import { NewsFeedNotFoundException } from './exceptions/news-feed-not-found.exception.ts';
import { PageDto } from '../../common/dto/page.dto.ts';

@Injectable()
export class NewsFeedService {
  constructor(
    private postService: PostService,
    private newsFeedRepository: NewsFeedRepository,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async creation(
    newsFeedDto: CreateNewsFeedDto & { userId: string },
  ): Promise<NewsFeedEntity> {
    await this.postService.getSinglePost(newsFeedDto.postId);

    return await this.newsFeedRepository.creation(newsFeedDto);
  }

  async deleteRedisKeysByPattern(match: string) {
    const stream = this.redisClient.scanStream({ match });

    stream.on('data', async (keys: string[]) => {
      if (keys.length) {
        await this.redisClient.del(...keys);
      }
    });

    stream.on('end', () => {
      console.log('All matching keys deleted');
    });
  }

  async getNewsFeedList(
    userId: string,
    pageOptionsDto: NewsFeedPageOptionsDto,
  ): Promise<PageDto<NewsFeedEntity>> {
    const key = `news_feed:${userId}:*`;

    const keys = await this.redisClient.keys(key);

    const postIds = keys.map((key) => key.split(':').pop() as string);

    const nonExistentPostIds =
      await this.newsFeedRepository.findNonExistentPostIds(postIds);

    const postEntity = nonExistentPostIds.map((postId) => ({
      postId,
      userId,
    }));

    await this.newsFeedRepository.saveNewsFeed(postEntity);

    await this.deleteRedisKeysByPattern(key);

    return await this.newsFeedRepository.getNewsFeedList(
      userId,
      pageOptionsDto,
    );
  }

  async getSingleNewsFeed(id: string): Promise<NewsFeedEntity> {
    const entity = await this.newsFeedRepository.getSingleNewsFeed(id);

    if (!entity) {
      throw new NewsFeedNotFoundException();
    }

    return entity;
  }

  async updateNewsFeed(
    id: string,
    updateNewsFeedDto: UpdateNewsFeedDto,
  ): Promise<boolean> {
    const entity = await this.newsFeedRepository.getSingleNewsFeed(id);

    if (!entity) {
      throw new NewsFeedNotFoundException();
    }

    await this.postService.getSinglePost(updateNewsFeedDto.postId);

    await this.newsFeedRepository.updateNewsFeed(entity, updateNewsFeedDto);

    return true;
  }

  async deleteNewsFeed(id: string): Promise<boolean> {
    const entity = await this.newsFeedRepository.getSingleNewsFeed(id);

    if (!entity) {
      throw new NewsFeedNotFoundException();
    }

    await this.newsFeedRepository.deleteNewsFeed(entity);

    return true;
  }
}
