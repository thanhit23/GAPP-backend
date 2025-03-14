import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { RoleType } from '../../constants/role-type.ts';
import { Auth } from '../../decorators/http.decorators.ts';
import { FollowService } from './follow.service.ts';
import { FollowDto } from './dtos/follow.dto.ts';
import { GetPostsTransformer } from '../../transformer/post.transformer.ts';
import {
  CreateNewsFeedTransformer,
  GetNewsFeedTransformer,
  GetSingleNewsFeedTransformer,
} from '../../transformer/news-feed.transformer.ts';
import { ApiPageResponse } from '../../decorators/api-page-response.decorator.ts';
import { UpdateFollowDto } from './dtos/update-follow.dto.ts';
import { CreateFollowDto } from './dtos/create-follow.dto.ts';
import { PageOptionsDto } from '../../common/dto/page-options.dto.ts';

@Controller('follows')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  async createFollow(
    @Body() followDto: CreateFollowDto,
  ): Promise<CreateNewsFeedTransformer> {
    const entity = await this.followService.createFollow(followDto);

    return new CreateNewsFeedTransformer(entity);
  }

  @Get()
  @Auth([RoleType.USER])
  @ApiPageResponse({ type: FollowDto })
  async getFollows(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<GetPostsTransformer> {
    const entity = await this.followService.getAllFollow(pageOptionsDto);

    return new GetNewsFeedTransformer(entity);
  }

  @Get(':id')
  @Auth([RoleType.USER])
  async getSingleFollow(@Param('id') id: string) {
    const entity = await this.followService.getSingleFollow(id);

    return new GetSingleNewsFeedTransformer(entity);
  }

  @Put(':id')
  @Auth([RoleType.USER])
  async updateFollow(
    @Param('id') id: string,
    @Body() updateFollowDtoDto: UpdateFollowDto,
  ) {
    return await this.followService.updateFollow(id, updateFollowDtoDto);
  }

  @Delete(':id')
  @Auth([RoleType.USER])
  async deleteFollow(@Param('id') id: string) {
    return await this.followService.deleteFollow(id);
  }
}
