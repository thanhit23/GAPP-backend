import { In, type Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'typeorm-transactional';

import { NewsFeedEntity } from './news-feed.entity.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import { NewsFeedPageOptionsDto } from './dtos/news-feed-page-options.dto.ts';
import { CreateNewsFeedDto } from './dtos/create-news-feed.dto.ts';
import { UpdateNewsFeedDto } from './dtos/update-news-feed.dto.ts';

type NewsFeedDto = CreateNewsFeedDto & { user_id: string };

@Injectable()
export class NewsFeedRepository {
  constructor(
    @InjectRepository(NewsFeedEntity)
    private newsFeedRepository: Repository<NewsFeedEntity>,
  ) {}

  @Transactional()
  async createNewsFeed(
    newsFeedDto: CreateNewsFeedDto & { user_id: string },
  ): Promise<NewsFeedEntity> {
    const entity = this.newsFeedRepository.create(newsFeedDto);

    await this.saveNewsFeed(entity);

    return entity;
  }

  @Transactional()
  async saveNewsFeed(newsFeedDto: NewsFeedDto | NewsFeedDto[]): Promise<void> {
    const dataToSave = Array.isArray(newsFeedDto) ? newsFeedDto : [newsFeedDto];
    await this.newsFeedRepository.save(dataToSave);
  }

  async getNewsFeedList(
    user_id: string,
    pageOptionsDto: NewsFeedPageOptionsDto,
  ): Promise<PageDto<NewsFeedEntity>> {
    const queryBuilder = this.newsFeedRepository
      .createQueryBuilder('news_feed')
      .leftJoinAndSelect('news_feed.post', 'post')
      .leftJoinAndSelect('post.user', 'user')
      .where('news_feed.user_id = :user_id', { user_id })
      .orderBy('news_feed.updatedAt', 'DESC');

    const [data, meta] = await queryBuilder.paginate(pageOptionsDto);

    return { data, meta };
  }

  async findNonExistentPostIds(postIds: string[]): Promise<string[]> {
    const existingPosts = await this.newsFeedRepository.find({
      where: { post_id: In(postIds) },
      select: ['post_id'],
    });

    const existingIds = new Set(existingPosts.map((post) => post.post_id));

    return postIds.filter((id) => !existingIds.has(id));
  }

  async getSingleNewsFeed(id: string): Promise<NewsFeedEntity | null> {
    const queryBuilder = this.newsFeedRepository
      .createQueryBuilder('news_feed')
      .where('news_feed.id = :id', { id });

    return await queryBuilder.getOne();
  }

  async getNewsFeedByField(
    field: 'user_id' | 'post_id',
    value: string,
  ): Promise<NewsFeedEntity[]> {
    return await this.newsFeedRepository
      .createQueryBuilder('news_feed')
      .where(`news_feed.${field} = :value`, { value })
      .getRawMany();
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
