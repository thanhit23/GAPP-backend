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
import { FollowEntity } from '../follows/follow.entity.ts';
import { FollowRepository } from '../follows/follow.repository.ts';

type NewsFeedDto = CreateNewsFeedDto & { userId: string };

@Injectable()
export class NewsFeedRepository {
  constructor(
    @InjectRepository(NewsFeedEntity)
    private newsFeedRepository: Repository<NewsFeedEntity>,
    private likeRepository: LikeRepository,
    private followRepository: FollowRepository,
  ) {}

  @Transactional()
  async create(
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
    let listFollowed: FollowEntity[] = [];

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

    const userIds = data.map((item) => item.post.userId);

    if (!_.isEmpty(postIds)) {
      listPostLiked = await this.likeRepository.getListPostLiked({
        userId,
        postIds,
      });
    }

    if (!_.isEmpty(userIds)) {
      listFollowed = await this.followRepository.getListFollowing({
        userId,
        userIds,
      });
    }

    const dataList = data.map((item) => {
      const isLiked = listPostLiked.some((like) => like.postId === item.postId);

      const hasFollowed = listFollowed.some(
        (c) => c.targetUserId === item.post.userId,
      );

      return {
        ...item,
        post: {
          isLiked,
          hasFollowed,
          ...item.post,
        },
      };
    });

    return { data: dataList, meta };
  }

  async findNonExistentPostIds(
    postIds: string[],
    userId: string,
  ): Promise<string[]> {
    const existingPosts = await this.newsFeedRepository.find({
      where: { postId: In(postIds), userId },
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
