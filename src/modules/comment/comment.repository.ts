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
    hasNextPage: boolean;
    nextCursor: {
      id: string;
      createdAt: string;
    } | null;
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
  async create(entityDto: CreateCommentDto): Promise<CommentEntity> {
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

    const queryBuilder = this.commentRepository.createQueryBuilder('comments');

    queryBuilder.leftJoinAndSelect('comments.user', 'user');

    if (query?.after) {
      queryBuilder.where(
        'comments.createdAt < (SELECT c2.created_at FROM comments AS c2 WHERE c2.id = :cursor)',
        { cursor: query.after },
      );
    }

    if (query?.postId) {
      queryBuilder.andWhere('comments.postId = :postId', {
        postId: query.postId,
      });
    }

    if (query?.parentId) {
      queryBuilder.andWhere('comments.parentId = :parentId', {
        parentId: query.parentId,
      });
    }

    queryBuilder
      .select([
        'comments',
        'user.id',
        'user.name',
        'user.username',
        'user.avatar',
        'user.bio',
        'user.totalFollowing',
        'user.totalFollower',
      ])
      .orderBy('comments.createdAt', 'DESC');

    const { data, pagination } = await queryBuilder.cursorPaginate({
      limit: Number(query.limit),
    });

    const commentIds = data.map((item: any) => item.id) as string[];

    const userIds = data.map((item: any) => item.userId) as string[];

    if (!_.isEmpty(commentIds)) {
      listCommentLiked = await this.likeRepository.getListCommentLiked({
        userId,
        commentIds,
      });
    }

    if (!_.isEmpty(userIds)) {
      listFollowed = await this.followRepository.getListFollowing({
        userId,
        userIds,
      });
    }

    const dataList = data.map((item: any) => {
      const isLiked = listCommentLiked.some((c) => c.commentId === item.id);

      const hasFollowed =
        item.userId === userId ||
        listFollowed.some((c) => c.targetUserId === item.userId);

      return {
        isLiked,
        hasFollowed,
        ...item,
      };
    });

    return {
      data: dataList,
      meta: pagination,
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
