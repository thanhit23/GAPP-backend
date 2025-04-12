import { BadRequestException, Injectable } from '@nestjs/common';

import { LikeEntity } from './like.entity';
import { LikeRepository } from './like.repository';
import { CreateLikeDto } from './dtos/create-like.dto';

@Injectable()
export class LikeService {
  constructor(private likeRepository: LikeRepository) {}

  async like(entityDto: CreateLikeDto): Promise<LikeEntity> {
    const entity = await this.likeRepository.checkLike(entityDto);

    if (entity) {
      throw new BadRequestException('You have already liked this post');
    }

    return await this.likeRepository.like(entityDto);
  }

  async unLike(id: string): Promise<void> {
    const entity = await this.likeRepository.checkLike({ id });

    if (!entity) {
      throw new BadRequestException('You have not liked this post');
    }

    return await this.likeRepository.unLike(id);
  }
}
