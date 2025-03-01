import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto.ts';
import { UserRegisterDto } from '../auth/dto/user-register.dto.ts';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto.ts';
import { UserEntity } from './user.entity.ts';

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
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere('user.username = :username', {
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
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const [data, meta] = await queryBuilder.paginate(pageOptionsDto);

    return { data, meta };
  }

  async getUser(userId: Uuid): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    return await queryBuilder.getOne();
  }
}
