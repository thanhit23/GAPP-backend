import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'typeorm-transactional';

import { NewsFeedEntity } from './news-feed.entity.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import { NewsFeedPageOptionsDto } from './dtos/news-feed-page-options.dto.ts';
import { CreateNewsFeedDto } from './dtos/create-news-feed.dto.ts';
import { UpdateNewsFeedDto } from './dtos/update-news-feed.dto.ts';

@Injectable()
export class NewsFeedRepository {
  constructor(
    @InjectRepository(NewsFeedEntity)
    private newsFeedRepository: Repository<NewsFeedEntity>,
  ) {}

  @Transactional()
  async createNewsFeed(
    newsFeedDto: CreateNewsFeedDto,
  ): Promise<NewsFeedEntity> {
    const entity = this.newsFeedRepository.create(newsFeedDto);

    await this.newsFeedRepository.save(entity);

    return entity;
  }

  async getAllNewsFeed(
    pageOptionsDto: NewsFeedPageOptionsDto,
  ): Promise<PageDto<NewsFeedEntity>> {
    const queryBuilder =
      this.newsFeedRepository.createQueryBuilder('news_feed');

    const [data, meta] = await queryBuilder.paginate(pageOptionsDto);

    return { data, meta };
  }

  async getSingleNewsFeed(id: Uuid): Promise<NewsFeedEntity | null> {
    const queryBuilder = this.newsFeedRepository
      .createQueryBuilder('news_feed')
      .where('news_feed.id = :id', { id });

    return await queryBuilder.getOne();
  }

  async updateNewsFeed(
    entity: NewsFeedEntity,
    updateNewsFeedDto: UpdateNewsFeedDto,
  ): Promise<void> {
    const newsFeed = this.newsFeedRepository.merge(entity, updateNewsFeedDto);

    await this.newsFeedRepository.save(newsFeed);
  }

  async deleteNewsFeed(entity: NewsFeedEntity): Promise<void> {
    await this.newsFeedRepository.remove(entity);
  }
}
