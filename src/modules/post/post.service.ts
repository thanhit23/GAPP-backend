import { FindOneOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

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
  constructor(
    private postRepository: PostRepository,
    @InjectQueue('post-queue')
    private postQueue: Queue,
  ) {}

  @Transactional()
  async createPost(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const entityPost = await this.postRepository.createPost(
      userId,
      createPostDto,
    );

    await this.postQueue.add(
      'fan-out-post',
      {
        userId,
        postId: entityPost.id,
      },
      {
        removeOnComplete: {
          age: 24 * 60 * 60,
        },
        removeOnFail: {
          age: 24 * 60 * 60,
        },
      },
    );

    return entityPost;
  }

  async getAllPost(
    postPageOptionsDto: PostPageOptionsDto,
    userId: string,
  ): Promise<PageDto<PostDto>> {
    return await this.postRepository.getAllPost(postPageOptionsDto, userId);
  }

  async findOne(
    optionsDto: FindOneOptions<PostEntity>,
  ): Promise<PostDto | null> {
    return await this.postRepository.findOne(optionsDto);
  }

  async getSinglePost(id: string): Promise<PostEntity> {
    const postEntity = await this.postRepository.getSinglePost(id);

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    return postEntity;
  }

  async getByUsername(
    postPageOptionsDto: PostPageOptionsDto,
    username: string,
  ): Promise<PageDto<PostDto>> {
    const postEntity = await this.postRepository.getByUsername(
      postPageOptionsDto,
      username,
    );

    return postEntity;
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<boolean> {
    const postEntity = await this.postRepository.getSinglePost(id);

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    await this.postRepository.updatePost(postEntity, updatePostDto);

    return true;
  }

  async deletePost(id: string): Promise<boolean> {
    const postEntity = await this.postRepository.getSinglePost(id);

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    await this.postRepository.deletePost(postEntity);

    return true;
  }
}
