import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { PostEntity } from '../post/post.entity';
import { PostModule } from '..//post/post.module';
import { LikeRepository } from '../like/like.repository';
import { FollowRepository } from '../follows/follow.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, PostEntity]), PostModule],
  providers: [
    CommentService,
    CommentRepository,
    LikeRepository,
    FollowRepository,
    UserRepository,
  ],
  controllers: [CommentController],
})
export class CommentModule {}
