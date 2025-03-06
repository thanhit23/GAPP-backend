import { Injectable } from '@nestjs/common';

import { NewsFeedEntity } from './news-feed.entity.ts';
import { NewsFeedRepository } from './news-feed.repository.ts';

import { NewsFeedPageOptionsDto } from './dtos/news-feed-page-options.dto.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import { CreateNewsFeedDto } from './dtos/create-news-feed.dto.ts';
import { UpdateNewsFeedDto } from './dtos/update-news-feed.dto.ts';
import { NewsFeedNotFoundException } from './exceptions/news-feed-not-found.exception.ts';
import { PostService } from '../post/post.service.ts';

@Injectable()
export class NewsFeedService {
  constructor(
    private newsFeedRepository: NewsFeedRepository,
    private postService: PostService,
  ) {}

  async createNewsFeed(
    newsFeedDto: CreateNewsFeedDto,
  ): Promise<NewsFeedEntity> {
    return await this.newsFeedRepository.createNewsFeed(newsFeedDto);
  }

  async getAllNewsFeed(
    pageOptionsDto: NewsFeedPageOptionsDto,
  ): Promise<PageDto<NewsFeedEntity>> {
    return await this.newsFeedRepository.getAllNewsFeed(pageOptionsDto);
  }

  async getSingleNewsFeed(id: Uuid): Promise<NewsFeedEntity> {
    const entity = await this.newsFeedRepository.getSingleNewsFeed(id);

    if (!entity) {
      throw new NewsFeedNotFoundException();
    }

    return entity;
  }

  async updateNewsFeed(
    id: Uuid,
    updateNewsFeedDto: UpdateNewsFeedDto,
  ): Promise<boolean> {
    await this.postService.getSinglePost(updateNewsFeedDto.post_id);

    const entity = await this.newsFeedRepository.getSingleNewsFeed(id);

    if (!entity) {
      throw new NewsFeedNotFoundException();
    }

    await this.newsFeedRepository.updateNewsFeed(entity, updateNewsFeedDto);

    return true;
  }

  async deleteNewsFeed(id: Uuid): Promise<boolean> {
    const entity = await this.newsFeedRepository.getSingleNewsFeed(id);

    if (!entity) {
      throw new NewsFeedNotFoundException();
    }

    await this.newsFeedRepository.deleteNewsFeed(entity);

    return true;
  }
}
