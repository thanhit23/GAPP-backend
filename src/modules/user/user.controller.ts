import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Body,
  Query,
  ValidationPipe,
} from '@nestjs/common';

import { PageDto } from '../../common/dto/page.dto.ts';
import { RoleType } from '../../constants/role-type.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';
import { Auth, UUIDParam } from '../../decorators/http.decorators.ts';
import { UseLanguageInterceptor } from '../../interceptors/language-interceptor.service.ts';
import { TranslationService } from '../../shared/services/translation.service.ts';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto.ts';
import { UserEntity } from './user.entity.ts';
import { UserService } from './user.service.ts';
import {
  ProfileTransformer,
  SuggestUserTransformer,
} from '../../transformer/user.transformer.ts';
import { UpdateUserDto } from './dtos/user-update.dto.ts';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly translationService: TranslationService,
  ) {}

  @Get('admin')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @UseLanguageInterceptor()
  async admin(@AuthUser() user: UserEntity) {
    const translation = await this.translationService.translate(
      'admin.keywords.admin',
    );

    return {
      text: `${translation} ${user.username}`,
    };
  }

  @Get()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get('suggests')
  @Auth([RoleType.USER])
  async findSuggestedFollowers(
    @AuthUser() user: UserEntity,
  ): Promise<SuggestUserTransformer> {
    const entity = await this.userService.findSuggestedFollowers(user.id);

    return new SuggestUserTransformer(entity);
  }

  @Get(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  getUser(@UUIDParam('id') userId: string): Promise<UserEntity | null> {
    return this.userService.getUser(userId);
  }

  @Get('profile/:username')
  @Auth([RoleType.USER])
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<ProfileTransformer> {
    const user = await this.userService.getUserByUsername(username);

    return new ProfileTransformer(user);
  }

  @Put(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @UUIDParam('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }
}
