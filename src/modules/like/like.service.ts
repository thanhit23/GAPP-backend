import { BadRequestException, Injectable } from '@nestjs/common';

import { LikeEntity } from './like.entity';
import { Unlike } from './dtos/un-like.dto.ts';
import { LikeRepository } from './like.repository';
import { PostService } from '../post/post.service.ts';
import { AddLike } from './dtos/create-like.dto';
import { CommentService } from '../../modules/comment/comment.service.ts';

@Injectable()
export class LikeService {
  constructor(
    private likeRepository: LikeRepository,
    private commentService: CommentService,
    private postService: PostService,
  ) {}

  async like(entityDto: AddLike): Promise<LikeEntity> {
    const entity = await this.likeRepository.isLiked(entityDto);

    if (entity) {
      throw new BadRequestException('You have already liked this post');
    }

    if (entityDto.postId) {
      await this.postService.getSinglePost(entityDto.postId, entityDto.userId!);
    }

    if (entityDto.commentId) {
      await this.commentService.getById(entityDto.commentId);
    }

    return await this.likeRepository.like(entityDto);
  }

  async unlike(payload: Unlike): Promise<boolean> {
    const entity = await this.likeRepository.isLiked(payload);

    if (!entity) {
      throw new BadRequestException('You have not liked this post');
    }

    return await this.likeRepository.unlike(payload);
  }
}
