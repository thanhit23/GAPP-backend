import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { LikeEntity } from './like.entity';
import { PostEntity } from '../post/post.entity';
import { UnLikeDto } from './dtos/un-like.dto.ts';
import { CreateLikeDto } from './dtos/create-like.dto';
import { CommentEntity } from '../comment/comment.entity';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(LikeEntity)
    private likeRepository: Repository<LikeEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  @Transactional()
  async like(entityDto: CreateLikeDto): Promise<LikeEntity> {
    const entity = await this.likeRepository.create(entityDto);

    await this.likeRepository.save(entity);

    if (entity?.postId) {
      await this.postRepository.increment(
        { id: entity.postId },
        'totalLikes',
        1,
      );
    }

    if (entity?.commentId) {
      await this.commentRepository.increment(
        { id: entity.commentId },
        'totalLikes',
        1,
      );
    }

    return entity;
  }

  async checkLike(
    entityDto: Partial<CreateLikeDto> & { id?: string },
  ): Promise<LikeEntity | null> {
    const entity = await this.likeRepository.findOne({
      where: { ...entityDto },
    });

    return entity;
  }

  async getListPostLiked(params: {
    userId: string;
    postIds: string[];
  }): Promise<LikeEntity[]> {
    return await this.likeRepository
      .createQueryBuilder('likes')
      .where('likes.userId = :userId', { userId: params.userId })
      .where('likes.postId IN (:...postIds)', { postIds: params.postIds })
      .select(['likes.postId'])
      .getMany();
  }

  async getListCommentLiked(params: {
    userId: string;
    commentIds: string[];
  }): Promise<LikeEntity[]> {
    return await this.likeRepository
      .createQueryBuilder('likes')
      .where('likes.userId = :user_id', { user_id: params.userId })
      .where('likes.commentId IN (:...commentIds)', {
        commentIds: params.commentIds,
      })
      .select(['likes.commentId'])
      .getMany();
  }

  @Transactional()
  async unLike(payload: UnLikeDto): Promise<boolean> {
    const entity = await this.likeRepository.findOne({ where: payload });

    if (!entity) {
      throw new NotFoundException('Like not found');
    }

    if (entity.postId) {
      await this.postRepository.decrement(
        { id: entity.postId },
        'totalLikes',
        1,
      );
    }

    if (entity.commentId) {
      await this.commentRepository.decrement(
        { id: entity.commentId },
        'totalLikes',
        1,
      );
    }

    await this.likeRepository.remove(entity);

    return true;
  }
}
