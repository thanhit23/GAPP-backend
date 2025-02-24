import {
  EmailField,
  PasswordField,
  StringField,
} from '../../../decorators/field.decorators.ts';

export class UserRegisterDto {
  @EmailField()
  readonly email!: string;

  @StringField()
  readonly username!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;
}
