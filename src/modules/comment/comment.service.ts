import { Injectable, NotFoundException } from '@nestjs/common';

import { CommentEntity } from './comment.entity';
import { CommentRepository, GetCommentCursor } from './comment.repository';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { GetCommentDto } from './dtos/get-comment.dto';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private postService: PostService,
  ) {}

  async creation(entityDto: CreateCommentDto): Promise<CommentEntity> {
    if (entityDto?.postId) {
      await this.postService.getSinglePost(entityDto.postId);
    }

    if (entityDto?.parentId) {
      await this.getById(entityDto.parentId);
    }

    return await this.commentRepository.creation(entityDto);
  }

  async getByOptions(query: GetCommentDto): Promise<GetCommentCursor> {
    return await this.commentRepository.getByOptions(query);
  }

  async countCommentsByOptions(query: {
    postId?: string;
    parentId?: string;
  }): Promise<number> {
    return await this.commentRepository.countCommentsByOptions(query);
  }

  async getById(id: string): Promise<CommentEntity> {
    const entity = await this.commentRepository.getById(id);

    if (!entity) {
      throw new NotFoundException('Comment not found');
    }

    return entity;
  }

  async update(id: string, entityDto: UpdateCommentDto): Promise<boolean> {
    const entity = await this.getById(id);

    await this.commentRepository.update(entity, entityDto);

    return true;
  }

  async delete(id: string): Promise<boolean> {
    const entity = await this.commentRepository.getById(id);

    if (!entity) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentRepository.delete(entity);

    return true;
  }
}
