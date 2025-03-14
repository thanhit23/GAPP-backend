import { Injectable } from '@nestjs/common';

import { FollowEntity } from './follow.entity.ts';
import { UserService } from '../user/user.service.ts';
import { FollowRepository } from './follow.repository.ts';
import { CreateFollowDto } from './dtos/create-follow.dto.ts';
import { UpdateFollowDto } from './dtos/update-follow.dto.ts';
import { PageOptionsDto } from '../../common/dto/page-options.dto.ts';
import { FollowNotFoundException } from './exceptions/follow-not-found.exception.ts';

import type { PageDto } from '../../common/dto/page.dto.ts';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';

@Injectable()
export class FollowService {
  constructor(
    private followRepository: FollowRepository,
    private userService: UserService,
  ) {}

  async createFollow(newsFeedDto: CreateFollowDto): Promise<FollowEntity> {
    return await this.followRepository.createFollow(newsFeedDto);
  }

  async getAllFollow(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<FollowEntity>> {
    return await this.followRepository.getAllFollow(pageOptionsDto);
  }

  async getSingleFollow(id: string): Promise<FollowEntity> {
    const entity = await this.followRepository.getSingleFollow(id);

    if (!entity) {
      throw new FollowNotFoundException();
    }

    return entity;
  }

  async getFollowsByUser(id: string): Promise<FollowEntity[]> {
    return await this.followRepository.getFollowsByUser(id);
  }

  async updateFollow(
    id: string,
    updateFollowDto: UpdateFollowDto,
  ): Promise<boolean> {
    const targetUser = await this.userService.findOne({
      id: updateFollowDto.target_user_id,
    });

    if (!targetUser) {
      throw new UserNotFoundException('Target user does not exist');
    }

    const sourceUser = await this.userService.findOne({
      id: updateFollowDto.source_user_id,
    });

    if (!sourceUser) {
      throw new UserNotFoundException('Source user does not exist');
    }

    const entity = await this.followRepository.getSingleFollow(id);

    if (!entity) {
      throw new FollowNotFoundException();
    }

    await this.followRepository.updateFollow(entity, updateFollowDto);

    return true;
  }

  async deleteFollow(id: string): Promise<boolean> {
    const entity = await this.followRepository.getSingleFollow(id);

    if (!entity) {
      throw new FollowNotFoundException();
    }

    await this.followRepository.deleteFollow(entity);

    return true;
  }
}
