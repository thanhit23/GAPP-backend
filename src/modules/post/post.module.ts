import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from './post.controller.ts';
import { PostEntity } from './post.entity.ts';
import { PostService } from './post.service.ts';
import { PostRepository } from './post.repository.ts';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  providers: [PostService, PostRepository],
  controllers: [PostController],
  exports: [PostService, PostRepository],
})
export class PostModule {}
