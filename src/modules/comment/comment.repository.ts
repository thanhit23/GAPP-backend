import _ from 'lodash';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { PostEntity } from '../post/post.entity';
import { GetCommentDto } from './dtos/get-comment.dto';

export interface GetCommentCursor {
  data: CommentEntity[];
  meta: {
    hasMore: boolean;
    total: number;
  };
}

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  @Transactional()
  async creation(entityDto: CreateCommentDto): Promise<CommentEntity> {
    const entity = this.commentRepository.create(entityDto);

    await this.commentRepository.save(entity);

    if (entity?.post_id) {
      await this.postRepository.increment(
        { id: entity.post_id },
        'total_comments',
        1,
      );
    }

    if (entity?.parent_id) {
      await this.commentRepository.increment(
        { id: entity.parent_id },
        'total_comments',
        1,
      );
    }

    return entity;
  }

  async getByOptions(query: GetCommentDto): Promise<GetCommentCursor> {
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.user', 'user');

    if (query?.post_id) {
      queryBuilder.where('comment.post_id = :post_id', {
        post_id: query.post_id,
      });
    }

    if (query?.parent_id) {
      queryBuilder.where('comment.parent_id = :parent_id', {
        parent_id: query.parent_id,
      });
    }

    if (query?.after) {
      queryBuilder.andWhere(
        `(
        comment.created_at < (SELECT c2.created_at FROM comments AS c2 WHERE c2.id = :after)
        OR (
          comment.created_at = (SELECT c3.created_at FROM comments AS c3 WHERE c3.id = :after)
          AND comment.id < :after
        )
      )`,
        { after: query.after },
      );
    }

    queryBuilder
      .select([
        'comment',
        'user.id',
        'user.name',
        'user.username',
        'user.avatar',
      ])
      .orderBy('comment.created_at', 'DESC')
      .addOrderBy('comment.id', 'DESC');

    const limit = query.limit || 10;
    queryBuilder.take(limit + 1);

    const data = await queryBuilder.getMany();

    const total = await queryBuilder
      .where('comment.post_id = :post_id', {
        post_id: query.post_id,
      })
      .getCount();

    const hasMore = data.length > limit;

    if (hasMore) {
      data.pop();
    }

    return {
      data,
      meta: {
        hasMore,
        total,
      },
    };
  }

  async countCommentsByOptions(query: {
    post_id?: string;
    parent_id?: string;
  }): Promise<number> {
    const queryBuilder = this.commentRepository.createQueryBuilder('comment');

    if (query.post_id) {
      queryBuilder.where('comment.post_id = :post_id', {
        post_id: query.post_id,
      });
    }

    if (query.parent_id) {
      queryBuilder.where('comment.parent_id = :parent_id', {
        parent_id: query.parent_id,
      });
    }

    return await queryBuilder.getCount();
  }

  async getById(id: string): Promise<CommentEntity | null> {
    return await this.commentRepository.findOne({
      where: { id },
    });
  }

  async update(
    entity: CommentEntity,
    entityDto: UpdateCommentDto,
  ): Promise<void> {
    const newComment = this.commentRepository.merge(entity, entityDto);

    await this.commentRepository.save(newComment);
  }

  async delete(entity: CommentEntity): Promise<void> {
    if (entity?.post_id) {
      await this.postRepository.decrement(
        { id: entity.post_id },
        'total_comments',
        1,
      );
    }

    if (entity?.parent_id) {
      await this.commentRepository.decrement(
        { id: entity.parent_id },
        'total_comments',
        1,
      );
    }

    await this.commentRepository.remove(entity);
  }
}
