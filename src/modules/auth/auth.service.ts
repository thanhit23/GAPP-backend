import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

import { validateHash } from '../../common/utils.ts';
import type { RoleType } from '../../constants/role-type.ts';
import { TokenType } from '../../constants/token-type.ts';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';
import { ApiConfigService } from '../../shared/services/api-config.service.ts';
import type { UserEntity } from '../user/user.entity.ts';
import { UserService } from '../user/user.service.ts';
import { TokenPayloadDto } from './dto/token-payload.dto.ts';
import type { UserLoginDto } from './dto/user-login.dto.ts';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async createAccessToken(data: {
    role: RoleType;
    userId: string;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity | null> {
    const foundUser = await this.userService.findOne({
      email: userLoginDto.email,
    });

    const foundUserByUsername = await this.userService.findOne({
      username: userLoginDto.email,
    });

    if (!foundUser && !foundUserByUsername) {
      throw new UserNotFoundException({
        type: !foundUser ? 'email' : 'username',
        message: !foundUser ? 'Email not found' : 'Username not found',
      });
    }

    const password = foundUser?.password || foundUserByUsername?.password;

    const isPasswordValid = await validateHash(userLoginDto.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return foundUser || foundUserByUsername;
  }
}
