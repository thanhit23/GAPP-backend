import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';

import { RoleType } from '../../constants/role-type.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';
import { Auth } from '../../decorators/http.decorators.ts';
import { UserEntity } from '../user/user.entity.ts';
import { UserService } from '../user/user.service.ts';
import { AuthService } from './auth.service.ts';
import { UserLoginDto } from './dto/user-login.dto.ts';
import { UserRegisterDto } from './dto/user-register.dto.ts';
import {
  GetMeTransformer,
  LoginTransformer,
  RegisterTransformer,
} from '../../transformer/auth.transformer.ts';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginTransformer> {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: RoleType.USER,
    });

    return new LoginTransformer({ user: userEntity, token });
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<RegisterTransformer> {
    const createdUser = await this.userService.createUser(userRegisterDto);

    return new RegisterTransformer({ ...createdUser, isActive: true });
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  getCurrentUser(@AuthUser() user: UserEntity): GetMeTransformer {
    return new GetMeTransformer(user);
  }
}
