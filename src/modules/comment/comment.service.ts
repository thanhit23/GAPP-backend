import { Injectable, NotFoundException } from '@nestjs/common';

import { CommentEntity } from './comment.entity';
import { CommentRepository, GetCommentCursor } from './comment.repository';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { GetCommentDto } from './dtos/get-comment.dto';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async creation(entityDto: CreateCommentDto): Promise<CommentEntity> {
    return await this.commentRepository.creation(entityDto);
  }

  async getByOptions(query: GetCommentDto): Promise<GetCommentCursor> {
    return await this.commentRepository.getByOptions(query);
  }

  async countCommentsByOptions(query: {
    post_id?: string;
    parent_id?: string;
  }): Promise<number> {
    return await this.commentRepository.countCommentsByOptions(query);
  }

  async update(id: string, entityDto: UpdateCommentDto): Promise<boolean> {
    const entity = await this.commentRepository.getById(id);

    if (!entity) {
      throw new NotFoundException('Comment not found');
    }

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
