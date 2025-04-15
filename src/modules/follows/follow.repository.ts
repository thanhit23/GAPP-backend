import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'typeorm-transactional';

import { FollowEntity } from './follow.entity.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import { UserRepository } from '../user/user.repository.ts';
import { FollowUserDto } from './dtos/create-follow.dto.ts';
import { PageOptionsDto } from '../../common/dto/page-options.dto.ts';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';

@Injectable()
export class FollowRepository {
  constructor(
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
    private userRepository: UserRepository,
  ) {}

  @Transactional()
  async createFollow(followDto: FollowUserDto): Promise<FollowEntity> {
    const sourceUser = await this.userRepository.getUser(
      followDto.sourceUserId,
    );

    const targeUser = await this.userRepository.getUser(followDto.targetUserId);

    if (!targeUser || !sourceUser) {
      throw new UserNotFoundException();
    }

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

  async getFollowersByUserId(userId: string): Promise<FollowEntity[]> {
    return await this.followRepository
      .createQueryBuilder('follow')
      .select('follow.targetUserId', 'target_user_id')
      .where('follow.sourceUserId = :userId', { userId })
      .getRawMany();
  }

  async getCountFollowersByUserId(userId: string): Promise<number> {
    return await this.followRepository
      .createQueryBuilder('follow')
      .where('follow.sourceUserId = :userId', { userId })
      .getCount();
  }

  async getFollowing(userId: string): Promise<FollowEntity[]> {
    return await this.followRepository
      .createQueryBuilder('follow')
      .select('follow.sourceUserId')
      .where('follow.targetUserId = :userId', { userId })
      .getMany();
  }

  async unfollow(entity: FollowEntity): Promise<void> {
    await this.followRepository.remove(entity);
  }
}
