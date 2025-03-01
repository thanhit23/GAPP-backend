import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import { RoleType } from '../../../constants/role-type.ts';
import {
  BooleanFieldOptional,
  EnumFieldOptional,
  StringFieldOptional,
  EmailField,
  StringField,
} from '../../../decorators/field.decorators.ts';
import type { UserEntity } from '../user.entity.ts';
import type { AbstractEntity } from '../../../common/abstract.entity.ts';

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

  @EmailField()
  email!: string;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @StringField()
  password!: string;

  @StringFieldOptional({ nullable: true })
  bio?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  constructor(user: AbstractEntity & UserEntity, options?: UserDtoOptions) {
    super(user);
    this.email = user.email || '';
    this.name = user.name || '';
    this.username = user.username;
    this.password = user.password || '';
    this.address = user.address;
    this.avatar = user.avatar;
    this.isActive = options?.isActive;
  }
}
