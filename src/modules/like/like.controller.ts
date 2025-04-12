import { Body, Controller, Delete, Param, Post } from '@nestjs/common';

import { LikeService } from './like.service.ts';
import { RoleType } from '../../constants/role-type.ts';
import { Auth } from '../../decorators/http.decorators.ts';
import { CreateLikeDto } from './dtos/create-like.dto.ts';
import { CreateLikeTransformer } from '../../transformer/like.transformer.ts';

@Controller('likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post()
  @Auth([RoleType.USER])
  async like(@Body() body: CreateLikeDto): Promise<CreateLikeTransformer> {
    const entity = await this.likeService.like(body);
    return new CreateLikeTransformer(entity);
  }

  @Delete(':id')
  @Auth([RoleType.USER])
  async unLike(@Param('id') id: string): Promise<void> {
    return await this.likeService.unLike(id);
  }
}
