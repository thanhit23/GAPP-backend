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
import { RoleType } from '../../constants/role-type.ts';
import { CreateCommentDto } from './dtos/create-comment.dto.ts';
import { Auth, UUIDParam } from '../../decorators/http.decorators.ts';
import { UpdateCommentDto } from './dtos/update-comment.dto.ts';
import { GetCommentDto } from './dtos/get-comment.dto';
import {
  CreateCommentTransformer,
  GetCommentByOptionTransformer,
} from '../../transformer/comment.transformer.ts';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  @Auth([RoleType.USER])
  async creation(
    @Body() body: CreateCommentDto,
  ): Promise<CreateCommentTransformer> {
    const entity = await this.commentService.creation(body);
    return new CreateCommentTransformer(entity);
  }

  @Get()
  @Auth([RoleType.USER])
  async getByOptions(
    @Query()
    query: GetCommentDto,
  ): Promise<GetCommentByOptionTransformer> {
    const entity = await this.commentService.getByOptions(query);

    return new GetCommentByOptionTransformer(entity);
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
