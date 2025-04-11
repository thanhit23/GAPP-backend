import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class UpdateUserDto {
  @StringFieldOptional()
  readonly name?: string;

  @StringFieldOptional()
  readonly username?: string;

  @StringFieldOptional()
  readonly bio?: string;

  @StringFieldOptional()
  readonly password?: string;
}
