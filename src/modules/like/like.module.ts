import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './like.entity';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { LikeRepository } from './like.repository';
import { PostEntity } from '../post/post.entity';
import { CommentEntity } from '../comment/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity, PostEntity, CommentEntity])],
  providers: [LikeService, LikeRepository],
  controllers: [LikeController],
})
export class LikeModule {}
