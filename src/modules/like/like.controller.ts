import { Body, Controller, Delete, Post } from '@nestjs/common';

import { LikeService } from './like.service.ts';
import { RoleType } from '../../constants/role-type.ts';
import { Auth } from '../../decorators/http.decorators.ts';
import { CreateLikeDto } from './dtos/create-like.dto.ts';
import { UnLikeDto } from './dtos/un-like.dto.ts';
import { CreateLikeTransformer } from '../../transformer/like.transformer.ts';
import { UserEntity } from '../../modules/user/user.entity.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';

@Controller('likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post()
  @Auth([RoleType.USER])
  async like(
    @Body() body: CreateLikeDto,
    @AuthUser() user: UserEntity,
  ): Promise<CreateLikeTransformer> {
    const entity = await this.likeService.like({ ...body, userId: user.id });

    return new CreateLikeTransformer(entity);
  }

  @Delete()
  @Auth([RoleType.USER])
  async unLike(@Body() body: UnLikeDto): Promise<boolean> {
    return await this.likeService.unLike(body);
  }
}
