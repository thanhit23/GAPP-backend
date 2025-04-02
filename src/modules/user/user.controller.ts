import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Redirect,
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
  @Redirect('news-feed/:id/user')
  redirect() {}

  @Get()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  getUser(@UUIDParam('id') userId: string): Promise<UserEntity | null> {
    return this.userService.getUser(userId);
  }
}
