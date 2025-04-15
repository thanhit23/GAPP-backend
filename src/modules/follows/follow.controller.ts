import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { RoleType } from '../../constants/role-type.ts';
import { Auth } from '../../decorators/http.decorators.ts';
import { FollowService } from './follow.service.ts';
import { GetPostsTransformer } from '../../transformer/post.transformer.ts';
import {
  CreateNewsFeedTransformer,
  GetNewsFeedTransformer,
  GetSingleNewsFeedTransformer,
} from '../../transformer/news-feed.transformer.ts';
import { FollowUserDto } from './dtos/create-follow.dto.ts';
import { PageOptionsDto } from '../../common/dto/page-options.dto.ts';

@Controller('follows')
export class FollowerController {
  constructor(private followService: FollowService) {}

  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() body: FollowUserDto,
  ): Promise<CreateNewsFeedTransformer> {
    const entity = await this.followService.createFollow(body);

    return new CreateNewsFeedTransformer(entity);
  }

  @Get()
  @Auth([RoleType.USER])
  async get(
    @Query() pageOptions: PageOptionsDto,
  ): Promise<GetPostsTransformer> {
    const entity = await this.followService.getPaginatedFollowers(pageOptions);

    return new GetNewsFeedTransformer(entity);
  }

  @Get(':id')
  @Auth([RoleType.USER])
  async getFollower(@Param('id') id: string) {
    const entity = await this.followService.getFollower(id);

    return new GetSingleNewsFeedTransformer(entity);
  }

  @Delete(':id')
  @Auth([RoleType.USER])
  async delete(@Param('id') id: string) {
    return await this.followService.unfollow(id);
  }
}
