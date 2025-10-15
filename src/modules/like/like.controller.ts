import { Body, Controller, Delete, Post } from '@nestjs/common';

import { LikeService } from './like.service.ts';
import { RoleType } from '../../constants/role-type.ts';
import { Auth } from '../../decorators/http.decorators.ts';
import { AddLike } from './dtos/create-like.dto.ts';
import { Unlike } from './dtos/un-like.dto.ts';
import { CreateLikeTransformer } from '../../transformer/like.transformer.ts';
import { UserEntity } from '../../modules/user/user.entity.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';

@Controller('likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post()
  @Auth([RoleType.USER])
  async like(
    @Body() body: AddLike,
    @AuthUser() user: UserEntity,
  ): Promise<CreateLikeTransformer> {
    const entity = await this.likeService.like({ ...body, userId: user.id });

    return new CreateLikeTransformer(entity);
  }

  @Delete()
  @Auth([RoleType.USER])
  async unlike(@Body() body: Unlike): Promise<boolean> {
    return await this.likeService.unlike(body);
  }
}
