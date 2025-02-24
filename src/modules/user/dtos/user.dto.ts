import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import { RoleType } from '../../../constants/role-type.ts';
import {
  BooleanFieldOptional,
  EmailFieldOptional,
  EnumFieldOptional,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';
import type { UserEntity } from '../user.entity.ts';

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  address?: string | null;

  @StringFieldOptional({ nullable: true })
  username?: string | null;

  @StringFieldOptional({ nullable: true })
  name?: string | null;

  @EnumFieldOptional(() => RoleType)
  role?: RoleType;

  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @StringFieldOptional({ nullable: true })
  password?: string | null;

  @StringFieldOptional({ nullable: true })
  bio?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.email = user.email;
    this.name = user.name || '';
    this.username = user.username;
    this.password = user.password;
    this.address = user.address;
    this.avatar = user.avatar;
    this.isActive = options?.isActive;
  }
}
