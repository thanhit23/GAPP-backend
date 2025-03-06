import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { PostEntity } from './post.entity.ts';
import { CreatePostDto } from './dtos/create-post.dto.ts';

import type { PostDto } from './dtos/post.dto.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import type { UpdatePostDto } from './dtos/update-post.dto.ts';
import type { PostPageOptionsDto } from './dtos/post-page-options.dto.ts';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  @Transactional()
  async createPost(
    userId: Uuid,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const postEntity = this.postRepository.create({ userId, ...createPostDto });

    await this.postRepository.save(postEntity);

    return postEntity;
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

  async updatePost(
    postEntity: PostEntity,
    updatePostDto: UpdatePostDto,
  ): Promise<void> {
    const newPost = this.postRepository.merge(postEntity, updatePostDto);

    await this.postRepository.save(newPost);
  }

  async deletePost(postEntity: PostEntity): Promise<void> {
    await this.postRepository.remove(postEntity);
  }
}
