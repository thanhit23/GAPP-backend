import {
  Get,
  Put,
  Post,
  Body,
  Query,
  Delete,
  Controller,
} from '@nestjs/common';

import { CommentService } from './comment.service.ts';
import { GetCommentDto } from './dtos/get-comment.dto';
import { RoleType } from '../../constants/role-type.ts';
import { CreateCommentDto } from './dtos/create-comment.dto.ts';
import { Auth, UUIDParam } from '../../decorators/http.decorators.ts';
import { UpdateCommentDto } from './dtos/update-comment.dto.ts';
import {
  CreateCommentTransformer,
  GetCommentByIdTransformer,
  GetCommentByOptionTransformer,
} from '../../transformer/comment.transformer.ts';
import { UserEntity } from '../../modules/user/user.entity.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  @Auth([RoleType.USER])
  async create(
    @Body() body: CreateCommentDto,
    @AuthUser() user: UserEntity,
  ): Promise<CreateCommentTransformer> {
    const entity = await this.commentService.create({
      ...body,
      userId: user.id,
    });
    return new CreateCommentTransformer(entity);
  }

  @Get()
  @Auth([RoleType.USER])
  async getByOptions(
    @Query()
    query: GetCommentDto,
    @AuthUser() user: UserEntity,
  ): Promise<GetCommentByOptionTransformer> {
    const entity = await this.commentService.getByOptions(query, user.id);

    return new GetCommentByOptionTransformer(entity);
  }

  @Get(':id')
  @Auth([RoleType.USER])
  async getById(
    @UUIDParam('id') id: string,
  ): Promise<GetCommentByIdTransformer> {
    const entity = await this.commentService.getById(id);

    return new GetCommentByIdTransformer(entity);
  }

  @Put(':id')
  @Auth([RoleType.USER])
  async update(
    @UUIDParam('id') id: string,
    @Body() body: UpdateCommentDto,
  ): Promise<{ data: boolean }> {
    await this.commentService.update(id, body);
    return { data: true };
  }

  @Delete(':id')
  @Auth([RoleType.USER])
  async delete(@UUIDParam('id') id: string): Promise<{ data: boolean }> {
    await this.commentService.delete(id);
    return { data: true };
  }
}
