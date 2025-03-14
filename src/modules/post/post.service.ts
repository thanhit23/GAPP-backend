import type { Queue, JobStatus, Job } from 'bull';
import { InjectQueue } from '@nestjs/bull';
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
import { FindOneOptions } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    @InjectQueue('post-queue') private postQueue: Queue,
  ) {}

  @Transactional()
  async createPost(
    user_id: string,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const entityPost = await this.postRepository.createPost(
      user_id,
      createPostDto,
    );

    await this.postQueue.add(
      'fan-out-post',
      {
        userId: user_id,
        postId: entityPost.id,
      },
      {
        removeOnComplete: {
          age: 24 * 60 * 60,
          count: 1000,
        },
        removeOnFail: {
          age: 24 * 60 * 60,
        },
      },
    );

    return entityPost;
  }

  async getJobStatus(jobId: string): Promise<string> {
    const job = await this.postQueue.getJob(jobId);
    if (!job) return 'Job not found';
    const state = await job.getState();
    return `Job ${jobId} is ${state}`;
  }

  async getJobs(status: JobStatus[]): Promise<Job<any>[]> {
    return await this.postQueue.getJobs(status);
  }

  async getAllPost(
    postPageOptionsDto: PostPageOptionsDto,
    user_id: string,
  ): Promise<PageDto<PostDto>> {
    return await this.postRepository.getAllPost(postPageOptionsDto, user_id);
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
