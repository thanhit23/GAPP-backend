import { Injectable } from '@nestjs/common';

import { FollowEntity } from './follow.entity.ts';
import { FollowRepository } from './follow.repository.ts';
import { FollowUserDto } from './dtos/create-follow.dto.ts';
import { PageOptionsDto } from '../../common/dto/page-options.dto.ts';
import { FollowNotFoundException } from './exceptions/follow-not-found.exception.ts';

import type { PageDto } from '../../common/dto/page.dto.ts';

@Injectable()
export class FollowService {
  constructor(private followRepository: FollowRepository) {}

  async createFollow(newsFeedDto: FollowUserDto): Promise<FollowEntity> {
    return await this.followRepository.createFollow(newsFeedDto);
  }

  async getPaginatedFollowers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<FollowEntity>> {
    return await this.followRepository.getPaginatedFollowers(pageOptionsDto);
  }

  async getFollower(id: string): Promise<FollowEntity> {
    const entity = await this.followRepository.getFollower(id);

    if (!entity) {
      throw new FollowNotFoundException();
    }

    return entity;
  }

  async getFollowersByUserId(id: string): Promise<FollowEntity[]> {
    return await this.followRepository.getFollowersByUserId(id);
  }

  async getCountFollowersByUserId(id: string): Promise<number> {
    return await this.followRepository.getCountFollowersByUserId(id);
  }

  async unfollow(id: string): Promise<boolean> {
    const entity = await this.followRepository.getFollower(id);

    if (!entity) {
      throw new FollowNotFoundException();
    }

    await this.followRepository.unfollow(entity);

    return true;
  }
}
