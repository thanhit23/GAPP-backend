import _ from 'lodash';
import { In, type Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'typeorm-transactional';

import { NewsFeedEntity } from './news-feed.entity.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import { NewsFeedPageOptionsDto } from './dtos/news-feed-page-options.dto.ts';
import { CreateNewsFeedDto } from './dtos/create-news-feed.dto.ts';
import { UpdateNewsFeedDto } from './dtos/update-news-feed.dto.ts';
import { LikeRepository } from '../like/like.repository';
import { LikeEntity } from '../../modules/like/like.entity.ts';

type NewsFeedDto = CreateNewsFeedDto & { userId: string };

@Injectable()
export class NewsFeedRepository {
  constructor(
    @InjectRepository(NewsFeedEntity)
    private newsFeedRepository: Repository<NewsFeedEntity>,
    private likeRepository: LikeRepository,
  ) {}

  @Transactional()
  async creation(
    newsFeedDto: CreateNewsFeedDto & { userId: string },
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
    userId: string,
    pageOptionsDto: NewsFeedPageOptionsDto,
  ): Promise<PageDto<NewsFeedEntity>> {
    let listPostLiked: LikeEntity[] = [];

    const queryBuilder = this.newsFeedRepository
      .createQueryBuilder('news_feed')
      .leftJoin('news_feed.post', 'post')
      .leftJoin('post.user', 'user')
      .select([
        'news_feed',
        'post',
        'user.id',
        'user.username',
        'user.email',
        'user.avatar',
      ])
      .where('news_feed.user_id = :userId', { userId })
      .groupBy('news_feed.id, post.id, user.id')
      .orderBy('news_feed.updatedAt', 'DESC');

    const [data, meta] = await queryBuilder.paginate(pageOptionsDto);

    const postIds = data.map((item) => item.postId);

    if (!_.isEmpty(postIds)) {
      listPostLiked = await this.likeRepository.getListPostLiked({
        userId,
        postIds,
      });
    }

    const dataList = data.map((item) => {
      const is_liked = listPostLiked.some(
        (like) => like.postId === item.postId,
      );

      return {
        ...item,
        post: {
          is_liked,
          ...item.post,
        },
      };
    });

    return { data: dataList, meta };
  }

  async findNonExistentPostIds(postIds: string[]): Promise<string[]> {
    const existingPosts = await this.newsFeedRepository.find({
      where: { postId: In(postIds) },
      select: ['postId'],
    });

    const existingIds = new Set(existingPosts.map((post) => post.postId));

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
