import { Injectable } from '@nestjs/common';
import type { FindOptionsWhere } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto.ts';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';
import { UserRegisterDto } from '../auth/dto/user-register.dto.ts';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto.ts';
import { UserEntity } from './user.entity.ts';
import { ExistedException } from '../../exceptions/existed.exception.ts';
import { UserRepository } from './user.repository.ts';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOne(findData);
  }

  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const userEmailExits = await this.userRepository.findByOption({
      email: userRegisterDto.email,
    });

    if (userEmailExits) {
      throw new ExistedException('User already exists');
    }

    const userExits = await this.userRepository.findByOption({
      username: userRegisterDto.username,
    });

    if (userExits) {
      throw new ExistedException('Username already exists');
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
}
