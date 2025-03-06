import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { PostEntity } from './post.entity.ts';
import { PostRepository } from './post.repository.ts';
import { CreatePostDto } from './dtos/create-post.dto.ts';
import { PostNotFoundException } from './exceptions/post-not-found.exception.ts';

import type { PostDto } from './dtos/post.dto.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import type { UpdatePostDto } from './dtos/update-post.dto.ts';
import type { PostPageOptionsDto } from './dtos/post-page-options.dto.ts';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  @Transactional()
  createPost(userId: Uuid, createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postRepository.createPost(userId, createPostDto);
  }

  async getAllPost(
    postPageOptionsDto: PostPageOptionsDto,
  ): Promise<PageDto<PostDto>> {
    return await this.postRepository.getAllPost(postPageOptionsDto);
  }

  async getSinglePost(id: Uuid): Promise<PostEntity> {
    const postEntity = await this.postRepository.getSinglePost(id);

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    return postEntity;
  }

  async updatePost(id: Uuid, updatePostDto: UpdatePostDto): Promise<boolean> {
    const postEntity = await this.postRepository.getSinglePost(id);

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    await this.postRepository.updatePost(postEntity, updatePostDto);

    return true;
  }

  async deletePost(id: Uuid): Promise<boolean> {
    const postEntity = await this.postRepository.getSinglePost(id);

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    await this.postRepository.deletePost(postEntity);

    return true;
  }
}
