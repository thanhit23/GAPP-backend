import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity.ts';
import { UserService } from './user.service.ts';
import { UserController } from './user.controller.ts';
import { UserRepository } from './user.repository.ts';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  exports: [UserRepository, UserService],
  providers: [UserRepository, UserService],
})
export class UserModule {}
