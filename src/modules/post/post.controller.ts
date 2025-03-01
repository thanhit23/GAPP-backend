import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { RoleType } from '../../constants/role-type.ts';
import { ApiPageResponse } from '../../decorators/api-page-response.decorator.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';
import { Auth, UUIDParam } from '../../decorators/http.decorators.ts';
import { UserEntity } from '../user/user.entity.ts';
import { CreatePostDto } from './dtos/create-post.dto.ts';
import { PostDto } from './dtos/post.dto.ts';
import { PostPageOptionsDto } from './dtos/post-page-options.dto.ts';
import { UpdatePostDto } from './dtos/update-post.dto.ts';
import { PostService } from './post.service.ts';
import {
  CreatePostTransformer,
  GetPostsTransformer,
  GetSinglePostTransformer,
} from '../../transformer/post.transformer.ts';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @AuthUser() user: UserEntity,
  ) {
    const postEntity = await this.postService.createPost(
      user.id,
      createPostDto,
    );

    return new CreatePostTransformer(postEntity);
  }

  @Get()
  @Auth([RoleType.USER])
  @ApiPageResponse({ type: PostDto })
  async getPosts(
    @Query() postsPageOptionsDto: PostPageOptionsDto,
  ): Promise<GetPostsTransformer> {
    const entity = await this.postService.getAllPost(postsPageOptionsDto);

    return new GetPostsTransformer(entity);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getSinglePost(@UUIDParam('id') id: Uuid): Promise<GetSinglePostTransformer> {
    const entity = await this.postService.getSinglePost(id);

    return new GetSinglePostTransformer(entity);
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async updatePost(
    @UUIDParam('id') id: Uuid,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<{ data: boolean }> {
    await this.postService.updatePost(id, updatePostDto);

    return { data: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async deletePost(@UUIDParam('id') id: Uuid): Promise<boolean> {
    return await this.postService.deletePost(id);
  }
}
