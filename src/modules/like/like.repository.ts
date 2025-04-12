import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { LikeEntity } from './like.entity';
import { CreateLikeDto } from './dtos/create-like.dto';
import { PostEntity } from '../post/post.entity';
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
    const entity = this.likeRepository.create(entityDto);

    await this.likeRepository.save(entity);

    if (entity?.post_id) {
      await this.postRepository.increment(
        { id: entity.post_id },
        'total_likes',
        1,
      );
    }

    if (entity?.comment_id) {
      await this.commentRepository.increment(
        { id: entity.comment_id },
        'total_likes',
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
    user_id: string;
    post_ids: string[];
  }): Promise<LikeEntity[]> {
    return await this.likeRepository
      .createQueryBuilder('likes')
      .where('likes.user_id = :user_id', { user_id: params.user_id })
      .where('likes.post_id IN (:...post_ids)', { post_ids: params.post_ids })
      .select(['likes.post_id'])
      .getMany();
  }

  @Transactional()
  async unLike(id: string): Promise<void> {
    const entity = await this.likeRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException('Like not found');
    }

    if (entity.post_id) {
      await this.postRepository.decrement(
        { id: entity.post_id },
        'total_likes',
        1,
      );
    }

    if (entity.comment_id) {
      await this.commentRepository.decrement(
        { id: entity.comment_id },
        'total_likes',
        1,
      );
    }

    await this.likeRepository.delete(id);
  }
}
