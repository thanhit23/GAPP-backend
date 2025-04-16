import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LikeEntity } from './like.entity';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { LikeRepository } from './like.repository';
import { PostEntity } from '../post/post.entity';
import { PostService } from '../post/post.service';
import { PostRepository } from '../post/post.repository';
import { CommentEntity } from '../comment/comment.entity';
import { CommentService } from '../comment/comment.service';
import { CommentRepository } from '../comment/comment.repository';
import { PostModule } from '../../modules/post/post.module';
import { FollowRepository } from '../../modules/follows/follow.repository';
import { UserRepository } from '../../modules/user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeEntity, PostEntity, CommentEntity]),
    PostModule,
  ],
  providers: [
    LikeService,
    LikeRepository,
    PostService,
    PostRepository,
    CommentService,
    CommentRepository,
    FollowRepository,
    UserRepository,
  ],
  controllers: [LikeController],
})
export class LikeModule {}
