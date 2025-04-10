import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto.ts';
import { UserRegisterDto } from '../auth/dto/user-register.dto.ts';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto.ts';
import { UserEntity } from './user.entity.ts';
import { UpdateUserDto } from './dtos/user-update.dto.ts';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  async findByOption(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    if (options.email) {
      queryBuilder.orWhere('users.email = :email', {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere('users.username = :username', {
        username: options.username,
      });
    }

    return await queryBuilder.getOne();
  }

  @Transactional()
  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = this.userRepository.create(userRegisterDto);

    await this.userRepository.save(user);

    return user;
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    const [data, meta] = await queryBuilder.paginate(pageOptionsDto);

    return { data, meta };
  }

  async getUser(userId: string): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    queryBuilder.where('users.id = :userId', { userId });

    return await queryBuilder.getOne();
  }

  async getUserByUsername(username: string): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .where('users.username = :username', { username });

    return await queryBuilder.getOne();
  }

  async updateUser(userEntity: UserEntity, updateUserDto: UpdateUserDto) {
    const newUser = this.userRepository.merge(userEntity, updateUserDto);

    await this.userRepository.save(newUser);
  }
}
