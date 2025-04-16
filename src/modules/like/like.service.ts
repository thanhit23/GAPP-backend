import { BadRequestException, Injectable } from '@nestjs/common';

import { LikeEntity } from './like.entity';
import { UnLikeDto } from './dtos/un-like.dto.ts';
import { LikeRepository } from './like.repository';
import { PostService } from '../post/post.service.ts';
import { CreateLikeDto } from './dtos/create-like.dto';
import { CommentService } from '../../modules/comment/comment.service.ts';

@Injectable()
export class LikeService {
  constructor(
    private likeRepository: LikeRepository,
    private commentService: CommentService,
    private postService: PostService,
  ) {}

  async like(entityDto: CreateLikeDto): Promise<LikeEntity> {
    const entity = await this.likeRepository.checkLike(entityDto);

    if (entity) {
      throw new BadRequestException('You have already liked this post');
    }

    if (entityDto.postId) {
      await this.postService.getSinglePost(entityDto.postId);
    }

    if (entityDto.commentId) {
      await this.commentService.getById(entityDto.commentId);
    }

    return await this.likeRepository.like(entityDto);
  }

  async unLike(payload: UnLikeDto): Promise<boolean> {
    const entity = await this.likeRepository.checkLike(payload);

    if (!entity) {
      throw new BadRequestException('You have not liked this post');
    }

    return await this.likeRepository.unLike(payload);
  }
}
