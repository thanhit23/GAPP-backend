import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'typeorm-transactional';

import { FollowEntity } from './follow.entity.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import { CreateFollowDto } from './dtos/create-follow.dto.ts';
import { UpdateFollowDto } from './dtos/update-follow.dto.ts';
import { PageOptionsDto } from '../../common/dto/page-options.dto.ts';

@Injectable()
export class FollowRepository {
  constructor(
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
  ) {}

  @Transactional()
  async createFollow(followDto: CreateFollowDto): Promise<FollowEntity> {
    const entity = this.followRepository.create(followDto);

    await this.followRepository.save(entity);

    return entity;
  }

  async getAllFollow(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<FollowEntity>> {
    const queryBuilder = this.followRepository.createQueryBuilder('news_feed');

    const [data, meta] = await queryBuilder.paginate(pageOptionsDto);

    return { data, meta };
  }

  async getSingleFollow(id: string): Promise<FollowEntity | null> {
    const queryBuilder = this.followRepository
      .createQueryBuilder('news_feed')
      .where('news_feed.id = :id', { id });

    return await queryBuilder.getOne();
  }

  async getFollowsByUser(user_id: string): Promise<FollowEntity[]> {
    return await this.followRepository
      .createQueryBuilder('follow')
      .select('follow.target_user_id', 'target_user_id')
      .where('follow.source_user_id = :user_id', { user_id })
      .getRawMany();
  }

  async getFollowsByFollower(user_id: string): Promise<FollowEntity[]> {
    return await this.followRepository
      .createQueryBuilder('follow')
      .select('follow.source_user_id')
      .where('follow.target_user_id = :user_id', { user_id })
      .getRawMany();
  }

  async updateFollow(
    entity: FollowEntity,
    updateFollowDto: UpdateFollowDto,
  ): Promise<void> {
    const follow = this.followRepository.merge(entity, updateFollowDto);

    await this.followRepository.save(follow);
  }

  async deleteFollow(entity: FollowEntity): Promise<void> {
    await this.followRepository.remove(entity);
  }
}
