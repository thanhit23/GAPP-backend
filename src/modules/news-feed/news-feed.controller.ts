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
import { NewsFeedService } from './news-feed.service.ts';
import { NewsFeedDto } from './dtos/news-feed.dto.ts';
import { GetPostsTransformer } from '../../transformer/post.transformer.ts';
import {
  CreateNewsFeedTransformer,
  GetNewsFeedTransformer,
  GetSingleNewsFeedTransformer,
} from '../../transformer/news-feed.transformer.ts';
import { NewsFeedPageOptionsDto } from './dtos/news-feed-page-options.dto.ts';
import { ApiPageResponse } from '../../decorators/api-page-response.decorator.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';
import { UserEntity } from '../user/user.entity.ts';
import { UpdateNewsFeedDto } from './dtos/update-news-feed.dto.ts';
import { CreateNewsFeedDto } from './dtos/create-news-feed.dto.ts';

@Controller('news-feed')
export class NewsFeedController {
  constructor(private newsFeedService: NewsFeedService) {}

  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() newsFeedDto: CreateNewsFeedDto,
    @AuthUser() user: UserEntity,
  ): Promise<CreateNewsFeedTransformer> {
    const entity = await this.newsFeedService.create({
      ...newsFeedDto,
      userId: user.id,
    });

    return new CreateNewsFeedTransformer(entity);
  }

  @Get()
  @Auth([RoleType.USER])
  @ApiPageResponse({ type: NewsFeedDto })
  async getNewsFeeds(
    @Query() pageOptionsDto: NewsFeedPageOptionsDto,
    @AuthUser() user: UserEntity,
  ): Promise<GetPostsTransformer> {
    const entity = await this.newsFeedService.getNewsFeedList(
      user.id,
      pageOptionsDto,
    );

    return new GetNewsFeedTransformer(entity);
  }

  @Get(':id')
  @Auth([RoleType.USER])
  async getSingleNewsFeed(@Param('id') id: string) {
    const entity = await this.newsFeedService.getSingleNewsFeed(id);

    return new GetSingleNewsFeedTransformer(entity);
  }

  @Put(':id')
  @Auth([RoleType.USER])
  async updateNewsFeed(
    @Param('id') id: string,
    @Body() updateNewsFeedDto: UpdateNewsFeedDto,
  ) {
    return await this.newsFeedService.updateNewsFeed(id, updateNewsFeedDto);
  }

  @Delete(':id')
  @Auth([RoleType.USER])
  async deleteNewsFeed(@Param('id') id: string) {
    return await this.newsFeedService.deleteNewsFeed(id);
  }
}
