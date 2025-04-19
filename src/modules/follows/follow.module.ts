import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FollowEntity } from './follow.entity';
import { FollowService } from './follow.service';
import { FollowerController } from './follow.controller';
import { FollowRepository } from './follow.repository';
import { UserEntity } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity]), UserModule],
  providers: [UserService, FollowService, FollowRepository],
  controllers: [FollowerController],
})
export class FollowModule {}
