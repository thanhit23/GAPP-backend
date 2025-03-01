import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { PostEntity } from './post.entity.ts';
import { CreatePostDto } from './dtos/create-post.dto.ts';
import { CreatePostCommand } from './commands/create-post.command.ts';

import type { PostDto } from './dtos/post.dto.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import type { UpdatePostDto } from './dtos/update-post.dto.ts';
import type { PostPageOptionsDto } from './dtos/post-page-options.dto.ts';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private commandBus: CommandBus,
  ) {}

  @Transactional()
  createPost(userId: Uuid, createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.commandBus.execute<CreatePostCommand, PostEntity>(
      new CreatePostCommand(userId, createPostDto),
    );
  }

  async getAllPost(
    postPageOptionsDto: PostPageOptionsDto,
  ): Promise<PageDto<PostDto>> {
    const queryBuilder = this.postRepository.createQueryBuilder('post');

    const [data, meta] = await queryBuilder.paginate(postPageOptionsDto);

    return { data, meta };
  }

  async getSinglePost(id: Uuid): Promise<PostEntity | null> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id });

    return await queryBuilder.getOne();
  }

  async updatePost(postEntity: PostEntity, updatePostDto: UpdatePostDto): Promise<void> {
    const newPost = this.postRepository.merge(postEntity, updatePostDto);

    await this.postRepository.save(newPost);
  }

  async deletePost(postEntity: PostEntity): Promise<void> {
    await this.postRepository.remove(postEntity);
  }
}
