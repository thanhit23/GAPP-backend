import { Injectable } from '@nestjs/common';
import type { FindOptionsWhere } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto.ts';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';
import { UserRegisterDto } from '../auth/dto/user-register.dto.ts';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto.ts';
import { UserEntity } from './user.entity.ts';
import { ExistedException } from '../../exceptions/existed.exception.ts';
import { UserRepository } from './user.repository.ts';
import { FollowService } from '../follows/follow.service.ts';
import { UpdateUserDto } from './dtos/user-update.dto.ts';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followService: FollowService,
  ) {}

  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOne(findData);
  }

  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const userEmailExits = await this.userRepository.findByOption({
      email: userRegisterDto.email,
    });

    if (userEmailExits) {
      throw new ExistedException({
        type: 'email',
        message: 'Email already exists',
      });
    }

    const userExits = await this.userRepository.findByOption({
      username: userRegisterDto.username,
    });

    if (userExits) {
      throw new ExistedException({
        type: 'username',
        message: 'Username already exists',
      });
    }

    return await this.userRepository.createUser(userRegisterDto);
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    return await this.userRepository.getUsers(pageOptionsDto);
  }

  async getUser(userId: string): Promise<UserEntity | null> {
    const userEntity = await this.userRepository.getUser(userId);

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity;
  }

  async getUserByUsername(
    username: string,
  ): Promise<(UserEntity & { countFollowers: number }) | null> {
    const userEntity = await this.userRepository.getUserByUsername(username);

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    const countFollowers = await this.followService.getCountFollowersByUserId(
      userEntity.id,
    );

    return {
      ...userEntity,
      countFollowers,
    };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const userEntity = await this.userRepository.getUser(id);

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    await this.userRepository.updateUser(userEntity, updateUserDto);

    return true;
  }
}
