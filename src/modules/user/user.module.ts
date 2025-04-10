import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity.ts';
import { UserService } from './user.service.ts';
import { UserController } from './user.controller.ts';
import { UserRepository } from './user.repository.ts';
import { FollowService } from '../follows/follow.service.ts';
import { FollowRepository } from '../follows/follow.repository.ts';
import { FollowEntity } from '../follows/follow.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
  controllers: [UserController],
  exports: [UserRepository, UserService],
  providers: [UserRepository, UserService, FollowService, FollowRepository],
})
export class UserModule {}
