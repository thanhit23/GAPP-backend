import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FollowEntity } from './follow.entity.ts';
import { FollowService } from './follow.service.ts';
import { FollowerController } from './follow.controller.ts';
import { FollowRepository } from './follow.repository.ts';
import { UserModule } from '../user/user.module.ts';
import { UserService } from '../user/user.service.ts';

@Module({
  imports: [TypeOrmModule.forFeature([FollowEntity]), UserModule],
  providers: [FollowService, FollowRepository, UserService],
  controllers: [FollowerController],
})
export class FollowModule {}
