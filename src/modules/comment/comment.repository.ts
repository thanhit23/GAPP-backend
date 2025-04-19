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
import { LikeRepository } from '../like/like.repository';
import { LikeEntity } from '../like/like.entity';
import { FollowRepository } from '../follows/follow.repository';
import { FollowEntity } from 'modules/follows/follow.entity';

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
    private likeRepository: LikeRepository,
    private followRepository: FollowRepository,
  ) {}

  @Transactional()
  async creation(entityDto: CreateCommentDto): Promise<CommentEntity> {
    const entity = this.commentRepository.create(entityDto);

    await this.commentRepository.save(entity);

    if (entity?.postId) {
      await this.postRepository.increment(
        { id: entity.postId },
        'totalComments',
        1,
      );
    }

    if (entity?.parentId) {
      await this.commentRepository.increment(
        { id: entity.parentId },
        'totalComments',
        1,
      );
    }

    return entity;
  }

  async getByOptions(
    query: GetCommentDto,
    userId: string,
  ): Promise<GetCommentCursor> {
    let listCommentLiked: LikeEntity[] = [];
    let listFollowed: FollowEntity[] = [];

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .innerJoin('comment.user', 'user');

    if (query?.postId) {
      queryBuilder.where('comment.postId = :postId', {
        postId: query.postId,
      });
    }

    if (query?.parentId) {
      queryBuilder.where('comment.parentId = :parentId', {
        parentId: query.parentId,
      });
    }

    if (query?.after) {
      queryBuilder.andWhere(
        `(
        comment.createdAt < (SELECT c2.created_at FROM comments AS c2 WHERE c2.id = :after)
        OR (
          comment.createdAt = (SELECT c3.created_at FROM comments AS c3 WHERE c3.id = :after)
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
        'user.bio',
        'user.totalFollowing',
        'user.totalFollower',
      ])
      .orderBy('comment.createdAt', 'DESC')
      .addOrderBy('comment.id', 'DESC');

    const limit = query.limit || 10;

    queryBuilder.take(limit + 1);

    const data = await queryBuilder.getMany();

    const hasMore = data.length > limit;

    const total = await queryBuilder
      .where('comment.post_id = :postId', {
        postId: query.postId,
      })
      .getCount();

    if (hasMore) {
      data.pop();
    }

    const commentIds = data.map((item) => item.id) as string[];

    const userIds = data.map((item) => item.userId) as string[];

    if (!_.isEmpty(commentIds)) {
      listCommentLiked = await this.likeRepository.getListCommentLiked({
        userId,
        commentIds,
      });
    }

    if (!_.isEmpty(userIds)) {
      listFollowed = await this.followRepository.getListFollowingLiked({
        userId,
        userIds,
      });
    }

    const dataList = data.map((item) => {
      const isLiked = listCommentLiked.some((c) => c.commentId === item.id);

      const hasFollowed = listFollowed.some(
        (c) => c.targetUserId === item.userId,
      );

      return {
        isLiked,
        hasFollowed,
        ...item,
      };
    });

    return {
      data: dataList,
      meta: {
        hasMore,
        total,
      },
    };
  }

  async countCommentsByOptions(query: {
    postId?: string;
    parentId?: string;
  }): Promise<number> {
    const queryBuilder = this.commentRepository.createQueryBuilder('comment');

    if (query?.postId) {
      queryBuilder.where('comment.post_id = :post_id', {
        post_id: query.postId,
      });
    }

    if (query?.parentId) {
      queryBuilder.where('comment.parent_id = :parent_id', {
        parent_id: query.parentId,
      });
    }

    return await queryBuilder.getCount();
  }

  async getById(id: string): Promise<CommentEntity | null> {
    return await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
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
    if (entity?.postId) {
      await this.postRepository.decrement(
        { id: entity.postId },
        'totalComments',
        1,
      );
    }

    if (entity?.parentId) {
      await this.commentRepository.decrement(
        { id: entity.parentId },
        'totalComments',
        1,
      );
    }

    await this.commentRepository.remove(entity);
  }
}
