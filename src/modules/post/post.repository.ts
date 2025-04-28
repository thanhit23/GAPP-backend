import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { PostEntity } from './post.entity.ts';
import { CreatePostDto } from './dtos/create-post.dto.ts';

import type { PostDto } from './dtos/post.dto.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import type { UpdatePostDto } from './dtos/update-post.dto.ts';
import type { PostPageOptionsDto } from './dtos/post-page-options.dto.ts';
import { UserEntity } from '../user/user.entity.ts';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  @Transactional()
  async createPost(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const postEntity = this.postRepository.create({ userId, ...createPostDto });

    await this.postRepository.save(postEntity);

    return postEntity;
  }

  async getAllPost(
    postPageOptionsDto: PostPageOptionsDto,
    userId: string,
  ): Promise<PageDto<PostDto>> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.userId = :userId', { userId })
      .select(['post', 'user.avatar', 'user.username', 'user.id', 'user.name'])
      .groupBy('post.id, user.id');

    const [data, meta] = await queryBuilder.paginate(postPageOptionsDto);

    return { data, meta };
  }

  async getSinglePost(id: string): Promise<PostEntity | null> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id })
      .innerJoinAndSelect('post.user', 'user')
      .select([
        'post',
        'user.avatar',
        'user.name',
        'user.username',
        'user.id',
        'user.name',
      ]);

    return await queryBuilder.getOne();
  }

  async getByUsername(
    postPageOptionsDto: PostPageOptionsDto,
    username: string,
  ): Promise<PageDto<PostDto>> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.userId = :userId', { userId: user.id })
      .select(['post', 'user.avatar', 'user.username', 'user.id', 'user.name'])
      .groupBy('post.id, user.id');

    const [data, meta] = await queryBuilder.paginate(postPageOptionsDto);

    return { data, meta };
  }

  async findOne(
    option: FindOneOptions<PostEntity>,
  ): Promise<PostEntity | null> {
    return await this.postRepository.findOne(option);
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
