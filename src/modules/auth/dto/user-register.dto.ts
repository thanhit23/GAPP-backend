import { Matches } from 'class-validator';
import {
  EmailField,
  PasswordField,
  StringField,
} from '../../../decorators/field.decorators.ts';
import { PASSWORD_REGEX } from '../../../constants/regex.ts';

export class UserRegisterDto {
  @EmailField()
  readonly email!: string;

  @StringField()
  readonly username!: string;

  @PasswordField({ minLength: 6 })
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number or special character',
  })
  readonly password!: string;
}
