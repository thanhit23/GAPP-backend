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
import { AuthUser } from '../../decorators/auth-user.decorator.ts';
import { Auth, UUIDParam } from '../../decorators/http.decorators.ts';
import { UserEntity } from '../user/user.entity.ts';
import { CreatePostDto } from './dtos/create-post.dto.ts';
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
  async create(
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
  async get(
    @Query() postsPageOptionsDto: PostPageOptionsDto,
    @AuthUser() user: UserEntity,
  ): Promise<GetPostsTransformer> {
    const entity = await this.postService.getAllPost(
      postsPageOptionsDto,
      user.id,
    );

    return new GetPostsTransformer(entity);
  }

  @Get(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  async getSinglePost(
    @UUIDParam('id') id: string,
    @AuthUser() user: UserEntity,
  ): Promise<GetSinglePostTransformer> {
    const entity = await this.postService.getSinglePost(id, user.id);

    return new GetSinglePostTransformer(entity);
  }

  @Get('username/:username')
  @Auth([RoleType.USER])
  async getByUsername(
    @Query() postsPageOptionsDto: PostPageOptionsDto,
    @Param('username') username: string,
  ): Promise<GetPostsTransformer> {
    const entity = await this.postService.getByUsername(
      postsPageOptionsDto,
      username,
    );

    return new GetPostsTransformer(entity);
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async put(
    @UUIDParam('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<{ data: boolean }> {
    await this.postService.updatePost(id, updatePostDto);

    return { data: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async delete(@UUIDParam('id') id: string): Promise<boolean> {
    return await this.postService.deletePost(id);
  }
}
