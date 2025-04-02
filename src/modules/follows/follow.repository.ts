import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'typeorm-transactional';

import { FollowEntity } from './follow.entity.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import { FollowUserDto } from './dtos/create-follow.dto.ts';
import { PageOptionsDto } from '../../common/dto/page-options.dto.ts';

@Injectable()
export class FollowRepository {
  constructor(
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
  ) {}

  @Transactional()
  async createFollow(followDto: FollowUserDto): Promise<FollowEntity> {
    const entity = this.followRepository.create(followDto);

    await this.followRepository.save(entity);

    return entity;
  }

  async getPaginatedFollowers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<FollowEntity>> {
    const queryBuilder = this.followRepository.createQueryBuilder('news_feed');

    const [data, meta] = await queryBuilder.paginate(pageOptionsDto);

    return { data, meta };
  }

  async getFollower(id: string): Promise<FollowEntity | null> {
    const queryBuilder = this.followRepository
      .createQueryBuilder('news_feed')
      .where('news_feed.id = :id', { id });

    return await queryBuilder.getOne();
  }

  async getFollowersByUserId(user_id: string): Promise<FollowEntity[]> {
    return await this.followRepository
      .createQueryBuilder('follow')
      .select('follow.target_user_id', 'target_user_id')
      .where('follow.source_user_id = :user_id', { user_id })
      .getRawMany();
  }

  async getFollowing(user_id: string): Promise<FollowEntity[]> {
    return await this.followRepository
      .createQueryBuilder('follow')
      .select('follow.source_user_id')
      .where('follow.target_user_id = :user_id', { user_id })
      .getMany();
  }

  async unfollow(entity: FollowEntity): Promise<void> {
    await this.followRepository.remove(entity);
  }
}
